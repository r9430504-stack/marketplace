import type { Metadata } from "next";
import TopicThread from "@/components/TopicThread";
import { getTopic, listReplies, topicLikeInfo } from "@/lib/db";
import { getAllPhones, seriesMeta } from "@/lib/phones";
import { SITE_URL } from "@/lib/site";

// Owner-created threads aren't in the static set — render on demand.
export const dynamicParams = true;
const isId = (s: string) => /^\d+$/.test(s);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const topic = isId(id) ? await getTopic(id).catch(() => null) : null;
  if (!topic) {
    // Unknown / DB unavailable — don't let an empty shell get indexed.
    return { title: "Topic — Forum", robots: { index: false, follow: true } };
  }
  const meta = getAllPhones().find((p) => p.slug === topic.slug);
  const model = meta ? `${meta.name} — ` : "";
  return {
    title: `${topic.title} — ${model}Galaxy forum`,
    description: topic.body.replace(/\s+/g, " ").slice(0, 155),
    alternates: { canonical: `/forum/${id}` },
    openGraph: { title: topic.title, description: topic.body.slice(0, 155), type: "article" },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Server-render the thread so the content ships in the initial HTML (SEO),
  // then TopicThread hydrates and refreshes per-user state (mine/liked).
  const topicRow = isId(id) ? await getTopic(id).catch(() => null) : null;
  let initialTopic = null;
  let initialReplies: { id: string; body: string; createdAt: string; mine: boolean; likes: number; liked: boolean }[] = [];
  let jsonLd: string | null = null;

  if (topicRow) {
    const meta = getAllPhones().find((p) => p.slug === topicRow.slug);
    const [replies, like] = await Promise.all([listReplies(id, null), topicLikeInfo(id, null)]);
    initialTopic = {
      id: String(topicRow.id),
      slug: topicRow.slug,
      name: meta?.name ?? topicRow.slug,
      line: meta ? seriesMeta(meta.series).label : "",
      ru: false,
      title: topicRow.title,
      body: topicRow.body,
      createdAt: topicRow.created_at,
      mine: false,
      pinned: topicRow.pinned,
      locked: topicRow.locked,
      likes: like.likes,
      liked: false,
    };
    initialReplies = replies.map((r) => ({
      id: String(r.id),
      body: r.body,
      createdAt: r.created_at,
      mine: false,
      likes: r.likes,
      liked: false,
    }));

    jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "DiscussionForumPosting",
      headline: topicRow.title,
      text: topicRow.body,
      url: `${SITE_URL}/forum/${id}`,
      datePublished: topicRow.created_at,
      author: { "@type": "Person", name: "Anonymous" },
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: like.likes,
      },
      commentCount: initialReplies.length,
      comment: initialReplies.map((r) => ({
        "@type": "Comment",
        text: r.body,
        datePublished: r.createdAt,
        author: { "@type": "Person", name: "Anonymous" },
      })),
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <TopicThread id={id} locale="en" initialTopic={initialTopic} initialReplies={initialReplies} />
    </div>
  );
}
