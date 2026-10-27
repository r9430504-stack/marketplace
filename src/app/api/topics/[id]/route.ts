import { auth } from "@/auth";
import {
  getTopic,
  listReplies,
  addReply,
  deleteTopic,
  deleteReply,
  topicLikeInfo,
  setTopicPinned,
  setTopicLocked,
} from "@/lib/db";
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
    const [replies, like] = await Promise.all([listReplies(id, me), topicLikeInfo(id, me)]);
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
        pinned: topic.pinned,
        locked: topic.locked,
        likes: like.likes,
        liked: like.liked,
      },
      replies: replies.map((r) => ({
        id: String(r.id),
        body: r.body,
        createdAt: r.created_at,
        mine: canModerate(r.user_id),
        likes: r.likes,
        liked: r.liked,
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
    const topic = await getTopic(id);
    if (!topic) return Response.json({ error: "not_found" }, { status: 404 });
    if (topic.locked) return Response.json({ error: "locked" }, { status: 423 });
    const c = await addReply(id, me, text);
    if (!c) return Response.json({ error: "disabled" }, { status: 503 });
    return Response.json({ reply: { id: String(c.id), body: c.body, createdAt: c.created_at, mine: true, likes: 0, liked: false } });
  } catch {
    return Response.json({ error: "server" }, { status: 500 });
  }
}

// PATCH /api/topics/:id { pinned?, locked? } — owner-only moderation.
export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isId(id)) return Response.json({ error: "bad_request" }, { status: 400 });
  const me = await userKey();
  const isOwner = !!me && !!OWNER && me.toLowerCase() === OWNER;
  if (!isOwner) return Response.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}) as { pinned?: unknown; locked?: unknown });
  try {
    if (typeof body.pinned === "boolean") await setTopicPinned(id, body.pinned);
    if (typeof body.locked === "boolean") await setTopicLocked(id, body.locked);
    return Response.json({ ok: true });
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
