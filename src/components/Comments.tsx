"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import type { Locale } from "@/lib/i18n";

type Comment = { id: string; body: string; createdAt: string; mine: boolean };

const T = {
  en: {
    title: "Discussion",
    empty: "No comments yet — be the first to share your thoughts.",
    placeholder: "Write a comment…",
    post: "Post",
    posting: "Posting…",
    signin: "Sign in with Google to leave a comment.",
    signinBtn: "Sign in with Google",
    note: "Comments are public. Please don't share personal information.",
    anon: "Anonymous",
    remove: "Delete",
    error: "Something went wrong. Please try again.",
    profanity: "This message can't be published — it looks like it contains offensive language. Please rephrase it.",
    justNow: "just now",
    min: "min ago",
    hr: "h ago",
    day: "d ago",
  },
  ru: {
    title: "Обсуждение",
    empty: "Пока нет комментариев — будьте первым.",
    placeholder: "Напишите комментарий…",
    post: "Отправить",
    posting: "Отправка…",
    signin: "Войдите через Google, чтобы оставить комментарий.",
    signinBtn: "Войти через Google",
    note: "Комментарии видны всем. Пожалуйста, не указывайте личные данные.",
    anon: "Аноним",
    remove: "Удалить",
    error: "Что-то пошло не так. Попробуйте ещё раз.",
    profanity: "Это сообщение не может быть опубликовано — похоже, оно содержит недопустимую лексику. Пожалуйста, переформулируйте.",
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

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 16 3 9.1 7.6 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 36 26.7 37 24 37c-5.3 0-9.7-2.6-11.3-6.9l-6.5 5C9.1 41.4 16 45 24 45z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.8 35.6 45 30.3 45 24c0-1.2-.1-2.3-.4-3.5z" />
  </svg>
);

export default function Comments({ slug, locale = "en" }: { slug: string; locale?: Locale }) {
  const { data, status } = useSession();
  const t = T[locale];
  const [items, setItems] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      const d = await r.json();
      setItems(Array.isArray(d.comments) ? d.comments : []);
    } catch {
      /* keep whatever we have */
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = input.trim();
    if (!body || posting) return;
    setPosting(true);
    setErr("");
    try {
      const r = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, body }),
      });
      if (r.status === 401) {
        signIn("google");
        return;
      }
      if (r.status === 422) {
        setErr(t.profanity);
        return;
      }
      const d = await r.json().catch(() => ({}));
      if (d.comment) {
        setItems((x) => [d.comment as Comment, ...x]);
        setInput("");
      } else {
        setErr(t.error);
      }
    } catch {
      setErr(t.error);
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id: string) => {
    setItems((x) => x.filter((c) => c.id !== id));
    try {
      await fetch(`/api/comments?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      /* best effort */
    }
  };

  const authed = status === "authenticated" && !!data?.user;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {t.title}
        {items.length > 0 && <span className="text-gray-400 font-normal"> ({items.length})</span>}
      </h2>

      {authed ? (
        <form onSubmit={submit} className="glass rounded-2xl p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder={t.placeholder}
            className="w-full resize-y rounded-xl border border-gray-300 dark:border-gray-700 bg-white px-3 py-2 text-base outline-none focus:border-[#1428a0] focus:ring-1 focus:ring-[#1428a0]"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400 dark:text-gray-500">{t.note}</p>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs tabular-nums text-gray-400">{input.length}/1000</span>
              <button
                type="submit"
                disabled={posting || input.trim().length < 2}
                className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
              >
                {posting ? t.posting : t.post}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="glass rounded-2xl p-5 flex flex-col items-start gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t.signin}</p>
          <button
            onClick={() => signIn("google")}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-[#1428a0] dark:hover:border-blue-400 transition-colors"
          >
            <GoogleIcon />
            {t.signinBtn}
          </button>
        </div>
      )}

      {err && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span>{err}</span>
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {loading ? (
          [0, 1].map((i) => (
            <li key={i} className="glass rounded-2xl p-4 flex gap-3">
              <span className="img-skeleton h-9 w-9 rounded-full shrink-0" />
              <span className="flex-1 space-y-2">
                <span className="img-skeleton block h-3 w-24 rounded" />
                <span className="img-skeleton block h-3 w-full rounded" />
              </span>
            </li>
          ))
        ) : items.length === 0 ? (
          <li className="text-sm text-gray-500 dark:text-gray-400 py-2">{t.empty}</li>
        ) : (
          items.map((c) => (
            <li key={c.id} className="glass rounded-2xl p-4 flex gap-3">
              {/* Neutral avatar — no photo, no name, no personal info. */}
              <span className="h-9 w-9 shrink-0 rounded-full bg-[#eef1fb] dark:bg-[#1b2338] grid place-items-center text-[#1428a0] dark:text-blue-300 font-bold">
                ◆
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">{t.anon}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={c.createdAt}>{timeAgo(c.createdAt, t, locale)}</time>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-gray-100">
                  {c.body}
                </p>
              </div>
              {c.mine && (
                <button
                  onClick={() => remove(c.id)}
                  title={t.remove}
                  aria-label={t.remove}
                  className="shrink-0 self-start text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
                  </svg>
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
