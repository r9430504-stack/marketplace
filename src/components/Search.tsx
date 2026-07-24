"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/i18n";
import { IconSearchOff } from "./icons";

export type SearchPhone = { slug: string; name: string; line: string; year: number };

const TXT = {
  en: { open: "Search", placeholder: "Search Galaxy models…", popular: "Popular", none: "Nothing found", cancel: "Cancel" },
  ru: { open: "Поиск", placeholder: "Поиск моделей Galaxy…", popular: "Популярное", none: "Ничего не найдено", cancel: "Отмена" },
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * iOS-style instant search: a magnifier in the header opens a sheet with a big
 * auto-focused field and results that filter as you type. One UI styling
 * (Samsung blue, rounded) is kept throughout.
 */
export default function Search({ phones }: { phones: SearchPhone[] }) {
  const path = usePathname() || "/";
  const loc = localeFromPathname(path);
  const t = TXT[loc];
  const base = loc === "ru" ? "/ru" : "";

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the field and lock background scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const tid = setTimeout(() => inputRef.current?.focus(), 60);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(tid);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the sheet whenever the route changes (after a result is tapped).
  useEffect(() => {
    setOpen(false);
    setQ("");
  }, [path]);

  const popular = useMemo(
    () => [...phones].sort((a, b) => b.year - a.year || a.name.localeCompare(b.name)).slice(0, 6),
    [phones]
  );

  const results = useMemo(() => {
    const needle = norm(q);
    if (!needle) return [];
    const terms = needle.split(" ").filter(Boolean);
    return phones
      .map((p) => {
        const hay = norm(`${p.name} ${p.line} ${p.year}`);
        // All words must appear; rank exact name-prefix matches first.
        const ok = terms.every((w) => hay.includes(w));
        if (!ok) return null;
        const score = norm(p.name).startsWith(needle) ? 0 : norm(p.name).includes(needle) ? 1 : 2;
        return { p, score };
      })
      .filter(Boolean)
      .sort((a, b) => a!.score - b!.score || b!.p.year - a!.p.year)
      .slice(0, 24)
      .map((x) => x!.p);
  }, [q, phones]);

  const shown = q.trim() ? results : popular;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t.open}
        className="grid h-8 w-8 place-items-center rounded-full text-gray-600 dark:text-gray-300 hover:text-[#1428a0] dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-95"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col" role="dialog" aria-modal="true" aria-label={t.open}>
          <button
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_.2s_ease]"
            aria-label={t.cancel}
            onClick={() => setOpen(false)}
          />

          <div className="search-sheet relative mx-auto w-full max-w-2xl px-3 pt-3">
            <div className="glass rounded-3xl shadow-2xl overflow-hidden">
              {/* Search bar */}
              <div className="flex items-center gap-2 p-3">
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t.placeholder}
                    enterKeyHint="search"
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-11 pr-4 py-3 text-base outline-none focus:border-[#1428a0] focus:ring-1 focus:ring-[#1428a0]"
                  />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="shrink-0 px-2 text-sm font-semibold text-[#1428a0] dark:text-blue-400 active:scale-95"
                >
                  {t.cancel}
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[70vh] overflow-y-auto px-3 pb-3">
                {!q.trim() && (
                  <p className="px-1 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    {t.popular}
                  </p>
                )}

                {shown.length === 0 ? (
                  <div className="py-14 text-center text-gray-400 dark:text-gray-600">
                    <IconSearchOff className="mx-auto h-8 w-8" />
                    <p className="mt-2 text-sm">{t.none}</p>
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {shown.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`${base}/phones/${p.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.99] transition"
                        >
                          <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/models/thumbs/${p.slug}.webp`}
                              alt=""
                              className="h-full w-full object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-gray-900 dark:text-gray-100">{p.name}</span>
                            <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                              {p.line} · {p.year}
                            </span>
                          </span>
                          <svg className="ml-auto shrink-0 text-gray-300 dark:text-gray-600" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
