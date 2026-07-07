"use client";

import { useState } from "react";
import Link from "next/link";
import type { Phone } from "@/lib/phones";
import { keyDifferences } from "@/lib/compare";
import PhoneVisual from "./PhoneVisual";
import CompareTable from "./CompareTable";

/**
 * Interactive "pick any two" comparison. Renders the side-by-side table and
 * key differences instantly for any pair the user selects — no page reload.
 */
export default function CompareBuilder({ phones }: { phones: Phone[] }) {
  const [aSlug, setA] = useState(phones[0]?.slug ?? "");
  const [bSlug, setB] = useState(phones[1]?.slug ?? "");
  const a = phones.find((p) => p.slug === aSlug);
  const b = phones.find((p) => p.slug === bSlug);
  const ready = a && b && a.slug !== b.slug;
  const diffs = ready ? keyDifferences(a!, b!) : [];

  const selectCls =
    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1428a0] focus:ring-1 focus:ring-[#1428a0]";

  return (
    <div className="glass rounded-2xl p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-center">
        <label className="block">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">First phone</span>
          <select className={selectCls} value={aSlug} onChange={(e) => setA(e.target.value)}>
            {phones.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <span className="text-center text-gray-400 font-semibold hidden sm:block">vs</span>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Second phone</span>
          <select className={selectCls} value={bSlug} onChange={(e) => setB(e.target.value)}>
            {phones.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!ready ? (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          Pick two different models to compare them side by side.
        </p>
      ) : (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {[a!, b!].map((p) => (
              <Link
                key={p.slug}
                href={`/phones/${p.slug}`}
                className="group rounded-xl overflow-hidden glass hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/5] bg-white">
                  <PhoneVisual phone={p} thumb />
                </div>
                <div className="p-2 text-center">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{p.releaseDate}</p>
                </div>
              </Link>
            ))}
          </div>

          {diffs.length > 0 && (
            <div className="mt-5">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Key differences</h3>
              <ul className="space-y-1.5">
                {diffs.map((d, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="text-[#1428a0] mt-0.5">◆</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5">
            <CompareTable a={a!} b={b!} />
          </div>
        </div>
      )}
    </div>
  );
}
