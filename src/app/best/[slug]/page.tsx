import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCollections,
  getCollectionBySlug,
  collectionPhones,
} from "@/lib/collections";
import PhoneCard from "@/components/PhoneCard";
import BackButton from "@/components/BackButton";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollectionBySlug(slug);
  if (!c) return { title: "Collection not found" };
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/best/${slug}` },
    openGraph: { title: c.title, description: c.description, type: "website" },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCollectionBySlug(slug);
  if (!c) notFound();
  const phones = collectionPhones(c);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.title,
    description: c.description,
    url: `${SITE_URL}/best/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: phones.length,
      itemListElement: phones.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/phones/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-4">
        <BackButton fallback="/best" label="Back" />
      </div>

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-5 flex flex-wrap gap-1">
        <Link href="/" className="hover:text-[#1428a0]">Home</Link>
        <span>/</span>
        <Link href="/best" className="hover:text-[#1428a0]">Guides</Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300">{c.title}</span>
      </nav>

      <header className="rise mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-gray-100">
          {c.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl leading-relaxed">{c.intro}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">{phones.length} models</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {phones.map((p) => (
          <PhoneCard key={p.slug} phone={p} />
        ))}
      </div>

      <section className="reveal-up mt-12">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">More collections</h2>
        <div className="flex flex-wrap gap-2">
          {getCollections()
            .filter((o) => o.slug !== c.slug)
            .map((o) => (
              <Link
                key={o.slug}
                href={`/best/${o.slug}`}
                className="text-sm px-3 py-1.5 rounded-full bg-white border border-gray-300 text-gray-700 hover:border-[#1428a0] hover:text-[#1428a0] transition-all duration-200 active:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-white"
              >
                {o.title}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
