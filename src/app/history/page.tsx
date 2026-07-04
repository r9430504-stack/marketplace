import type { Metadata } from "next";
import Link from "next/link";
import { getAllPhones, getYears, seriesMeta } from "@/lib/phones";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Samsung Galaxy timeline by year",
  description:
    "The history of Samsung Galaxy phones year by year: key flagships, foldables and development milestones from 2013 to today.",
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  const phones = getAllPhones();
  const years = getYears();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">Galaxy timeline</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          The evolution of Samsung phones year by year — from {years[years.length - 1]} to {years[0]}.
        </p>
      </header>

      <div className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3">
        {years.map((year, idx) => {
          const yearPhones = phones.filter((p) => p.releaseYear === year);
          return (
            <div key={year} className="relative pl-8 pb-10">
              <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-black ring-4 ring-white dark:ring-[#0b0f17]" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{year}</h2>
              <div className="mt-3 space-y-2">
                {yearPhones.map((p) => {
                  const s = seriesMeta(p.series);
                  return (
                    <Link
                      key={p.slug}
                      href={`/phones/${p.slug}`}
                      className="reveal flex items-start gap-3 rounded-xl glass px-4 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <span className={`mt-1 shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 ${s.accent}`}>
                        {s.label}
                      </span>
                      <span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{p.name}</span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">{p.tagline}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
              {idx === 1 && <AdSlot />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
