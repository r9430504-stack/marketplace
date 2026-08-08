import Link from "next/link";
import { getAllPhones, getYears, seriesMeta, localizedPhone } from "@/lib/phones";
import BackButton from "@/components/BackButton";
import { t, type Locale } from "@/lib/i18n";

const T = {
  en: {
    title: "Galaxy timeline",
    sub: (first: number, last: number) => `The evolution of Samsung phones year by year — from ${first} to ${last}.`,
  },
  ru: {
    title: "Хронология Galaxy",
    sub: (first: number, last: number) => `Эволюция смартфонов Samsung по годам — с ${first} по ${last}.`,
  },
};

export default function HistoryContent({ locale = "en" }: { locale?: Locale }) {
  const tt = T[locale];
  const phones = getAllPhones();
  const years = getYears();
  const link = (slug: string) => `${locale === "ru" ? "/ru" : ""}/phones/${slug}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-4">
        <BackButton fallback={locale === "ru" ? "/ru" : "/"} label={t(locale).back} />
      </div>
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">{tt.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{tt.sub(years[years.length - 1], years[0])}</p>
      </header>

      <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3">
        {years.map((year) => {
          const yearPhones = phones.filter((p) => p.releaseYear === year);
          return (
            <div key={year} className="relative pl-8 pb-10">
              <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#1428a0] dark:bg-blue-500 ring-4 ring-white dark:ring-[#0b0f17]" />
              <h2 className="reveal-up text-2xl font-bold text-gray-900 dark:text-gray-100">{year}</h2>
              <div className="mt-3 space-y-2">
                {yearPhones.map((p) => {
                  const s = seriesMeta(p.series);
                  const lp = localizedPhone(p, locale);
                  return (
                    <Link
                      key={p.slug}
                      href={link(p.slug)}
                      className="reveal flex items-start gap-3 rounded-xl glass px-4 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <span className={`mt-1 shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${s.accent}`}>
                        {s.label}
                      </span>
                      <span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{lp.name}</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">{lp.tagline}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
