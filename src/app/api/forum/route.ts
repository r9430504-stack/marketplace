import { getForumBoards, getLatestComments } from "@/lib/db";
import { getAllPhones, seriesMeta, hasRuTranslation } from "@/lib/phones";

export const runtime = "nodejs";

// Forum board data: active model discussions + the latest posts site-wide.
// Comment bodies carry no personal info; we join only with public phone data.
export async function GET() {
  try {
    const [boards, latest] = await Promise.all([getForumBoards(), getLatestComments()]);
    const meta = new Map(
      getAllPhones().map((p) => [
        p.slug,
        { name: p.name, line: seriesMeta(p.series).label, ru: hasRuTranslation(p.slug) },
      ])
    );
    return Response.json({
      boards: boards
        .filter((b) => meta.has(b.slug))
        .map((b) => {
          const m = meta.get(b.slug)!;
          return { slug: b.slug, name: m.name, line: m.line, ru: m.ru, count: b.count, last: b.last };
        }),
      latest: latest
        .filter((c) => meta.has(c.slug))
        .map((c) => {
          const m = meta.get(c.slug)!;
          return { slug: c.slug, name: m.name, ru: m.ru, body: c.body, createdAt: c.created_at };
        }),
    });
  } catch {
    return Response.json({ boards: [], latest: [] });
  }
}
