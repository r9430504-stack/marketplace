"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { timeAgo } from "@/lib/timeago";
import { IconChat, IconSearchOff, IconHeart, IconPin, IconLock } from "@/components/icons";

type Topic = {
  id: string;
  slug: string;
  name: string;
  line: string;
  ru: boolean;
  title: string;
  category: string;
  replies: number;
  likes: number;
  pinned: boolean;
  locked: boolean;
  createdAt: string;
  lastAt: string;
};

type SortKey = "active" | "new" | "replies" | "likes";
type CatFilter = "all" | "discussion" | "question" | "problem";

const T = {
  en: {
    add: "New topic",
    empty: "No topics yet — start the first discussion!",
    searchPh: "Search topics…",
    noneFound: "No topics match your search.",
    pinned: "Pinned",
    locked: "Locked",
    sorts: { active: "Active", new: "New", replies: "Most replies", likes: "Top" } as Record<SortKey, string>,
    cats: { all: "All", discussion: "Discussions", question: "Questions", problem: "Problems" } as Record<CatFilter, string>,
    catLabel: { discussion: "Discussion", question: "Question", problem: "Problem" } as Record<string, string>,
    replies: (n: number) => `${n} ${n === 1 ? "reply" : "replies"}`,
  },
  ru: {
    add: "Добавить тему",
    empty: "Тем пока нет — создайте первую!",
    searchPh: "Поиск по темам…",
    noneFound: "По запросу ничего не найдено.",
    pinned: "Закреплено",
    locked: "Закрыто",
    sorts: { active: "Активные", new: "Новые", replies: "С ответами", likes: "Топ" } as Record<SortKey, string>,
    cats: { all: "Все", discussion: "Обсуждения", question: "Вопросы", problem: "Проблемы" } as Record<CatFilter, string>,
    catLabel: { discussion: "Обсуждение", question: "Вопрос", problem: "Проблема" } as Record<string, string>,
    replies: (n: number) =>
      `${n} ${n % 10 === 1 && n % 100 !== 11 ? "ответ" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "ответа" : "ответов"}`,
  },
};

const SORT_KEYS: SortKey[] = ["active", "new", "replies", "likes"];
const CAT_FILTERS: CatFilter[] = ["all", "discussion", "question", "problem"];

// One UI pill styling per category.
const CAT_STYLE: Record<string, string> = {
  problem: "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30",
  question: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
  discussion: "bg-[#eef1fb] text-[#1428a0] border border-[#dbe1f6] dark:bg-[#1b2338] dark:text-blue-300 dark:border-[#2b3a5e]",
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

export default function ForumTopics({ locale = "en" }: { locale?: Locale }) {
  const t = T[locale];
  const base = locale === "ru" ? "/ru/forum" : "/forum";
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("active");
  const [cat, setCat] = useState<CatFilter>("all");

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

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: topics.length, discussion: 0, question: 0, problem: 0 };
    for (const tp of topics) c[tp.category] = (c[tp.category] ?? 0) + 1;
    return c;
  }, [topics]);

  const shown = useMemo(() => {
    const needle = norm(query);
    const terms = needle.split(" ").filter(Boolean);
    const filtered = topics.filter((tp) => {
      if (cat !== "all" && tp.category !== cat) return false;
      if (!needle) return true;
      const hay = norm(`${tp.title} ${tp.name} ${tp.line}`);
      return terms.every((w) => hay.includes(w));
    });
    // Pinned threads always float to the top; the rest follow the chosen sort.
    const by: Record<SortKey, (a: Topic, b: Topic) => number> = {
      active: (a, b) => +new Date(b.lastAt) - +new Date(a.lastAt),
      new: (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      replies: (a, b) => b.replies - a.replies || +new Date(b.lastAt) - +new Date(a.lastAt),
      likes: (a, b) => b.likes - a.likes || +new Date(b.lastAt) - +new Date(a.lastAt),
    };
    return filtered.sort((a, b) => Number(b.pinned) - Number(a.pinned) || by[sort](a, b));
  }, [topics, query, sort, cat]);

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

      {/* Category filter — Discussions / Questions / Problems. */}
      {!loading && topics.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {CAT_FILTERS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all active:scale-95 ${
                cat === c
                  ? "bg-[#1428a0] text-white dark:bg-blue-600"
                  : "bg-white border border-gray-300 text-gray-600 hover:border-[#1428a0] hover:text-[#1428a0] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              }`}
            >
              {t.cats[c]}
              <span className={`ml-1.5 text-xs ${cat === c ? "text-white/70" : "text-gray-400"}`}>{counts[c] ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      {/* Sort — iOS-style segmented control, One UI colours. */}
      {!loading && topics.length > 1 && (
        <div className="mb-4 inline-flex rounded-full bg-gray-100 dark:bg-gray-800 p-1 text-sm">
          {SORT_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              aria-pressed={sort === k}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                sort === k
                  ? "bg-white dark:bg-gray-700 text-[#1428a0] dark:text-blue-300 shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {t.sorts[k]}
            </button>
          ))}
        </div>
      )}

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
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${tp.pinned ? "bg-[#1428a0] text-white" : "bg-[#eef1fb] dark:bg-[#1b2338] text-[#1428a0] dark:text-blue-300"}`}>
                  {tp.pinned ? <IconPin className="h-5 w-5" /> : <IconChat className="h-5 w-5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    {tp.pinned && (
                      <span className="shrink-0 rounded-full bg-[#eef1fb] dark:bg-[#1b2338] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#1428a0] dark:text-blue-300">
                        {t.pinned}
                      </span>
                    )}
                    {tp.locked && (
                      <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        <IconLock size={11} /> {t.locked}
                      </span>
                    )}
                    {t.catLabel[tp.category] && (
                      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CAT_STYLE[tp.category] ?? CAT_STYLE.discussion}`}>
                        {t.catLabel[tp.category]}
                      </span>
                    )}
                    <span className="truncate font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#1428a0] dark:group-hover:text-blue-300">
                      {tp.title}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">
                    {tp.name} · {tp.line}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="flex items-center justify-end gap-2 text-sm font-semibold text-[#1428a0] dark:text-blue-300">
                    {tp.likes > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-gray-500 dark:text-gray-400">
                        <IconHeart size={13} filled /> {tp.likes}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <IconChat size={13} /> {tp.replies}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11px] text-gray-400 dark:text-gray-500">{timeAgo(tp.lastAt, locale)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
