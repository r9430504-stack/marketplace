"use client";

import { useMemo, useState } from "react";
import { SERIES, FEATURE_FILTERS, filterPhones, type Phone, type SeriesId } from "@/lib/phones";
import PhoneCard from "./PhoneCard";

export default function PhoneBrowser({
  phones,
  years,
  initialSeries = "all",
  initialQuery = "",
}: {
  phones: Phone[];
  years: number[];
  initialSeries?: SeriesId | "all";
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [series, setSeries] = useState<SeriesId | "all">(initialSeries);
  const [year, setYear] = useState<number | "all">("all");
  const [features, setFeatures] = useState<string[]>([]);

  const toggleFeature = (id: string) =>
    setFeatures((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const results = useMemo(
    () => filterPhones(phones, { query, series, year, features }),
    [phones, query, series, year, features]
  );

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active
        ? "bg-black text-white"
        : "bg-white border border-gray-300 text-gray-700 hover:border-black hover:text-black"
    }`;

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: model, chipset, year…"
          className="w-full rounded-full border border-gray-300 bg-white pl-11 pr-4 py-3 text-base outline-none focus:border-[#1428a0] focus:ring-1 focus:ring-[#1428a0]"
          aria-label="Search models"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      {/* Series filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className={chip(series === "all")} onClick={() => setSeries("all")}>
          All lines
        </button>
        {SERIES.map((s) => (
          <button key={s.id} className={chip(series === s.id)} onClick={() => setSeries(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Year filter */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button className={chip(year === "all")} onClick={() => setYear("all")}>
          All years
        </button>
        {years.map((y) => (
          <button key={y} className={chip(year === y)} onClick={() => setYear(y)}>
            {y}
          </button>
        ))}
      </div>

      {/* Feature filters */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mr-1">Features:</span>
        {FEATURE_FILTERS.map((f) => (
          <button
            key={f.id}
            className={chip(features.includes(f.id))}
            onClick={() => toggleFeature(f.id)}
            aria-pressed={features.includes(f.id)}
          >
            {f.label}
          </button>
        ))}
        {(features.length > 0 || series !== "all" || year !== "all" || query) && (
          <button
            className="text-xs font-medium text-[#1428a0] hover:underline ml-1"
            onClick={() => {
              setFeatures([]);
              setSeries("all");
              setYear("all");
              setQuery("");
            }}
          >
            Reset all
          </button>
        )}
      </div>

      {/* Results */}
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Models found: <strong className="text-gray-900 dark:text-gray-100">{results.length}</strong>
      </p>

      {results.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <p className="text-4xl">🤔</p>
          <p className="mt-3">Nothing found. Try a different query or reset the filters.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((p) => (
            <PhoneCard key={p.slug} phone={p} />
          ))}
        </div>
      )}
    </div>
  );
}
