"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { timeAgo } from "@/lib/timeago";
import { IconChat, IconSearchOff } from "@/components/icons";

type Topic = {
  id: string;
  slug: string;
  name: string;
  line: string;
  ru: boolean;
  title: string;
  replies: number;
  createdAt: string;
  lastAt: string;
};

const T = {
  en: {
    add: "New topic",
    empty: "No topics yet — start the first discussion!",
    searchPh: "Search topics…",
    noneFound: "No topics match your search.",
    replies: (n: number) => `${n} ${n === 1 ? "reply" : "replies"}`,
  },
  ru: {
    add: "Добавить тему",
    empty: "Тем пока нет — создайте первую!",
    searchPh: "Поиск по темам…",
    noneFound: "По запросу ничего не найдено.",
    replies: (n: number) =>
      `${n} ${n % 10 === 1 && n % 100 !== 11 ? "ответ" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "ответа" : "ответов"}`,
  },
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

export default function ForumTopics({ locale = "en" }: { locale?: Locale }) {
  const t = T[locale];
  const base = locale === "ru" ? "/ru/forum" : "/forum";
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/topics")
      .then((r) => r.json())
      .then((d) => alive && setTopics(Array.isArray(d.topics) ? d.topics : []))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const shown = useMemo(() => {
    const needle = norm(query);
    if (!needle) return topics;
    const terms = needle.split(" ").filter(Boolean);
    return topics.filter((tp) => {
      const hay = norm(`${tp.title} ${tp.name} ${tp.line}`);
      return terms.every((w) => hay.includes(w));
    });
  }, [topics, query]);

  return (
    <div>
      {/* Search + add-topic button */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {!loading && topics.length > 0 && (
          <div className="relative min-w-0 flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPh}
              aria-label={t.searchPh}
              className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 pl-11 pr-4 py-2.5 text-base outline-none focus:border-[#1428a0] focus:ring-1 focus:ring-[#1428a0]"
            />
          </div>
        )}
        <Link href={`${base}/new`} className="btn-primary shrink-0 px-4 py-2 text-sm ml-auto">
          <span className="text-base leading-none">+</span> {t.add}
        </Link>
      </div>

      {loading ? (
        <ul className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="glass rounded-2xl p-4">
              <span className="img-skeleton block h-4 w-2/3 rounded" />
              <span className="img-skeleton mt-2 block h-3 w-24 rounded" />
            </li>
          ))}
        </ul>
      ) : topics.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <IconChat className="mx-auto h-9 w-9 text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-gray-600 dark:text-gray-300">{t.empty}</p>
          <Link href={`${base}/new`} className="btn-primary mt-5 inline-flex px-5 py-2.5 text-sm">
            <span className="text-base leading-none">+</span> {t.add}
          </Link>
        </div>
      ) : shown.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center">
          <IconSearchOff className="mx-auto h-9 w-9 text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-gray-600 dark:text-gray-300">{t.noneFound}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {shown.map((tp) => (
            <li key={tp.id}>
              <Link
                href={`${base}/${tp.id}`}
                className="reveal group glass flex items-center gap-4 rounded-2xl px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef1fb] dark:bg-[#1b2338] text-[#1428a0] dark:text-blue-300">
                  <IconChat className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-[#1428a0] dark:group-hover:text-blue-300">
                    {tp.title}
                  </span>
                  <span className="block text-xs text-gray-400 dark:text-gray-500">
                    {tp.name} · {tp.line}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-semibold text-[#1428a0] dark:text-blue-300">{t.replies(tp.replies)}</span>
                  <span className="block text-[11px] text-gray-400 dark:text-gray-500">{timeAgo(tp.lastAt, locale)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
