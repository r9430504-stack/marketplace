import { auth } from "@/auth";
import { getComments, addComment, deleteComment } from "@/lib/db";

export const runtime = "nodejs";

// The signed-in user's key (their Google email). Null when not signed in.
// Used server-side only for accountability/moderation — never sent to clients.
async function userKey(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.email ?? null;
  } catch {
    return null;
  }
}

const OWNER = (process.env.OWNER_EMAIL || "").toLowerCase();
const isSlug = (s: unknown): s is string => typeof s === "string" && /^[a-z0-9-]{1,64}$/.test(s);
const MAX_LEN = 1000;

// Small best-effort per-instance rate limit: N posts/min per user.
const hits = new Map<string, number[]>();
function limited(key: string, max = 6, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > max;
}

// Keep only the comment text: strip control characters, collapse blank lines,
// trim and cap length. No HTML is ever rendered (the client prints plain text).
function clean(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\r\n?/g, "\n")
    .replace(/[\t\f\v ]+/g, " ")
    .replace(/\p{Cc}/gu, (c) => (c === "\n" ? c : ""))
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_LEN);
}

// GET /api/comments?slug=galaxy-s24-ultra  — public. Returns text + time only.
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!isSlug(slug)) return Response.json({ comments: [] });
  const me = await userKey();
  const meLower = me?.toLowerCase() ?? null;
  try {
    const rows = await getComments(slug);
    const comments = rows.map((r) => ({
      id: String(r.id),
      body: r.body,
      createdAt: r.created_at,
      // Whether the current viewer may delete this one — no identity leaked.
      mine: !!me && (r.user_id === me || (!!OWNER && meLower === OWNER)),
    }));
    return Response.json({ comments });
  } catch {
    return Response.json({ comments: [] });
  }
}

// POST /api/comments  { slug, body }  — requires a signed-in Google session.
export async function POST(req: Request) {
  const me = await userKey();
  if (!me) return Response.json({ error: "unauthorized" }, { status: 401 });
  if (limited(me)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => ({}) as { slug?: unknown; body?: unknown });
  if (!isSlug(body.slug)) return Response.json({ error: "bad_request" }, { status: 400 });
  const text = clean(body.body);
  if (text.length < 2) return Response.json({ error: "empty" }, { status: 400 });

  try {
    const c = await addComment(body.slug, me, text);
    if (!c) return Response.json({ error: "disabled" }, { status: 503 });
    return Response.json({
      comment: { id: String(c.id), body: c.body, createdAt: c.created_at, mine: true },
    });
  } catch {
    return Response.json({ error: "server" }, { status: 500 });
  }
}

// DELETE /api/comments?id=123  — author (or the site owner) only.
export async function DELETE(req: Request) {
  const me = await userKey();
  if (!me) return Response.json({ error: "unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id || !/^\d+$/.test(id)) return Response.json({ error: "bad_request" }, { status: 400 });
  const isOwner = !!OWNER && me.toLowerCase() === OWNER;
  try {
    await deleteComment(id, me, isOwner);
  } catch {}
  return Response.json({ ok: true });
}
