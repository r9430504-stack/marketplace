import { auth } from "@/auth";
import { getTopic, toggleTopicLike, toggleReplyLike } from "@/lib/db";

export const runtime = "nodejs";

async function userKey(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.email ?? null;
  } catch {
    return null;
  }
}

type Ctx = { params: Promise<{ id: string }> };
const isId = (s: string) => /^\d+$/.test(s);

// POST /api/topics/:id/like            — toggle a like on the thread
// POST /api/topics/:id/like?reply=123  — toggle a like on one reply
export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isId(id)) return Response.json({ error: "bad_request" }, { status: 400 });
  const me = await userKey();
  if (!me) return Response.json({ error: "unauthorized" }, { status: 401 });

  const replyId = new URL(req.url).searchParams.get("reply");
  try {
    if (!(await getTopic(id))) return Response.json({ error: "not_found" }, { status: 404 });
    if (replyId) {
      if (!isId(replyId)) return Response.json({ error: "bad_request" }, { status: 400 });
      const res = await toggleReplyLike(replyId, me);
      return Response.json(res);
    }
    const res = await toggleTopicLike(id, me);
    return Response.json(res);
  } catch {
    return Response.json({ error: "server" }, { status: 500 });
  }
}
