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
        {/* мягкое свечение фона */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-100 blur-3xl opacity-60" />

        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Текст */}
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
                className="inline-flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold text-base border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Хронология по годам →
              </Link>
            </div>

            {/* Статистика */}
            <dl className="mt-10 flex gap-8">
              {stats.map((s) => (
                <div key={s.l}>
                  <dt className="text-2xl sm:text-3xl font-extrabold text-gray-900 tabular-nums">{s.n}</dt>
                  <dd className="text-xs uppercase tracking-wide text-gray-500 mt-0.5">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Витрина фото */}
          {showcase.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {showcase.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/phones/${p.slug}`}
                  className={`group relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-shadow aspect-[3/4] ${
                    i % 2 === 1 ? "translate-y-6" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
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

      {/* ───────── Последние модели с фото ───────── */}
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

      {/* ───────── Линейки ───────── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Линейки Galaxy</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SERIES.map((s) => {
            const count = phones.filter((p) => p.series === s.id).length;
            if (count === 0) return null;
            return (
              <Link
                key={s.id}
                href={`/phones?series=${encodeURIComponent(s.id)}`}
                className={`rounded-2xl p-5 text-white bg-gradient-to-br ${s.from} ${s.to} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[120px]`}
              >
                <div>
                  <p className="font-bold text-lg">{s.label}</p>
                  <p className="text-white/80 text-xs mt-1 leading-snug line-clamp-2">{s.blurb}</p>
                </div>
                <p className="text-white/90 text-sm font-medium mt-3">{count} моделей →</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ───────── Хронология-тизер ───────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Link
          href="/history"
          className="block rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 hover:border-blue-300 transition-colors"
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
