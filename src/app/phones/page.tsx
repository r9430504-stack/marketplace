import type { Metadata } from "next";
import { getAllPhones, getYears, SERIES, type SeriesId } from "@/lib/phones";
import PhoneBrowser from "@/components/PhoneBrowser";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Samsung Galaxy phone catalog",
  description:
    "The full catalog of Samsung Galaxy phones with search by name, chipset and year. The S, Note, foldable Z Fold and Z Flip flagships with exact specifications.",
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Model catalog</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {phones.length} officially released Samsung Galaxy models. Search by name, chipset or year.
        </p>
      </header>

      <PhoneBrowser phones={phones} years={years} initialSeries={validSeries ?? "all"} />

      <AdSlot />
    </div>
  );
}
