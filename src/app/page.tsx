import Link from "next/link";
import { getAllPhones, getPhoneBySlug, SERIES, seriesSlug } from "@/lib/phones";
import { getCollections } from "@/lib/collections";
import PhoneCard from "@/components/PhoneCard";
import HeroShowcase from "@/components/HeroShowcase";
import HeroBackdrop from "@/components/HeroBackdrop";
import CountUp from "@/components/CountUp";
import AdSlot from "@/components/AdSlot";

// Iconic models for the hero showcase (only those that have a photo).
const SHOWCASE_SLUGS = [
  "galaxy-s24-ultra",
  "galaxy-s25-ultra",
  "galaxy-note-20-ultra",
  "galaxy-s6-edge",
];

export default function HomePage() {
  const phones = getAllPhones();
  const withPhotos = phones.filter((p) => p.image);
  const featured = withPhotos.slice(0, 6);
  const total = phones.length;
  const seriesCount = new Set(phones.map((p) => p.series)).size;
  const firstYear = Math.min(...phones.map((p) => p.releaseYear));
  const lastYear = Math.max(...phones.map((p) => p.releaseYear));

  const showcase = SHOWCASE_SLUGS.map(getPhoneBySlug).filter(
    (p): p is NonNullable<typeof p> => Boolean(p?.image)
  );

  const stats = [
    { n: total, l: "models" },
    { n: seriesCount, l: "lines" },
    { n: `${firstYear}–${lastYear}`, l: "years" },
  ];

  return (
    <div>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <HeroBackdrop />
        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#1428a0] bg-[#eef1fb] rounded-full px-3 py-1">
              ◆ Unofficial archive · {firstYear}–{lastYear}
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-[1.05] text-balance">
              The complete history of Samsung Galaxy phones
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              {total} models from {firstYear} to {lastYear}: the S and Note lines, foldable
              Z&nbsp;Fold and Z&nbsp;Flip, plus A, M and more. Exact specifications,
              release dates, the story behind each one and model search.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/phones" className="btn-primary px-6 py-3 text-base">
                Search models
              </Link>
              <Link href="/history" className="btn-outline px-6 py-3 text-base">
                Timeline by year →
              </Link>
            </div>

            <dl className="mt-10 flex gap-8">
              {stats.map((s) => (
                <div key={s.l}>
                  <dt className="text-2xl sm:text-3xl font-extrabold text-gray-900 tabular-nums">
                    {typeof s.n === "number" ? <CountUp value={s.n} /> : s.n}
                  </dt>
                  <dd className="text-xs uppercase tracking-wide text-gray-500 mt-0.5">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {showcase.length > 0 && (
            <HeroShowcase
              items={showcase.map((p) => ({
                slug: p.slug,
                name: p.name,
                image: p.image as string,
              }))}
            />
          )}
        </div>
      </section>

      {/* ───────── Lines ───────── */}
      <section className="border-b border-gray-200 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black">Galaxy lines</h2>
              <p className="text-sm text-gray-500 mt-0.5">Choose a device family</p>
            </div>
            <Link href="/phones" className="text-sm font-semibold text-[#1428a0] hover:underline shrink-0">
              All models →
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
                  className="reveal group rounded-2xl border border-gray-200 bg-white p-5 min-h-[124px] flex flex-col justify-between transition-colors hover:border-black"
                >
                  <div>
                    <p className="font-bold text-[15px] text-black">{s.label}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-snug line-clamp-2">{s.blurb}</p>
                  </div>
                  <p className="text-[#1428a0] text-sm font-semibold mt-3">{count} models →</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── Flagships ───────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black">Flagships</h2>
            <p className="text-sm text-gray-500 mt-0.5">Recent and landmark models with photos</p>
          </div>
          <Link href="/phones" className="text-sm font-semibold text-[#1428a0] hover:underline shrink-0">
            Full catalog →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((p) => (
            <PhoneCard key={p.slug} phone={p} />
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <AdSlot />
      </div>

      {/* ───────── Collections ───────── */}
      <section className="border-y border-gray-200 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black">Guides &amp; collections</h2>
              <p className="text-sm text-gray-500 mt-0.5">Explore the range by what matters to you</p>
            </div>
            <Link href="/best" className="text-sm font-semibold text-[#1428a0] hover:underline shrink-0">
              All guides →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getCollections().map((c) => (
              <Link
                key={c.slug}
                href={`/best/${c.slug}`}
                className="reveal group rounded-2xl border border-gray-200 bg-white p-5 min-h-[110px] flex flex-col justify-between transition-colors hover:border-black"
              >
                <p className="font-bold text-[15px] text-black leading-snug">{c.title}</p>
                <p className="text-[#1428a0] text-sm font-semibold mt-3">Explore →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Timeline teaser ───────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Link
          href="/history"
          className="reveal block rounded-2xl border border-gray-200 bg-[#f5f5f7] p-8 transition-colors hover:border-black"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1428a0]">Timeline</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
            From the Galaxy S to the Galaxy S25 — year by year
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            The evolution of Samsung phones from {firstYear} to {lastYear}: key models,
            foldables and the major milestones in one timeline.
          </p>
          <span className="mt-4 inline-block text-[#1428a0] font-semibold">Open the timeline →</span>
        </Link>
      </section>
    </div>
  );
}
