import Link from "next/link";
import { getAllPhones, getPhoneBySlug, SERIES } from "@/lib/phones";
import PhoneCard from "@/components/PhoneCard";
import AdSlot from "@/components/AdSlot";

// Иконичные модели для витрины в шапке (берём только те, у кого есть фото).
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
    { n: total, l: "моделей" },
    { n: seriesCount, l: "линеек" },
    { n: `${firstYear}–${lastYear}`, l: "годы" },
  ];

  return (
    <div>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden border-b border-gray-100">
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-100 blur-3xl opacity-60" />

        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 bg-blue-50 rounded-full px-3 py-1">
              ◆ Неофициальный архив · {firstYear}–{lastYear}
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05] text-balance">
              Вся история смартфонов Samsung Galaxy
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              {total} моделей с {firstYear} по {lastYear} год: серии S, Note, складные
              Z&nbsp;Fold и Z&nbsp;Flip, а также A, M и другие. Точные характеристики,
              даты выхода, история создания и поиск по моделям.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/phones"
                className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-blue-800 transition-colors shadow-sm shadow-blue-200"
              >
                🔍 Поиск по моделям
              </Link>
              <Link
                href="/history"
                className="inline-flex items-center gap-2 glass text-gray-800 px-6 py-3 rounded-xl font-semibold text-base hover:bg-white/70 transition-colors"
              >
                Хронология по годам →
              </Link>
            </div>

            <dl className="mt-10 flex gap-8">
              {stats.map((s) => (
                <div key={s.l}>
                  <dt className="text-2xl sm:text-3xl font-extrabold text-gray-900 tabular-nums">{s.n}</dt>
                  <dd className="text-xs uppercase tracking-wide text-gray-500 mt-0.5">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {showcase.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {showcase.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/phones/${p.slug}`}
                  className={`group relative rounded-2xl overflow-hidden glass hover:shadow-md transition-shadow aspect-[4/5] ${
                    i % 2 === 1 ? "translate-y-6" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-contain bg-white group-hover:scale-[1.03] transition-transform duration-300"
                    loading="eager"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/55 to-transparent p-3 text-white text-sm font-semibold">
                    {p.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───────── Линейки (liquid glass) ───────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gray-50/40">
        {/* цветное свечение за стеклом */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 left-[8%] h-64 w-64 rounded-full bg-blue-300/40 blur-3xl" />
          <div className="absolute top-1/2 right-[10%] h-72 w-72 rounded-full bg-indigo-300/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Линейки Galaxy</h2>
              <p className="text-sm text-gray-500 mt-0.5">Выберите семейство устройств</p>
            </div>
            <Link href="/phones" className="text-sm font-semibold text-blue-700 hover:underline shrink-0">
              Все модели →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERIES.map((s) => {
              const count = phones.filter((p) => p.series === s.id).length;
              if (count === 0) return null;
              return (
                <Link
                  key={s.id}
                  href={`/phones?series=${encodeURIComponent(s.id)}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/45 p-5 min-h-[124px] flex flex-col justify-between shadow-[0_8px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/65"
                >
                  {/* блик сверху — «стекло» */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent" />
                  <span className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-white/40 blur-xl" />
                  <div className="relative">
                    <p className="font-bold text-[15px] text-gray-900">{s.label}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-snug line-clamp-2">{s.blurb}</p>
                  </div>
                  <p className="relative text-blue-700 text-sm font-semibold mt-3">{count} моделей →</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── Флагманы ───────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Флагманы</h2>
            <p className="text-sm text-gray-500 mt-0.5">Свежие и знаковые модели с фотографиями</p>
          </div>
          <Link href="/phones" className="text-sm font-semibold text-blue-700 hover:underline shrink-0">
            Весь каталог →
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

      {/* ───────── Хронология-тизер ───────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Link
          href="/history"
          className="block glass rounded-2xl p-8 hover:shadow-lg transition-all"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Хронология</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            От Galaxy S до Galaxy S25 — год за годом
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Развитие смартфонов Samsung с {firstYear} по {lastYear}: ключевые модели,
            складные устройства и главные вехи в одной ленте.
          </p>
          <span className="mt-4 inline-block text-blue-700 font-semibold">Открыть хронологию →</span>
        </Link>
      </section>
    </div>
  );
}
