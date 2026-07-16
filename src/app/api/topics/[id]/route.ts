import { auth } from "@/auth";
import { getTopic, listReplies, addReply, deleteTopic, deleteReply } from "@/lib/db";
import { getAllPhones, seriesMeta, hasRuTranslation } from "@/lib/phones";
import { cleanText } from "@/lib/moderation";
import { containsProfanity } from "@/lib/profanity";

export const runtime = "nodejs";

const OWNER = (process.env.OWNER_EMAIL || "").toLowerCase();

async function userKey(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.email ?? null;
  } catch {
    return null;
  }
}

const hits = new Map<string, number[]>();
function limited(key: string, max = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > max;
}

type Ctx = { params: Promise<{ id: string }> };
const isId = (s: string) => /^\d+$/.test(s);

// GET /api/topics/:id — thread + replies. Public; exposes text + time only.
export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isId(id)) return Response.json({ error: "bad_request" }, { status: 400 });
  const me = await userKey();
  const meLower = me?.toLowerCase() ?? null;
  const canModerate = (uid: string) => !!me && (uid === me || (!!OWNER && meLower === OWNER));
  try {
    const topic = await getTopic(id);
    if (!topic) return Response.json({ error: "not_found" }, { status: 404 });
    const meta = getAllPhones().find((p) => p.slug === topic.slug);
    const replies = await listReplies(id);
    return Response.json({
      topic: {
        id: String(topic.id),
        slug: topic.slug,
        name: meta?.name ?? topic.slug,
        line: meta ? seriesMeta(meta.series).label : "",
        ru: hasRuTranslation(topic.slug),
        title: topic.title,
        body: topic.body,
        createdAt: topic.created_at,
        mine: canModerate(topic.user_id),
      },
      replies: replies.map((r) => ({
        id: String(r.id),
        body: r.body,
        createdAt: r.created_at,
        mine: canModerate(r.user_id),
      })),
    });
  } catch {
    return Response.json({ error: "server" }, { status: 500 });
  }
}

// POST /api/topics/:id { body } — add a reply. Requires a session.
export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isId(id)) return Response.json({ error: "bad_request" }, { status: 400 });
  const me = await userKey();
  if (!me) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (limited(me)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => ({}) as { body?: unknown });
  const text = cleanText(body.body, 2000);
  if (text.length < 2) return Response.json({ error: "empty" }, { status: 400 });
  if (containsProfanity(text)) return Response.json({ error: "profanity" }, { status: 422 });

  try {
    if (!(await getTopic(id))) return Response.json({ error: "not_found" }, { status: 404 });
    const c = await addReply(id, me, text);
    if (!c) return Response.json({ error: "disabled" }, { status: 503 });
    return Response.json({ reply: { id: String(c.id), body: c.body, createdAt: c.created_at, mine: true } });
  } catch {
    return Response.json({ error: "server" }, { status: 500 });
  }
}

// DELETE /api/topics/:id           — delete the thread (author/owner)
// DELETE /api/topics/:id?reply=123 — delete one reply (author/owner)
export async function DELETE(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const me = await userKey();
  if (!me) return Response.json({ error: "unauthorized" }, { status: 401 });
  const isOwner = !!OWNER && me.toLowerCase() === OWNER;
  const replyId = new URL(req.url).searchParams.get("reply");
  try {
    if (replyId) {
      if (!isId(replyId)) return Response.json({ error: "bad_request" }, { status: 400 });
      await deleteReply(replyId, me, isOwner);
    } else {
      if (!isId(id)) return Response.json({ error: "bad_request" }, { status: 400 });
      await deleteTopic(id, me, isOwner);
    }
  } catch {}
  return Response.json({ ok: true });
}
