import { getAllPhones, SERIES, type SeriesId } from "@/lib/phones";
import { getCustomPhones } from "@/lib/db";
import { t, type Locale } from "@/lib/i18n";
import PhoneBrowser from "@/components/PhoneBrowser";
import AdSlot from "@/components/AdSlot";
import BackButton from "@/components/BackButton";

export default async function CatalogContent({
  locale = "en",
  series,
  q,
}: {
  locale?: Locale;
  series?: string;
  q?: string;
}) {
  const T = t(locale).catalog;
  // Static catalog plus any owner-added models from the database.
  const custom = await getCustomPhones();
  const phones = [...getAllPhones(), ...custom].sort(
    (a, b) => b.releaseYear - a.releaseYear || a.name.localeCompare(b.name)
  );
  const years = [...new Set(phones.map((p) => p.releaseYear))].sort((a, b) => b - a);
  const validSeries = SERIES.find((s) => s.id === series)?.id as SeriesId | undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-4">
        <BackButton fallback={locale === "ru" ? "/ru" : "/"} label={t(locale).back} />
      </div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">{T.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{T.subtitle(phones.length)}</p>
      </header>

      <PhoneBrowser
        phones={phones}
        years={years}
        initialSeries={validSeries ?? "all"}
        initialQuery={q ?? ""}
        locale={locale}
      />

      <AdSlot />
    </div>
  );
}
