import Link from "next/link";
import { getAllPhones, SERIES } from "@/lib/phones";
import PhoneCard from "@/components/PhoneCard";
import AdSlot from "@/components/AdSlot";

export default function HomePage() {
  const phones = getAllPhones();
  const featured = phones.slice(0, 6);
  const total = phones.length;
  const firstYear = Math.min(...phones.map((p) => p.releaseYear));
  const lastYear = Math.max(...phones.map((p) => p.releaseYear));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <p className="inline-flex items-center gap-2 text-sm font-bold bg-white text-blue-700 rounded-full px-4 py-1.5 mb-5 shadow-lg ring-1 ring-black/5">
            ⚠️ Не официальный сайт Samsung
          </p>
          <br />
          <p className="inline-block text-xs font-semibold uppercase tracking-widest bg-white/15 rounded-full px-3 py-1 backdrop-blur">
            {firstYear} — {lastYear} · {total} моделей
          </p>
          <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold leading-tight drop-shadow">
            История каждого
            <br />
            Samsung Galaxy
          </h1>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Точные характеристики, даты выхода и история создания флагманов Samsung —
            от Galaxy S4 до последних складных Z Fold и Z Flip.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/phones"
              className="bg-white text-blue-700 px-7 py-3 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              🔍 Поиск по моделям
            </Link>
            <Link
              href="/history"
              className="bg-white/10 border border-white/30 text-white px-7 py-3 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-colors backdrop-blur"
            >
              Хронология по годам
            </Link>
          </div>
        </div>
      </section>

      {/* Линейки */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Линейки Galaxy</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SERIES.map((s) => {
            const count = phones.filter((p) => p.series === s.id).length;
            if (count === 0) return null;
            return (
              <Link
                key={s.id}
                href={`/phones?series=${encodeURIComponent(s.id)}`}
                className={`rounded-2xl p-5 text-white bg-gradient-to-br ${s.from} ${s.to} shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[130px]`}
              >
                <div>
                  <p className="font-bold text-lg">{s.label}</p>
                  <p className="text-white/80 text-xs mt-1 leading-snug">{s.blurb}</p>
                </div>
                <p className="text-white/90 text-sm font-medium mt-3">{count} моделей →</p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <AdSlot />
      </div>

      {/* Свежие флагманы */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Последние флагманы</h2>
          <Link href="/phones" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Весь каталог →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((p) => (
            <PhoneCard key={p.slug} phone={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
