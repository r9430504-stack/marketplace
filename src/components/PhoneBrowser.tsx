"use client";

import { useMemo, useState } from "react";
import { SERIES, filterPhones, type Phone, type SeriesId } from "@/lib/phones";
import PhoneCard from "./PhoneCard";

export default function PhoneBrowser({
  phones,
  years,
  initialSeries = "all",
}: {
  phones: Phone[];
  years: number[];
  initialSeries?: SeriesId | "all";
}) {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState<SeriesId | "all">(initialSeries);
  const [year, setYear] = useState<number | "all">("all");

  const results = useMemo(
    () => filterPhones(phones, { query, series, year }),
    [phones, query, series, year]
  );

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      active
        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
        : "bg-white/55 border border-white/60 backdrop-blur-md text-gray-700 hover:bg-white/80"
    }`;

  return (
    <div>
      {/* Поиск */}
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск: модель, процессор, год…"
          className="w-full rounded-xl border border-white/60 bg-white/55 backdrop-blur-md pl-11 pr-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Поиск по моделям"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      {/* Фильтр по линейке */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className={chip(series === "all")} onClick={() => setSeries("all")}>
          Все линейки
        </button>
        {SERIES.map((s) => (
          <button key={s.id} className={chip(series === s.id)} onClick={() => setSeries(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Фильтр по году */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button className={chip(year === "all")} onClick={() => setYear("all")}>
          Все годы
        </button>
        {years.map((y) => (
          <button key={y} className={chip(year === y)} onClick={() => setYear(y)}>
            {y}
          </button>
        ))}
      </div>

      {/* Результаты */}
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Найдено моделей: <strong className="text-gray-900 dark:text-gray-100">{results.length}</strong>
      </p>

      {results.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <p className="text-4xl">🤔</p>
          <p className="mt-3">Ничего не найдено. Попробуйте другой запрос или сбросьте фильтры.</p>
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
