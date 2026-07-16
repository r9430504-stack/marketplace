"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type Board = { slug: string; name: string; line: string; ru: boolean; count: number; last: string };
type Post = { slug: string; name: string; ru: boolean; body: string; createdAt: string };

const T = {
  en: {
    title: "Forum",
    subtitle: "Discussions about Samsung Galaxy phones. Join the conversation on any model's page.",
    latest: "Latest posts",
    active: "Active discussions",
    posts: (n: number) => `${n} ${n === 1 ? "post" : "posts"}`,
    empty: "No discussions yet — be the first! Open any model and leave a comment.",
    browse: "Browse models →",
    open: "Open discussion →",
    justNow: "just now",
    min: "min ago",
    hr: "h ago",
    day: "d ago",
  },
  ru: {
    title: "Форум",
    subtitle: "Обсуждения смартфонов Samsung Galaxy. Присоединяйтесь к беседе на странице любой модели.",
    latest: "Свежие сообщения",
    active: "Активные обсуждения",
    posts: (n: number) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "сообщение" : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? "сообщения" : "сообщений")}`,
    empty: "Обсуждений пока нет — станьте первым! Откройте любую модель и оставьте комментарий.",
    browse: "К каталогу →",
    open: "Открыть обсуждение →",
    justNow: "только что",
    min: "мин назад",
    hr: "ч назад",
    day: "дн назад",
  },
};

function timeAgo(iso: string, t: (typeof T)["en"], locale: Locale): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return t.justNow;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} ${t.min}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ${t.hr}`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ${t.day}`;
  return new Date(then).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ForumContent({ locale = "en" }: { locale?: Locale }) {
  const t = T[locale];
  const [boards, setBoards] = useState<Board[]>([]);
  const [latest, setLatest] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/forum")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setBoards(Array.isArray(d.boards) ? d.boards : []);
        setLatest(Array.isArray(d.latest) ? d.latest : []);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const href = (slug: string, ru: boolean) =>
    `${locale === "ru" && ru ? "/ru" : ""}/phones/${slug}#discussion`;

  if (loading) {
    return (
      <ul className="mt-6 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="glass rounded-2xl p-4">
            <span className="img-skeleton block h-4 w-40 rounded" />
            <span className="img-skeleton mt-2 block h-3 w-24 rounded" />
          </li>
        ))}
      </ul>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-4xl">💬</p>
        <p className="mt-3 text-gray-600 dark:text-gray-300">{t.empty}</p>
        <Link href={locale === "ru" ? "/ru/phones" : "/phones"} className="btn-primary mt-5 inline-flex px-5 py-2.5 text-sm">
          {t.browse}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Latest posts */}
      {latest.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{t.latest}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {latest.slice(0, 8).map((p, i) => (
              <li key={i}>
                <Link
                  href={href(p.slug, p.ru)}
                  className="reveal group glass block rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(20,40,160,0.35)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#1428a0] dark:text-blue-300">{p.name}</span>
                    <time className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">
                      {timeAgo(p.createdAt, t, locale)}
                    </time>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-700 dark:text-gray-200">{p.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Active discussions */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{t.active}</h2>
        <ul className="space-y-2">
          {boards.map((b) => (
            <li key={b.slug}>
              <Link
                href={href(b.slug, b.ru)}
                className="reveal group glass flex items-center gap-4 rounded-2xl px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef1fb] dark:bg-[#1b2338] text-[#1428a0] dark:text-blue-300 font-bold">
                  💬
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-gray-900 dark:text-gray-100 truncate">{b.name}</span>
                  <span className="block text-xs text-gray-400 dark:text-gray-500">{b.line}</span>
                </span>
                <span className="text-right shrink-0">
                  <span className="block text-sm font-semibold text-[#1428a0] dark:text-blue-300">{t.posts(b.count)}</span>
                  <span className="block text-[11px] text-gray-400 dark:text-gray-500">{timeAgo(b.last, t, locale)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
