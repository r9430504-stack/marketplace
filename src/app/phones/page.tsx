import type { Metadata } from "next";
import { getAllPhones, getYears, SERIES, type SeriesId } from "@/lib/phones";
import PhoneBrowser from "@/components/PhoneBrowser";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Каталог телефонов Samsung Galaxy",
  description:
    "Полный каталог смартфонов Samsung Galaxy с поиском по названию, процессору и году. Флагманы S, Note, складные Z Fold и Z Flip с точными характеристиками.",
  alternates: { canonical: "/phones" },
};

export default async function PhonesPage({
  searchParams,
}: {
  searchParams: Promise<{ series?: string }>;
}) {
  const { series } = await searchParams;
  const phones = getAllPhones();
  const years = getYears();

  const validSeries = SERIES.find((s) => s.id === series)?.id as SeriesId | undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Каталог моделей</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {phones.length} официально выпущенных моделей Samsung Galaxy. Ищите по названию, процессору или году.
        </p>
      </header>

      <PhoneBrowser phones={phones} years={years} initialSeries={validSeries ?? "all"} />

      <AdSlot />
    </div>
  );
}
