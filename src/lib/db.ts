import { Pool } from "pg";
import type { Phone } from "@/lib/phones";
import { FORUM_SEED } from "@/lib/forumSeed";

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
         CREATE INDEX IF NOT EXISTS topic_replies_topic_idx ON topic_replies (topic_id, created_at);
         CREATE TABLE IF NOT EXISTS custom_phones (
           slug       text        PRIMARY KEY,
           data       jsonb       NOT NULL,
           created_at timestamptz NOT NULL DEFAULT now()
         );
         CREATE TABLE IF NOT EXISTS site_settings (
           key   text PRIMARY KEY,
           value text NOT NULL
         );
         -- Forum moderation flags (added after the initial release).
         ALTER TABLE topics ADD COLUMN IF NOT EXISTS pinned boolean NOT NULL DEFAULT false;
         ALTER TABLE topics ADD COLUMN IF NOT EXISTS locked boolean NOT NULL DEFAULT false;
         -- Thread category: 'discussion' | 'question' | 'problem'.
         ALTER TABLE topics ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'discussion';
         -- Likes on threads and replies. One row per (post, user).
         CREATE TABLE IF NOT EXISTS topic_likes (
           topic_id   bigint      NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
           user_id    text        NOT NULL,
           created_at timestamptz NOT NULL DEFAULT now(),
           PRIMARY KEY (topic_id, user_id)
         );
         CREATE TABLE IF NOT EXISTS reply_likes (
           reply_id   bigint      NOT NULL REFERENCES topic_replies(id) ON DELETE CASCADE,
           user_id    text        NOT NULL,
           created_at timestamptz NOT NULL DEFAULT now(),
           PRIMARY KEY (reply_id, user_id)
         );`
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
// Thread categories. Kept as a plain string in the DB but constrained here.
export const TOPIC_CATEGORIES = ["discussion", "question", "problem"] as const;
export type TopicCategory = (typeof TOPIC_CATEGORIES)[number];

export type TopicRow = {
  id: string;
  slug: string;
  title: string;
  body: string;
  user_id: string;
  created_at: string;
  last_at: string;
  pinned: boolean;
  locked: boolean;
  category: string;
};

export type TopicListRow = {
  id: string;
  slug: string;
  title: string;
  created_at: string;
  last_at: string;
  replies: number;
  likes: number;
  pinned: boolean;
  locked: boolean;
  category: string;
};

export async function createTopic(
  slug: string,
  userId: string,
  title: string,
  body: string,
  category: TopicCategory = "discussion"
): Promise<{ id: string } | null> {
  const p = getPool();
  if (!p) return null;
  await ensure(p);
  const r = await p.query(
    "INSERT INTO topics (slug, user_id, title, body, category) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [slug, userId, title, body, category]
  );
  return { id: String(r.rows[0].id) };
}

// Seed the forum with starter discussions on first use, but only while it's
// still completely empty. Runs at most once per server process.
const SEED_USER = "seed@galaxyarchive.org";
let seedTried = false;

export async function seedForumIfEmpty(): Promise<void> {
  const p = getPool();
  if (!p || seedTried) return;
  seedTried = true;
  try {
    await ensure(p);
    const existing = await p.query("SELECT count(*)::int AS n FROM topics");
    if ((existing.rows[0]?.n ?? 0) > 0) return;
    const now = Date.now();
    for (let i = 0; i < FORUM_SEED.length; i++) {
      const t = FORUM_SEED[i];
      const createdAt = new Date(now - (i * 8 + 6) * 3_600_000);
      const lastAt = t.replies?.length ? new Date(now - (i + 1) * 2 * 3_600_000) : createdAt;
      // Problems are pre-tagged; otherwise a "?" title is a question, else a discussion.
      const category = t.category ?? (t.title.trim().endsWith("?") ? "question" : "discussion");
      const ins = await p.query(
        "INSERT INTO topics (slug, user_id, title, body, category, created_at, last_at) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id",
        [t.slug, SEED_USER, t.title, t.body, category, createdAt, lastAt]
      );
      const id = ins.rows[0].id;
      for (let j = 0; j < (t.replies?.length ?? 0); j++) {
        await p.query(
          "INSERT INTO topic_replies (topic_id, user_id, body, created_at) VALUES ($1,$2,$3,$4)",
          [id, SEED_USER, t.replies![j], new Date(createdAt.getTime() + (j + 1) * 3_600_000)]
        );
      }
    }
  } catch {
    seedTried = false; // allow a retry on a later request if this run failed
  }
}

export async function listTopics(limit = 100): Promise<TopicListRow[]> {
  const p = getPool();
  if (!p) return [];
  await ensure(p);
  const r = await p.query(
    `SELECT t.id, t.slug, t.title, t.created_at, t.last_at, t.pinned, t.locked, t.category,
            (SELECT count(*)::int FROM topic_replies r WHERE r.topic_id = t.id) AS replies,
            (SELECT count(*)::int FROM topic_likes l WHERE l.topic_id = t.id) AS likes
     FROM topics t ORDER BY t.pinned DESC, t.last_at DESC LIMIT $1`,
    [limit]
  );
  return r.rows as TopicListRow[];
}

export async function getTopic(id: string): Promise<TopicRow | null> {
  const p = getPool();
  if (!p) return null;
  await ensure(p);
  const r = await p.query(
    "SELECT id, slug, title, body, user_id, created_at, last_at, pinned, locked, category FROM topics WHERE id = $1",
    [id]
  );
  return (r.rows[0] as TopicRow) ?? null;
}

// A reply plus its like count and whether the current viewer liked it.
export type ReplyRow = { id: string; user_id: string; body: string; created_at: string; likes: number; liked: boolean };

export async function listReplies(topicId: string, userId?: string | null): Promise<ReplyRow[]> {
  const p = getPool();
  if (!p) return [];
  await ensure(p);
  const r = await p.query(
    `SELECT r.id, r.user_id, r.body, r.created_at,
            (SELECT count(*)::int FROM reply_likes rl WHERE rl.reply_id = r.id) AS likes,
            EXISTS(SELECT 1 FROM reply_likes rl WHERE rl.reply_id = r.id AND rl.user_id = $2) AS liked
     FROM topic_replies r WHERE r.topic_id = $1 ORDER BY r.created_at ASC`,
    [topicId, userId ?? ""]
  );
  return r.rows as ReplyRow[];
}

// Like count for a thread + whether the current viewer liked it.
export async function topicLikeInfo(topicId: string, userId?: string | null): Promise<{ likes: number; liked: boolean }> {
  const p = getPool();
  if (!p) return { likes: 0, liked: false };
  await ensure(p);
  const r = await p.query(
    `SELECT (SELECT count(*)::int FROM topic_likes WHERE topic_id = $1) AS likes,
            EXISTS(SELECT 1 FROM topic_likes WHERE topic_id = $1 AND user_id = $2) AS liked`,
    [topicId, userId ?? ""]
  );
  return { likes: r.rows[0].likes as number, liked: r.rows[0].liked as boolean };
}

// Toggle a like on a thread; returns the new state and count.
export async function toggleTopicLike(topicId: string, userId: string): Promise<{ liked: boolean; likes: number }> {
  const p = getPool();
  if (!p) return { liked: false, likes: 0 };
  await ensure(p);
  const del = await p.query("DELETE FROM topic_likes WHERE topic_id = $1 AND user_id = $2", [topicId, userId]);
  let liked = false;
  if (del.rowCount === 0) {
    await p.query("INSERT INTO topic_likes (topic_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [topicId, userId]);
    liked = true;
  }
  const c = await p.query("SELECT count(*)::int AS n FROM topic_likes WHERE topic_id = $1", [topicId]);
  return { liked, likes: c.rows[0].n as number };
}

// Toggle a like on a reply; returns the new state and count.
export async function toggleReplyLike(replyId: string, userId: string): Promise<{ liked: boolean; likes: number }> {
  const p = getPool();
  if (!p) return { liked: false, likes: 0 };
  await ensure(p);
  const del = await p.query("DELETE FROM reply_likes WHERE reply_id = $1 AND user_id = $2", [replyId, userId]);
  let liked = false;
  if (del.rowCount === 0) {
    await p.query("INSERT INTO reply_likes (reply_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [replyId, userId]);
    liked = true;
  }
  const c = await p.query("SELECT count(*)::int AS n FROM reply_likes WHERE reply_id = $1", [replyId]);
  return { liked, likes: c.rows[0].n as number };
}

// Owner-only moderation: pin/unpin and lock/unlock a thread.
export async function setTopicPinned(id: string, pinned: boolean): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensure(p);
  await p.query("UPDATE topics SET pinned = $2 WHERE id = $1", [id, pinned]);
}

export async function setTopicLocked(id: string, locked: boolean): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensure(p);
  await p.query("UPDATE topics SET locked = $2 WHERE id = $1", [id, locked]);
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

// ── Owner-created (custom) phone models ─────────────────────────────────────
// Stored as a JSON blob of the Phone shape. Merged into the catalog and served
// on demand for their detail page. Managed only by the site owner.
export async function getCustomPhones(): Promise<Phone[]> {
  const p = getPool();
  if (!p) return [];
  try {
    await ensure(p);
    const r = await p.query("SELECT data FROM custom_phones ORDER BY created_at DESC");
    return r.rows.map((x: { data: Phone }) => ({ ...x.data, custom: true }));
  } catch {
    return [];
  }
}

export async function getCustomPhone(slug: string): Promise<Phone | null> {
  const p = getPool();
  if (!p) return null;
  try {
    await ensure(p);
    const r = await p.query("SELECT data FROM custom_phones WHERE slug = $1", [slug]);
    return r.rows[0] ? { ...(r.rows[0].data as Phone), custom: true } : null;
  } catch {
    return null;
  }
}

export async function upsertCustomPhone(phone: Phone): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensure(p);
  await p.query(
    `INSERT INTO custom_phones (slug, data) VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE SET data = EXCLUDED.data`,
    [phone.slug, JSON.stringify(phone)]
  );
}

export async function deleteCustomPhone(slug: string): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensure(p);
  await p.query("DELETE FROM custom_phones WHERE slug = $1", [slug]);
}

// ── Editable site settings (key/value) ──────────────────────────────────────
// Lets the owner change page text from the admin panel without touching code.
export async function getSiteSettings(): Promise<Record<string, string>> {
  const p = getPool();
  if (!p) return {};
  try {
    await ensure(p);
    const r = await p.query("SELECT key, value FROM site_settings");
    const out: Record<string, string> = {};
    for (const row of r.rows as { key: string; value: string }[]) out[row.key] = row.value;
    return out;
  } catch {
    return {};
  }
}

export async function setSiteSettings(entries: Record<string, string>): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensure(p);
  for (const [key, value] of Object.entries(entries)) {
    if (value === "") {
      await p.query("DELETE FROM site_settings WHERE key = $1", [key]);
    } else {
      await p.query(
        "INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
        [key, value]
      );
    }
  }
}
