import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SERIES, getAllPhones, seriesSlug, seriesFromSlug } from "@/lib/phones";
import { SERIES_INTRO } from "@/lib/seriesContent";
import PhoneCard from "@/components/PhoneCard";
import BackButton from "@/components/BackButton";
import AdSlot from "@/components/AdSlot";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return SERIES.map((s) => ({ id: seriesSlug(s.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const s = seriesFromSlug(id);
  if (!s) return { title: "Line not found" };
  const title = `${s.label} — all models, specs and history`;
  return {
    title,
    description: SERIES_INTRO[s.id],
    alternates: { canonical: `/series/${id}` },
    openGraph: { title, description: SERIES_INTRO[s.id], type: "website" },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = seriesFromSlug(id);
  if (!s) notFound();

  const phones = getAllPhones().filter((p) => p.series === s.id);
  const years = phones.map((p) => p.releaseYear);
  const first = Math.min(...years);
  const last = Math.max(...years);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${s.label} phones`,
    description: SERIES_INTRO[s.id],
    url: `${SITE_URL}/series/${id}`,
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
        <BackButton fallback="/phones" label="Back" />
      </div>

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-5 flex flex-wrap gap-1">
        <Link href="/" className="hover:text-[#1428a0]">Home</Link>
        <span>/</span>
        <Link href="/phones" className="hover:text-[#1428a0]">Catalog</Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300">{s.label}</span>
      </nav>

      <header className="rise mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-gray-100">
          {s.label}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl leading-relaxed">
          {SERIES_INTRO[s.id]}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">
          {phones.length} models · {first === last ? first : `${first}–${last}`}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {phones.map((p) => (
          <PhoneCard key={p.slug} phone={p} />
        ))}
      </div>

      <AdSlot />

      {/* Other lines */}
      <section className="reveal-up mt-12">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Other Galaxy lines</h2>
        <div className="flex flex-wrap gap-2">
          {SERIES.filter((o) => o.id !== s.id).map((o) => (
            <Link
              key={o.id}
              href={`/series/${seriesSlug(o.id)}`}
              className="text-sm px-3 py-1.5 rounded-full bg-white border border-gray-300 text-gray-700 hover:border-[#1428a0] hover:text-[#1428a0] transition-all duration-200 active:scale-95 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-white"
            >
              {o.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
