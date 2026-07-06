import type { Metadata } from "next";
import Link from "next/link";
import { getCollections, collectionPhones } from "@/lib/collections";
import BackButton from "@/components/BackButton";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Samsung Galaxy guides and collections",
  description:
    "Curated Samsung Galaxy collections: foldables, Ultra flagships, S Pen phones, big-battery models, affordable Galaxy phones and landmark firsts.",
  alternates: { canonical: "/best" },
};

export default function BestIndexPage() {
  const collections = getCollections();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-4">
        <BackButton fallback="/" label="Back" />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">
          Galaxy guides &amp; collections
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Hand-picked ways to explore the Samsung Galaxy range — by feature, format and what matters
          to you.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {collections.map((c) => {
          const count = collectionPhones(c).length;
          return (
            <Link
              key={c.slug}
              href={`/best/${c.slug}`}
              className="reveal glass rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
            >
              <h2 className="font-bold text-gray-900 dark:text-gray-100">{c.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 flex-1">
                {c.description}
              </p>
              <span className="text-[#1428a0] text-sm font-semibold mt-3">{count} models →</span>
            </Link>
          );
        })}
      </div>

      <AdSlot />
    </div>
  );
}
