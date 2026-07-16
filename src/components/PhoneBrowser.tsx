"use client";

import { useMemo, useState } from "react";
import { SERIES, FEATURE_FILTERS, filterPhones, type Phone, type SeriesId } from "@/lib/phones";
import { t, type Locale } from "@/lib/i18n";
import PhoneCard from "./PhoneCard";

export default function PhoneBrowser({
  phones,
  years,
  initialSeries = "all",
  initialQuery = "",
  locale = "en",
}: {
  phones: Phone[];
  years: number[];
  initialSeries?: SeriesId | "all";
  initialQuery?: string;
  locale?: Locale;
}) {
  const T = t(locale).catalog;
  const featLabels = t(locale).features as Record<string, string>;
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
        ? "bg-[#1428a0] text-white dark:bg-blue-600 dark:text-white"
        : "bg-white border border-gray-300 text-gray-700 hover:border-[#1428a0] hover:text-[#1428a0] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-white"
    }`;

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={T.searchPh}
          className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white pl-11 pr-4 py-3 text-base outline-none focus:border-[#1428a0] focus:ring-1 focus:ring-[#1428a0]"
          aria-label={T.searchPh}
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </div>

      {/* Series filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className={chip(series === "all")} onClick={() => setSeries("all")}>
          {T.allLines}
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
          {T.allYears}
        </button>
        {years.map((y) => (
          <button key={y} className={chip(year === y)} onClick={() => setYear(y)}>
            {y}
          </button>
        ))}
      </div>

      {/* Feature filters */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mr-1">{T.featuresLabel}</span>
        {FEATURE_FILTERS.map((f) => (
          <button
            key={f.id}
            className={chip(features.includes(f.id))}
            onClick={() => toggleFeature(f.id)}
            aria-pressed={features.includes(f.id)}
          >
            {featLabels[f.id] ?? f.label}
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
            {T.resetAll}
          </button>
        )}
      </div>

      {/* Results */}
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        {T.found} <strong className="text-gray-900 dark:text-gray-100">{results.length}</strong>
      </p>

      {results.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <p className="text-4xl">🤔</p>
          <p className="mt-3">{T.foundNone}</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((p) => (
            <PhoneCard key={p.slug} phone={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
