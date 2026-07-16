"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import type { Locale } from "@/lib/i18n";
import { timeAgo } from "@/lib/timeago";

type Topic = {
  id: string;
  slug: string;
  name: string;
  line: string;
  ru: boolean;
  title: string;
  body: string;
  createdAt: string;
  mine: boolean;
};
type Reply = { id: string; body: string; createdAt: string; mine: boolean };

const T = {
  en: {
    back: "← All topics",
    model: "About",
    anon: "Anonymous",
    remove: "Delete",
    reply: "Reply",
    replying: "Sending…",
    placeholder: "Write a reply…",
    signin: "Sign in with Google to reply.",
    signinBtn: "Sign in with Google",
    note: "Replies are public. Please don't share personal information.",
    empty: "No replies yet — be the first to help.",
    notFound: "This topic no longer exists.",
    profanity: "This reply can't be published — it looks like it contains offensive language. Please rephrase it.",
    error: "Something went wrong. Please try again.",
    confirmDel: "Delete this topic?",
  },
  ru: {
    back: "← Все темы",
    model: "О модели",
    anon: "Аноним",
    remove: "Удалить",
    reply: "Ответить",
    replying: "Отправка…",
    placeholder: "Напишите ответ…",
    signin: "Войдите через Google, чтобы ответить.",
    signinBtn: "Войти через Google",
    note: "Ответы видны всем. Пожалуйста, не указывайте личные данные.",
    empty: "Ответов пока нет — помогите первым.",
    notFound: "Эта тема больше не существует.",
    profanity: "Этот ответ нельзя опубликовать — похоже, он содержит недопустимую лексику. Пожалуйста, переформулируйте.",
    error: "Что-то пошло не так. Попробуйте ещё раз.",
    confirmDel: "Удалить эту тему?",
  },
};

function Warn({ text }: { text: string }) {
  return (
    <div
      role="alert"
      className="mt-3 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <span>{text}</span>
    </div>
  );
}

function TrashBtn({ onClick, title }: { onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="shrink-0 self-start text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
      </svg>
    </button>
  );
}

function Avatar() {
  return (
    <span className="h-9 w-9 shrink-0 rounded-full bg-[#eef1fb] dark:bg-[#1b2338] grid place-items-center text-[#1428a0] dark:text-blue-300 font-bold">
      ◆
    </span>
  );
}

export default function TopicThread({ id, locale = "en" }: { id: string; locale?: Locale }) {
  const t = T[locale];
  const router = useRouter();
  const base = locale === "ru" ? "/ru/forum" : "/forum";
  const { data, status } = useSession();
  const authed = status === "authenticated" && !!data?.user;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [input, setInput] = useState("");
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/topics/${encodeURIComponent(id)}`);
      if (r.status === 404) {
        setNotFound(true);
        return;
      }
      const d = await r.json();
      if (d.topic) {
        setTopic(d.topic);
        setReplies(Array.isArray(d.replies) ? d.replies : []);
      } else setNotFound(true);
    } catch {
      /* keep */
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const b = input.trim();
    if (!b || posting) return;
    setPosting(true);
    setErr("");
    try {
      const r = await fetch(`/api/topics/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: b }),
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
      if (d.reply) {
        setReplies((x) => [...x, d.reply as Reply]);
        setInput("");
      } else setErr(t.error);
    } catch {
      setErr(t.error);
    } finally {
      setPosting(false);
    }
  };

  const delReply = async (rid: string) => {
    setReplies((x) => x.filter((r) => r.id !== rid));
    try {
      await fetch(`/api/topics/${encodeURIComponent(id)}?reply=${encodeURIComponent(rid)}`, { method: "DELETE" });
    } catch {}
  };
  const delTopic = async () => {
    if (!window.confirm(t.confirmDel)) return;
    try {
      await fetch(`/api/topics/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {}
    router.push(base);
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-5">
        <span className="img-skeleton block h-5 w-2/3 rounded" />
        <span className="img-skeleton mt-3 block h-3 w-full rounded" />
        <span className="img-skeleton mt-2 block h-3 w-5/6 rounded" />
      </div>
    );
  }
  if (notFound || !topic) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">{t.notFound}</p>
        <Link href={base} className="btn-primary mt-4 inline-flex px-5 py-2.5 text-sm">
          {t.back}
        </Link>
      </div>
    );
  }

  const modelHref = `${locale === "ru" ? "/ru" : ""}/phones/${topic.slug}`;

  return (
    <div>
      <Link href={base} className="text-sm font-medium text-[#1428a0] dark:text-blue-300 hover:underline">
        {t.back}
      </Link>

      {/* Original post */}
      <div className="glass mt-3 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{topic.title}</h1>
          {topic.mine && <TrashBtn onClick={delTopic} title={t.remove} />}
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t.model}:{" "}
          <Link href={modelHref} className="font-medium text-[#1428a0] dark:text-blue-300 hover:underline">
            {topic.name}
          </Link>{" "}
          · {topic.line}
        </p>
        <div className="mt-4 flex gap-3">
          <Avatar />
          <div className="min-w-0 flex-1">
            <div className="text-xs text-gray-400 dark:text-gray-500">
              <span className="font-semibold text-gray-600 dark:text-gray-300">{t.anon}</span> ·{" "}
              <time dateTime={topic.createdAt}>{timeAgo(topic.createdAt, locale)}</time>
            </div>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-gray-100">{topic.body}</p>
          </div>
        </div>
      </div>

      {/* Replies */}
      <ul className="mt-4 space-y-3">
        {replies.length === 0 ? (
          <li className="py-2 text-sm text-gray-500 dark:text-gray-400">{t.empty}</li>
        ) : (
          replies.map((r) => (
            <li key={r.id} className="glass flex gap-3 rounded-2xl p-4">
              <Avatar />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">{t.anon}</span> ·{" "}
                  <time dateTime={r.createdAt}>{timeAgo(r.createdAt, locale)}</time>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-gray-100">{r.body}</p>
              </div>
              {r.mine && <TrashBtn onClick={() => delReply(r.id)} title={t.remove} />}
            </li>
          ))
        )}
      </ul>

      {/* Reply box */}
      <div className="mt-6">
        {authed ? (
          <form onSubmit={submit} className="glass rounded-2xl p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              rows={3}
              placeholder={t.placeholder}
              className="w-full resize-y rounded-xl border border-gray-300 dark:border-gray-700 bg-white px-3 py-2 text-base outline-none focus:border-[#1428a0] focus:ring-1 focus:ring-[#1428a0]"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-gray-400 dark:text-gray-500">{t.note}</p>
              <button type="submit" disabled={posting || input.trim().length < 2} className="btn-primary shrink-0 px-4 py-2 text-sm disabled:opacity-40">
                {posting ? t.replying : t.reply}
              </button>
            </div>
          </form>
        ) : (
          <div className="glass rounded-2xl p-5 flex flex-col items-start gap-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">{t.signin}</p>
            <button
              onClick={() => signIn("google")}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-[#1428a0] dark:hover:border-blue-400 transition-colors"
            >
              {t.signinBtn}
            </button>
          </div>
        )}
        {err && <Warn text={err} />}
      </div>
    </div>
  );
}
