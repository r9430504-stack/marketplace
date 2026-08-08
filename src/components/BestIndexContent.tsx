import Link from "next/link";
import { getCollections, collectionPhones } from "@/lib/collections";
import BackButton from "@/components/BackButton";
import { t, type Locale } from "@/lib/i18n";

const T = {
  en: {
    title: "Galaxy guides & collections",
    sub: "Hand-picked ways to explore the Samsung Galaxy range — by feature, format and what matters to you.",
    models: (n: number) => `${n} models →`,
  },
  ru: {
    title: "Подборки и гайды Galaxy",
    sub: "Готовые подборки по модельному ряду Samsung Galaxy — по функциям, форм-фактору и тому, что важно вам.",
    models: (n: number) => `${n} моделей →`,
  },
};

// Russian titles/descriptions for the collections (keyed by slug). English
// falls back to the collection's own fields.
const RU: Record<string, { title: string; description: string }> = {
  "foldable-samsung-phones": {
    title: "Все складные Samsung",
    description:
      "Все складные Samsung Galaxy в одном месте — книжка Z Fold и раскладушка Z Flip, от первого Galaxy Fold до последнего поколения.",
  },
  "samsung-galaxy-ultra-phones": {
    title: "Все модели Galaxy Ultra",
    description:
      "Все Samsung Galaxy Ultra — вершина флагманской линейки: самые большие экраны, лучшие камеры и S Pen.",
  },
  "samsung-phones-with-s-pen": {
    title: "Samsung Galaxy с S Pen",
    description: "Все Samsung Galaxy, работающие со стилусом S Pen — серия Note и флагманы S Ultra.",
  },
  "samsung-galaxy-big-battery-phones": {
    title: "Samsung Galaxy с самой большой батареей",
    description:
      "Samsung Galaxy с аккумулятором 5000 мА·ч и больше — лучшие модели для работы на весь день и дольше.",
  },
  "affordable-samsung-galaxy-phones": {
    title: "Доступные Samsung Galaxy",
    description:
      "Бюджетные и средние Samsung Galaxy — линейки A, M, F и J, которые дают опыт Galaxy по дружелюбной цене.",
  },
  "samsung-galaxy-firsts": {
    title: "Первопроходцы и знаковые модели Galaxy",
    description:
      "Samsung Galaxy, которые сделали что-то первыми — первый изогнутый экран, первый складной, первый металлический корпус и другие знаковые устройства.",
  },
};

export default function BestIndexContent({ locale = "en" }: { locale?: Locale }) {
  const tt = T[locale];
  const collections = getCollections();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-4">
        <BackButton fallback={locale === "ru" ? "/ru" : "/"} label={t(locale).back} />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">{tt.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{tt.sub}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {collections.map((c) => {
          const count = collectionPhones(c).length;
          const loc = locale === "ru" ? RU[c.slug] : undefined;
          return (
            <Link
              key={c.slug}
              href={`/best/${c.slug}`}
              className="reveal glass rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
            >
              <h2 className="font-bold text-gray-900 dark:text-gray-100">{loc?.title ?? c.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 flex-1">
                {loc?.description ?? c.description}
              </p>
              <span className="text-[#1428a0] text-sm font-semibold mt-3">{tt.models(count)}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
