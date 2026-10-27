import { auth } from "@/auth";
import { listTopics, createTopic, seedForumIfEmpty, TOPIC_CATEGORIES, type TopicCategory } from "@/lib/db";
import { getAllPhones, seriesMeta, hasRuTranslation } from "@/lib/phones";
import { cleanText } from "@/lib/moderation";
import { containsProfanity } from "@/lib/profanity";

export const runtime = "nodejs";

async function userKey(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.email ?? null;
  } catch {
    return null;
  }
}

const isSlug = (s: unknown): s is string => typeof s === "string" && /^[a-z0-9-]{1,64}$/.test(s);

const hits = new Map<string, number[]>();
function limited(key: string, max = 4, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > max;
}

function phoneMeta() {
  return new Map(
    getAllPhones().map((p) => [p.slug, { name: p.name, line: seriesMeta(p.series).label, ru: hasRuTranslation(p.slug) }])
  );
}

// GET /api/topics — list threads (newest activity first). Public, no PII.
export async function GET() {
  try {
    await seedForumIfEmpty();
    const topics = await listTopics();
    const meta = phoneMeta();
    return Response.json({
      topics: topics
        .filter((t) => meta.has(t.slug))
        .map((t) => {
          const m = meta.get(t.slug)!;
          return {
            id: String(t.id),
            slug: t.slug,
            name: m.name,
            line: m.line,
            ru: m.ru,
            title: t.title,
            category: t.category,
            replies: t.replies,
            likes: t.likes,
            pinned: t.pinned,
            locked: t.locked,
            createdAt: t.created_at,
            lastAt: t.last_at,
          };
        }),
    });
  } catch {
    return Response.json({ topics: [] });
  }
}

// POST /api/topics { slug, title, body } — create a thread. Requires a session.
export async function POST(req: Request) {
  const me = await userKey();
  if (!me) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (limited(me)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => ({}) as { slug?: unknown; title?: unknown; body?: unknown; category?: unknown });
  if (!isSlug(body.slug) || !getAllPhones().some((p) => p.slug === body.slug)) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const title = cleanText(body.title, 120);
  const text = cleanText(body.body, 4000);
  if (title.length < 4 || text.length < 5) return Response.json({ error: "empty" }, { status: 400 });
  if (containsProfanity(title) || containsProfanity(text)) {
    return Response.json({ error: "profanity" }, { status: 422 });
  }
  const category: TopicCategory =
    typeof body.category === "string" && (TOPIC_CATEGORIES as readonly string[]).includes(body.category)
      ? (body.category as TopicCategory)
      : "discussion";

  try {
    const t = await createTopic(body.slug, me, title, text, category);
    if (!t) return Response.json({ error: "disabled" }, { status: 503 });
    return Response.json({ id: t.id });
  } catch {
    return Response.json({ error: "server" }, { status: 500 });
  }
}
