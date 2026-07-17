import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getComparisonPairs,
  getComparisonBySlug,
  comparisonSlug,
  seriesMeta,
} from "@/lib/phones";
import { keyDifferences } from "@/lib/compare";
import PhoneVisual from "@/components/PhoneVisual";
import CompareTable from "@/components/CompareTable";
import BackButton from "@/components/BackButton";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getComparisonPairs().map(({ a, b }) => ({ pair: comparisonSlug(a, b) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const cmp = getComparisonBySlug(pair);
  if (!cmp) return { title: "Comparison not found" };
  const title = `${cmp.a.name} vs ${cmp.b.name}: specs comparison`;
  const description = `${cmp.a.name} vs ${cmp.b.name} — side-by-side comparison of display, chipset, camera, battery and full specifications. Which one is right for you?`;
  return {
    title,
    description,
    alternates: { canonical: `/compare/${pair}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const cmp = getComparisonBySlug(pair);
  if (!cmp) notFound();
  const { a, b } = cmp;
  const diffs = keyDifferences(a, b);
  const sameYear = a.releaseYear === b.releaseYear;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${a.name} vs ${b.name}`,
    itemListElement: [a, b].map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/phones/${p.slug}`,
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-4">
        <BackButton fallback="/compare" label="Back" />
      </div>

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-5 flex flex-wrap gap-1">
        <Link href="/" className="hover:text-[#1428a0]">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-[#1428a0]">Compare</Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300">{a.name} vs {b.name}</span>
      </nav>

      <h1 className="rise text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100" style={{ animationDelay: "60ms" }}>
        {a.name} <span className="text-gray-400">vs</span> {b.name}
      </h1>
      <p className="rise text-gray-600 dark:text-gray-300 mt-3 max-w-2xl" style={{ animationDelay: "140ms" }}>
        A side-by-side look at the {a.name} and the {b.name} — how their displays, chipsets, cameras,
        batteries and full specifications compare, so you can see what changed and which one fits you.
      </p>

      {/* Two heroes */}
      <div className="rise grid grid-cols-2 gap-4 mt-6" style={{ animationDelay: "220ms" }}>
        {[a, b].map((p) => (
          <Link
            key={p.slug}
            href={`/phones/${p.slug}`}
            className="group rounded-2xl overflow-hidden glass hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[4/5] bg-white">
              <PhoneVisual phone={p} thumb className="group-hover:scale-[1.04] transition-transform duration-500" />
            </div>
            <div className="p-3">
              <span className={`text-[11px] font-semibold ${seriesMeta(p.series).accent}`}>
                {seriesMeta(p.series).label}
              </span>
              <p className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{p.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{p.releaseDate}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Key differences — unique, readable summary per pair */}
      <section className="reveal-up mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          {a.name} vs {b.name}: the key differences
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {sameYear ? (
            <>
              The {a.name} and {b.name} launched in the same year ({a.releaseYear}) as part of the
              same generation, so they share a great deal — but they are aimed at different buyers.
            </>
          ) : (
            <>
              The {b.name} arrived in {b.releaseYear}, {b.releaseYear - a.releaseYear}{" "}
              {b.releaseYear - a.releaseYear === 1 ? "year" : "years"} after the {a.name} (
              {a.releaseYear}), and moves the line forward in several areas.
            </>
          )}
        </p>
        {diffs.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {diffs.map((d, i) => (
              <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                <span className="text-[#1428a0] mt-0.5">◆</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            On paper these two are very close — the full table below shows where they line up.
          </p>
        )}
      </section>

      <section className="reveal-up mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Full specification comparison
        </h2>
        <CompareTable a={a} b={b} />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Bold values indicate a difference between the two models.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/phones/${a.slug}`} className="btn-outline px-5 py-2.5 text-sm">
          {a.name} details
        </Link>
        <Link href={`/phones/${b.slug}`} className="btn-outline px-5 py-2.5 text-sm">
          {b.name} details
        </Link>
        <Link href="/compare" className="btn-outline px-5 py-2.5 text-sm">
          More comparisons →
        </Link>
      </div>
    </div>
  );
}
