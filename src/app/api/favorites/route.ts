import { auth } from "@/auth";
import { getFavorites, addFavorites, removeFavorite } from "@/lib/db";

export const runtime = "nodejs";

// The signed-in user's key (their Google email). Null when not signed in.
async function userKey(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.email ?? null;
  } catch {
    return null;
  }
}

const isSlug = (s: unknown): s is string => typeof s === "string" && /^[a-z0-9-]{1,64}$/.test(s);

export async function GET() {
  const uid = await userKey();
  if (!uid) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    return Response.json({ favorites: await getFavorites(uid) });
  } catch {
    return Response.json({ favorites: [] });
  }
}

export async function POST(req: Request) {
  const uid = await userKey();
  if (!uid) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({} as { slug?: unknown; slugs?: unknown }));
  const raw = Array.isArray(body.slugs) ? body.slugs : body.slug !== undefined ? [body.slug] : [];
  const slugs = raw.filter(isSlug).slice(0, 500);
  try {
    await addFavorites(uid, slugs);
  } catch {}
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  const uid = await userKey();
  if (!uid) return Response.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({} as { slug?: unknown }));
  if (isSlug(body.slug)) {
    try {
      await removeFavorite(uid, body.slug);
    } catch {}
  }
  return Response.json({ ok: true });
}
