import Link from "next/link";
import { getAllPhones, SERIES, seriesSlug } from "@/lib/phones";
import { getCustomPhones, getSiteSettings } from "@/lib/db";
import { getCollections } from "@/lib/collections";
import { rankBySpecs } from "@/lib/ranking";
import { t, type Locale } from "@/lib/i18n";
import PhoneCard from "@/components/PhoneCard";
import HeroShowcase from "@/components/HeroShowcase";
import HeroBackdrop from "@/components/HeroBackdrop";
import CountUp from "@/components/CountUp";

export default async function HomeContent({ locale = "en" }: { locale?: Locale }) {
  const T = t(locale).home;
  // Include any owner-added models so every number here updates automatically.
  const [custom, settings] = await Promise.all([getCustomPhones(), getSiteSettings()]);
  const phones = [...getAllPhones(), ...custom];
  const total = phones.length;
  const seriesCount = new Set(phones.map((p) => p.series)).size;
  const firstYear = Math.min(...phones.map((p) => p.releaseYear));
  const lastYear = Math.max(...phones.map((p) => p.releaseYear));
  // Owner-editable hero text (falls back to the built-in copy).
  const heroTitle = settings[`home_title_${locale}`] || T.h1;
  const heroIntro = settings[`home_subtitle_${locale}`] || T.intro(total, firstYear, lastYear);

  // Automatic spec ranking drives what gets featured — highest specs first.
  const ranked = rankBySpecs(phones).map((r) => r.phone);
  // Flagship grid: the best-scoring models that have a photo to show.
  const featured = ranked.filter((p) => p.image).slice(0, 6);
  // Hero cluster: top built-in models (they have ready thumbnails to float).
  const showcase = ranked.filter((p) => !p.custom && p.image).slice(0, 4);

  const stats: { n: number | string; l: string }[] = [
    { n: total, l: T.stats.models },
    { n: seriesCount, l: T.stats.lines },
    { n: `${firstYear}–${lastYear}`, l: T.stats.years },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0b0b0b]">
        <HeroBackdrop />
        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <p className="shimmer rise inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#1428a0] dark:text-blue-300 bg-[#eef1fb] dark:bg-[#1b2338] rounded-full px-3 py-1" style={{ animationDelay: "60ms" }}>
              {T.badge(firstYear, lastYear)}
            </p>
            <h1 className="rise mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black dark:text-gray-100 leading-[1.05] text-balance" style={{ animationDelay: "140ms" }}>
              {heroTitle}
            </h1>
            <p className="rise mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-xl whitespace-pre-line" style={{ animationDelay: "220ms" }}>{heroIntro}</p>

            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "300ms" }}>
              <Link href="/phones" className="btn-primary px-6 py-3 text-base">
                {T.search}
              </Link>
              <Link href="/history" className="btn-outline px-6 py-3 text-base">
                {T.timelineBtn}
              </Link>
            </div>

            <dl className="rise mt-10 flex gap-8" style={{ animationDelay: "380ms" }}>
              {stats.map((s) => (
                <div key={s.l}>
                  <dt className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">
                    {typeof s.n === "number" ? <CountUp value={s.n} /> : s.n}
                  </dt>
                  <dd className="text-xs uppercase tracking-wide text-gray-500 mt-0.5">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {showcase.length > 0 && (
            <div className="rise" style={{ animationDelay: "240ms" }}>
              <HeroShowcase
                items={showcase.map((p) => ({ slug: p.slug, name: p.name, image: p.image as string }))}
                locale={locale}
              />
            </div>
          )}
        </div>
      </section>

      {/* Lines */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-[#f5f5f7] dark:bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black dark:text-gray-100">{T.linesTitle}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{T.linesSub}</p>
            </div>
            <Link href="/phones" className="text-sm font-semibold text-[#1428a0] hover:underline shrink-0">
              {T.allModels}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERIES.map((s) => {
              const count = phones.filter((p) => p.series === s.id).length;
              if (count === 0) return null;
              return (
                <Link
                  key={s.id}
                  href={`/series/${seriesSlug(s.id)}`}
                  className="reveal group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161616] p-5 min-h-[124px] flex flex-col justify-between transition-colors hover:border-black dark:hover:border-gray-500"
                >
                  <div>
                    <p className="font-bold text-[15px] text-black dark:text-gray-100">{s.label}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-snug line-clamp-2">{s.blurb}</p>
                  </div>
                  <p className="text-[#1428a0] text-sm font-semibold mt-3">{T.modelsCount(count)}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flagships */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black dark:text-gray-100">{T.flagshipsTitle}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{T.flagshipsSub}</p>
          </div>
          <Link href="/phones" className="text-sm font-semibold text-[#1428a0] hover:underline shrink-0">
            {T.fullCatalog}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((p, i) => (
            <PhoneCard key={p.slug} phone={p} locale={locale} badge={i === 0 ? T.topSpecBadge : undefined} />
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="border-y border-gray-200 dark:border-gray-800 bg-[#f5f5f7] dark:bg-[#141414]">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black dark:text-gray-100">{T.guidesTitle}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{T.guidesSub}</p>
            </div>
            <Link href="/best" className="text-sm font-semibold text-[#1428a0] hover:underline shrink-0">
              {T.allGuides}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getCollections().map((c) => (
              <Link
                key={c.slug}
                href={`/best/${c.slug}`}
                className="reveal group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161616] p-5 min-h-[110px] flex flex-col justify-between transition-colors hover:border-black dark:hover:border-gray-500"
              >
                <p className="font-bold text-[15px] text-black dark:text-gray-100 leading-snug">{c.title}</p>
                <p className="text-[#1428a0] text-sm font-semibold mt-3">{T.explore}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline teaser */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Link
          href="/history"
          className="reveal block rounded-2xl border border-gray-200 dark:border-gray-800 bg-[#f5f5f7] dark:bg-[#141414] p-8 transition-colors hover:border-black dark:hover:border-gray-500"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1428a0]">{T.timelineKicker}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black dark:text-gray-100">{T.timelineTitle}</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">{T.timelineText(firstYear, lastYear)}</p>
          <span className="mt-4 inline-block text-[#1428a0] font-semibold">{T.openTimeline}</span>
        </Link>
      </section>
    </div>
  );
}
