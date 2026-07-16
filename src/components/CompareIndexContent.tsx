import Link from "next/link";
import { getAllPhones, getComparisonPairs, comparisonSlug, seriesMeta } from "@/lib/phones";
import CompareBuilder from "@/components/CompareBuilder";
import BackButton from "@/components/BackButton";
import AdSlot from "@/components/AdSlot";
import { t, type Locale } from "@/lib/i18n";

const T = {
  en: {
    title: "Compare Galaxy phones",
    sub: (n: number) => `${n} side-by-side comparisons of Samsung Galaxy flagships — or build your own from any two models below.`,
    build: "Build your own comparison",
    popular: "Popular comparisons",
    sameGen: "same generation",
  },
  ru: {
    title: "Сравнение Galaxy",
    sub: (n: number) => `${n} готовых сравнений флагманов Samsung Galaxy — или соберите своё из любых двух моделей ниже.`,
    build: "Соберите своё сравнение",
    popular: "Популярные сравнения",
    sameGen: "одно поколение",
  },
};

export default function CompareIndexContent({ locale = "en" }: { locale?: Locale }) {
  const tt = T[locale];
  const pairs = getComparisonPairs();
  const allPhones = getAllPhones();

  const groups = new Map<string, typeof pairs>();
  for (const p of pairs) {
    const key = seriesMeta(p.a.series).label;
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(p);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-4">
        <BackButton fallback={locale === "ru" ? "/ru" : "/"} label={t(locale).back} />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">{tt.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{tt.sub(pairs.length)}</p>
      </header>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{tt.build}</h2>
        <CompareBuilder phones={allPhones} />
      </section>

      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{tt.popular}</h2>
      <div className="space-y-8">
        {[...groups.entries()].map(([label, list]) => (
          <section key={label}>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {list.map((p) => (
                <Link
                  key={comparisonSlug(p.a, p.b)}
                  href={`/compare/${comparisonSlug(p.a, p.b)}`}
                  className="reveal glass rounded-xl px-4 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {p.a.name} <span className="text-gray-400 font-normal">vs</span> {p.b.name}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {p.a.releaseYear === p.b.releaseYear
                      ? `${p.a.releaseYear} · ${tt.sameGen}`
                      : `${p.a.releaseYear} → ${p.b.releaseYear}`}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <AdSlot />
    </div>
  );
}
