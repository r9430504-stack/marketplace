import { Pool } from "pg";

// Postgres access for cloud-synced favorites. Everything degrades gracefully:
// if DATABASE_URL isn't set, these are no-ops and the app keeps working with
// device-local favorites only.
let pool: Pool | null = null;
let ready: Promise<void> | null = null;

function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  }
  return pool;
}

function ensure(p: Pool): Promise<void> {
  if (!ready) {
    ready = p
      .query(
        `CREATE TABLE IF NOT EXISTS favorites (
           user_id    text        NOT NULL,
           slug       text        NOT NULL,
           created_at timestamptz NOT NULL DEFAULT now(),
           PRIMARY KEY (user_id, slug)
         );
         CREATE TABLE IF NOT EXISTS comments (
           id         bigserial   PRIMARY KEY,
           slug       text        NOT NULL,
           user_id    text        NOT NULL,
           body       text        NOT NULL,
           created_at timestamptz NOT NULL DEFAULT now()
         );
         CREATE INDEX IF NOT EXISTS comments_slug_idx ON comments (slug, created_at DESC);`
      )
      .then(() => undefined);
  }
  return ready;
}

export async function getFavorites(userId: string): Promise<string[]> {
  const p = getPool();
  if (!p) return [];
  await ensure(p);
  const r = await p.query("SELECT slug FROM favorites WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
  return r.rows.map((x: { slug: string }) => x.slug);
}

export async function addFavorites(userId: string, slugs: string[]): Promise<void> {
  const p = getPool();
  if (!p || slugs.length === 0) return;
  await ensure(p);
  const values = slugs.map((_, i) => `($1, $${i + 2})`).join(", ");
  await p.query(
    `INSERT INTO favorites (user_id, slug) VALUES ${values} ON CONFLICT DO NOTHING`,
    [userId, ...slugs]
  );
}

export async function removeFavorite(userId: string, slug: string): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensure(p);
  await p.query("DELETE FROM favorites WHERE user_id = $1 AND slug = $2", [userId, slug]);
}

// ── Comments ────────────────────────────────────────────────────────────────
// user_id (the poster's Google email) is stored ONLY for accountability and
// moderation. It is never returned to the browser — the API strips it and
// exposes just the text + timestamp, so no personal information is shown.
export type CommentRow = { id: string; user_id: string; body: string; created_at: string };

export function commentsEnabled(): boolean {
  return !!process.env.DATABASE_URL;
}

export async function getComments(slug: string, limit = 200): Promise<CommentRow[]> {
  const p = getPool();
  if (!p) return [];
  await ensure(p);
  const r = await p.query(
    "SELECT id, user_id, body, created_at FROM comments WHERE slug = $1 ORDER BY created_at DESC LIMIT $2",
    [slug, limit]
  );
  return r.rows as CommentRow[];
}

export async function addComment(
  slug: string,
  userId: string,
  body: string
): Promise<{ id: string; body: string; created_at: string } | null> {
  const p = getPool();
  if (!p) return null;
  await ensure(p);
  const r = await p.query(
    "INSERT INTO comments (slug, user_id, body) VALUES ($1, $2, $3) RETURNING id, body, created_at",
    [slug, userId, body]
  );
  return r.rows[0] as { id: string; body: string; created_at: string };
}

export async function deleteComment(id: string, userId: string, isOwner: boolean): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensure(p);
  if (isOwner) await p.query("DELETE FROM comments WHERE id = $1", [id]);
  else await p.query("DELETE FROM comments WHERE id = $1 AND user_id = $2", [id, userId]);
}

// ── Forum board ─────────────────────────────────────────────────────────────
// Aggregate view over comments: which models have active discussions, and the
// most recent posts across the whole site. No personal info (no user_id).
export async function getForumBoards(limit = 100): Promise<{ slug: string; count: number; last: string }[]> {
  const p = getPool();
  if (!p) return [];
  await ensure(p);
  const r = await p.query(
    "SELECT slug, count(*)::int AS count, max(created_at) AS last FROM comments GROUP BY slug ORDER BY max(created_at) DESC LIMIT $1",
    [limit]
  );
  return r.rows as { slug: string; count: number; last: string }[];
}

export async function getLatestComments(limit = 15): Promise<{ slug: string; body: string; created_at: string }[]> {
  const p = getPool();
  if (!p) return [];
  await ensure(p);
  const r = await p.query(
    "SELECT slug, body, created_at FROM comments ORDER BY created_at DESC LIMIT $1",
    [limit]
  );
  return r.rows as { slug: string; body: string; created_at: string }[];
}
