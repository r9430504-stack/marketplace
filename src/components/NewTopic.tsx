"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import type { Locale } from "@/lib/i18n";

type Phone = { slug: string; name: string; line: string };

const T = {
  en: {
    signin: "Sign in with Google to start a topic.",
    signinBtn: "Sign in with Google",
    step1: "1. Choose a model",
    step2: "2. Topic title",
    step3: "3. Description",
    search: "Search a model…",
    change: "Change",
    titlePh: "What's your topic about?",
    bodyPh: "Describe your question or problem…",
    create: "Create topic",
    creating: "Creating…",
    note: "Public topic. Please don't share personal information.",
    profanity: "This topic can't be published — it looks like it contains offensive language. Please rephrase it.",
    error: "Something went wrong. Please try again.",
    none: "Nothing found",
  },
  ru: {
    signin: "Войдите через Google, чтобы создать тему.",
    signinBtn: "Войти через Google",
    step1: "1. Выберите модель",
    step2: "2. Заголовок темы",
    step3: "3. Описание",
    search: "Поиск модели…",
    change: "Изменить",
    titlePh: "О чём ваша тема?",
    bodyPh: "Опишите вопрос или проблему…",
    create: "Создать тему",
    creating: "Создаём…",
    note: "Тема видна всем. Пожалуйста, не указывайте личные данные.",
    profanity: "Эту тему нельзя опубликовать — похоже, она содержит недопустимую лексику. Пожалуйста, переформулируйте.",
    error: "Что-то пошло не так. Попробуйте ещё раз.",
    none: "Ничего не найдено",
  },
};

export default function NewTopic({ phones, locale = "en" }: { phones: Phone[]; locale?: Locale }) {
  const t = T[locale];
  const router = useRouter();
  const base = locale === "ru" ? "/ru/forum" : "/forum";
  const { data, status } = useSession();
  const authed = status === "authenticated" && !!data?.user;

  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Phone | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return phones.slice(0, 40);
    return phones.filter((p) => p.name.toLowerCase().includes(s) || p.line.toLowerCase().includes(s)).slice(0, 40);
  }, [q, phones]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sel || title.trim().length < 4 || body.trim().length < 5 || busy) return;
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: sel.slug, title: title.trim(), body: body.trim() }),
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
      if (d.id) {
        router.push(`${base}/${d.id}`);
        return;
      }
      setErr(t.error);
    } catch {
      setErr(t.error);
    } finally {
      setBusy(false);
    }
  };

  if (!authed) {
    return (
      <div className="glass rounded-2xl p-6 flex flex-col items-start gap-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">{t.signin}</p>
        <button
          onClick={() => signIn("google")}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-[#1428a0] dark:hover:border-blue-400 transition-colors"
        >
          {t.signinBtn}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Step 1: model */}
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">{t.step1}</p>
        {sel ? (
          <div className="glass flex items-center justify-between gap-3 rounded-xl px-4 py-3">
            <span className="min-w-0">
              <span className="block font-semibold text-gray-900 dark:text-gray-100 truncate">{sel.name}</span>
              <span className="block text-xs text-gray-400 dark:text-gray-500">{sel.line}</span>
            </span>
            <button
              type="button"
              onClick={() => setSel(null)}
              className="shrink-0 text-sm font-medium text-[#1428a0] dark:text-blue-300 hover:underline"
            >
              {t.change}
            </button>
          </div>
        ) : (
          <div className="glass rounded-xl p-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.search}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-3 py-2 text-base outline-none focus:border-[#1428a0]"
            />
            <ul className="mt-2 max-h-64 overflow-y-auto">
              {matches.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-400">{t.none}</li>
              ) : (
                matches.map((p) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onClick={() => {
                        setSel(p);
                        setQ("");
                      }}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-100">{p.name}</span>
                      <span className="text-xs text-gray-400">{p.line}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Steps 2 & 3 appear once a model is chosen */}
      {sel && (
        <>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">{t.step2}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder={t.titlePh}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white px-3 py-2.5 text-base outline-none focus:border-[#1428a0] focus:ring-1 focus:ring-[#1428a0]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">{t.step3}</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={4000}
              rows={6}
              placeholder={t.bodyPh}
              className="w-full resize-y rounded-xl border border-gray-300 dark:border-gray-700 bg-white px-3 py-2.5 text-base outline-none focus:border-[#1428a0] focus:ring-1 focus:ring-[#1428a0]"
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t.note}</p>
          </div>

          {err && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span>{err}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy || title.trim().length < 4 || body.trim().length < 5}
            className="btn-primary px-6 py-3 text-base disabled:opacity-40"
          >
            {busy ? t.creating : t.create}
          </button>
        </>
      )}
    </form>
  );
}
