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
         )`
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
