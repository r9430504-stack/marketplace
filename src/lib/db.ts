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
         CREATE INDEX IF NOT EXISTS comments_slug_idx ON comments (slug, created_at DESC);
         CREATE TABLE IF NOT EXISTS topics (
           id         bigserial   PRIMARY KEY,
           slug       text        NOT NULL,
           title      text        NOT NULL,
           body       text        NOT NULL,
           user_id    text        NOT NULL,
           created_at timestamptz NOT NULL DEFAULT now(),
           last_at    timestamptz NOT NULL DEFAULT now()
         );
         CREATE INDEX IF NOT EXISTS topics_last_idx ON topics (last_at DESC);
         CREATE TABLE IF NOT EXISTS topic_replies (
           id         bigserial   PRIMARY KEY,
           topic_id   bigint      NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
           body       text        NOT NULL,
           user_id    text        NOT NULL,
           created_at timestamptz NOT NULL DEFAULT now()
         );
         CREATE INDEX IF NOT EXISTS topic_replies_topic_idx ON topic_replies (topic_id, created_at);`
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

// ── Forum topics (threads) ──────────────────────────────────────────────────
// A topic is a user-started thread about a model; replies are the discussion.
// user_id is stored for accountability/moderation and never sent to clients.
export type TopicRow = {
  id: string;
  slug: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
  last_at: string;
};

export async function createTopic(
  slug: string,
  userId: string,
  title: string,
  body: string
): Promise<{ id: string } | null> {
  const p = getPool();
  if (!p) return null;
  await ensure(p);
  const r = await p.query(
    "INSERT INTO topics (slug, user_id, title, body) VALUES ($1, $2, $3, $4) RETURNING id",
    [slug, userId, title, body]
  );
  return { id: String(r.rows[0].id) };
}

export async function listTopics(
  limit = 100
): Promise<{ id: string; slug: string; title: string; created_at: string; last_at: string; replies: number }[]> {
  const p = getPool();
  if (!p) return [];
  await ensure(p);
  const r = await p.query(
    `SELECT t.id, t.slug, t.title, t.created_at, t.last_at,
            (SELECT count(*)::int FROM topic_replies r WHERE r.topic_id = t.id) AS replies
     FROM topics t ORDER BY t.last_at DESC LIMIT $1`,
    [limit]
  );
  return r.rows as { id: string; slug: string; title: string; created_at: string; last_at: string; replies: number }[];
}

export async function getTopic(id: string): Promise<TopicRow | null> {
  const p = getPool();
  if (!p) return null;
  await ensure(p);
  const r = await p.query("SELECT id, slug, title, body, user_id, created_at, last_at FROM topics WHERE id = $1", [id]);
  return (r.rows[0] as TopicRow) ?? null;
}

export async function listReplies(topicId: string): Promise<CommentRow[]> {
  const p = getPool();
  if (!p) return [];
  await ensure(p);
  const r = await p.query(
    "SELECT id, user_id, body, created_at FROM topic_replies WHERE topic_id = $1 ORDER BY created_at ASC",
    [topicId]
  );
  return r.rows as CommentRow[];
}

export async function addReply(
  topicId: string,
  userId: string,
  body: string
): Promise<{ id: string; body: string; created_at: string } | null> {
  const p = getPool();
  if (!p) return null;
  await ensure(p);
  const r = await p.query(
    "INSERT INTO topic_replies (topic_id, user_id, body) VALUES ($1, $2, $3) RETURNING id, body, created_at",
    [topicId, userId, body]
  );
  await p.query("UPDATE topics SET last_at = now() WHERE id = $1", [topicId]);
  return r.rows[0] as { id: string; body: string; created_at: string };
}

export async function deleteTopic(id: string, userId: string, isOwner: boolean): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensure(p);
  if (isOwner) await p.query("DELETE FROM topics WHERE id = $1", [id]);
  else await p.query("DELETE FROM topics WHERE id = $1 AND user_id = $2", [id, userId]);
}

export async function deleteReply(id: string, userId: string, isOwner: boolean): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensure(p);
  if (isOwner) await p.query("DELETE FROM topic_replies WHERE id = $1", [id]);
  else await p.query("DELETE FROM topic_replies WHERE id = $1 AND user_id = $2", [id, userId]);
}
