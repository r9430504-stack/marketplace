"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { localeFromPathname } from "@/lib/i18n";
import type { ConsultPhone } from "@/lib/consult";

type ChatMsg = { role: "user" | "assistant"; content: string };

/** Reveal `text` character-by-character (typewriter) while `active`. Splits by
 * code points so emoji aren't cut in half. */
function useTypewriter(text: string, active: boolean, speed = 38) {
  const chars = useMemo(() => [...text], [text]);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    setN(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= chars.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [chars, active, speed]);
  return { text: chars.slice(0, n).join(""), done: n >= chars.length };
}

const T = {
  en: {
    open: "Open the AI consultant",
    title: "Galaxy AI Consultant",
    greeting: "👋 Hi! I'm Galaxy AI — your smart assistant for choosing a Samsung Galaxy phone. Tell me what matters to you (budget, camera, battery, size…) and I'll pick the right model and open its page for you.",
    intro: "Ask me anything about Samsung Galaxy phones — I'll recommend the right one from our catalog.",
    bubble: "👋 Need help choosing a Galaxy? Ask me!",
    suggestions: ["Which Galaxy has the best battery?", "S24 or S25?", "Recommend a compact flagship", "Best Samsung foldable"],
    placeholder: "Ask about a Galaxy phone…",
    send: "Send",
    thinking: "Thinking…",
    goto: (name: string) => `Open ${name} →`,
    notReady: "AI chat isn't switched on yet — please try again later 🙂",
    rate: "A bit too many questions at once — please try again in a minute.",
    error: "Something went wrong. Please try again.",
  },
  ru: {
    open: "Открыть ИИ-консультанта",
    title: "Galaxy AI консультант",
    greeting: "👋 Привет! Я Galaxy AI — умный помощник по выбору смартфона Samsung Galaxy. Опишите, что для вас важно (бюджет, камера, батарея, размер…), и я подберу подходящую модель и открою её страницу.",
    intro: "Спросите что угодно про смартфоны Samsung Galaxy — подберу подходящий из нашего каталога.",
    bubble: "👋 Помогу выбрать Galaxy — спросите меня!",
    suggestions: ["Какой Galaxy с лучшей батареей?", "S24 или S25?", "Посоветуй компактный флагман", "Лучший складной Samsung"],
    placeholder: "Спросите про телефон Galaxy…",
    send: "Отпр.",
    thinking: "Думаю…",
    goto: (name: string) => `Перейти к ${name} →`,
    notReady: "Чат с ИИ ещё не подключён — попробуйте позже 🙂",
    rate: "Слишком много вопросов сразу — попробуйте через минуту.",
    error: "Что-то пошло не так. Попробуйте ещё раз.",
  },
};

const LINK_RE = /(\/(?:ru\/)?(?:phones|compare|best|series)\/[a-z0-9-]+)/g;

function splitGoto(content: string): { text: string; gotos: string[] } {
  const gotos: string[] = [];
  const text = content
    .replace(/^\s*GOTO:\s*(\/\S+)\s*$/gim, (_m, p1: string) => {
      gotos.push(p1);
      return "";
    })
    .trim();
  return { text, gotos };
}

function renderRich(text: string) {
  return text.split(LINK_RE).map((part, i) =>
    LINK_RE.test(part) ? (
      <Link key={i} href={part} className="text-[#1428a0] underline font-medium">{part}</Link>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function Consultant({ phones }: { phones: ConsultPhone[] }) {
  const locale = localeFromPathname(usePathname() || "/");
  const t = T[locale];
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bubble, setBubble] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  // Proactive greeting bubble near the button, so people understand what
  // "Galaxy AI" is without having to open the chat first. Shown once, then
  // remembered so it doesn't reappear on every reload.
  useEffect(() => {
    try {
      if (localStorage.getItem("consult-greeted") === "1") return;
    } catch {
      return;
    }
    const id = window.setTimeout(() => setBubble(true), 2600);
    return () => window.clearTimeout(id);
  }, []);

  const dismissBubble = () => {
    setBubble(false);
    try {
      localStorage.setItem("consult-greeted", "1");
    } catch {}
  };

  // Type the invitation out slowly, like the consultant is writing it.
  const typed = useTypewriter(t.bubble, bubble && !open);

  const toggleOpen = () => {
    dismissBubble();
    setOpen((o) => !o);
  };

  const hrefFor = (path: string) => {
    const slug = path.split("/").filter(Boolean).pop() ?? "";
    const p = phones.find((x) => x.slug === slug);
    if (!p) return path;
    return locale === "ru" && p.hasRu ? `/ru/phones/${p.slug}` : `/phones/${p.slug}`;
  };
  const nameFor = (path: string) => {
    const slug = path.split("/").filter(Boolean).pop() ?? "";
    return phones.find((x) => x.slug === slug)?.name ?? "";
  };

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next = [...msgs, { role: "user" as const, content: q }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, locale }),
      });
      const data = await r.json().catch(() => ({} as { reply?: string; detail?: string }));
      let reply: string;
      if (r.status === 503) reply = t.notReady;
      else if (r.status === 429) reply = t.rate;
      else if (!r.ok) reply = data.detail ? `${t.error}\n\n⚠️ ${data.detail}` : t.error;
      else reply = data.reply || t.error;
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: t.error }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {bubble && !open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[min(17.5rem,calc(100vw-2.5rem))] animate-[fadeIn_.35s_ease]">
          {/* A chat-style message from the consultant: avatar, name and text
           * with a speech-bubble tail pointing down toward the button. */}
          <div className="relative rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-2xl border border-gray-200 dark:border-gray-800">
            <button
              onClick={dismissBubble}
              aria-label="Dismiss"
              className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full bg-gray-800 dark:bg-gray-700 text-white text-xs leading-none shadow flex items-center justify-center"
            >
              ✕
            </button>
            <button onClick={toggleOpen} className="flex items-start gap-2.5 p-3 pr-4 text-left">
              <span className="h-8 w-8 shrink-0 rounded-full bg-[#1428a0] text-white text-sm font-bold grid place-items-center shadow">
                G
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-semibold text-gray-900 dark:text-gray-100">
                  {t.title}
                </span>
                <span className="block text-sm text-gray-700 dark:text-gray-300 mt-0.5 leading-snug min-h-[1.25rem]">
                  {typed.text}
                  {!typed.done && (
                    <span className="ml-0.5 inline-block w-1.5 h-3.5 -mb-0.5 bg-[#1428a0] dark:bg-blue-400 animate-pulse align-middle" />
                  )}
                </span>
              </span>
            </button>
            {/* speech-bubble tail toward the "G" button below */}
            <span
              aria-hidden
              className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 bg-white dark:bg-[#1a1a1a] border-b border-r border-gray-200 dark:border-gray-800"
            />
          </div>
        </div>
      )}

      <button
        id="ai-consultant-button"
        onClick={toggleOpen}
        aria-label={t.open}
        className="fixed bottom-5 right-5 z-[60] h-14 w-14 rounded-full bg-[#1428a0] text-white text-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
      >
        {open ? "✕" : "G"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col h-[75vh] max-h-[560px]">
          <div className="bg-[#1428a0] text-white px-4 py-3 flex items-center gap-2 shrink-0">
            <span className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center font-bold">G</span>
            <span className="font-semibold">{t.title}</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-sm space-y-3">
            {msgs.length === 0 && (
              <>
                <div className="text-left">
                  <span className="inline-block rounded-2xl px-3 py-2 max-w-[90%] bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">{t.greeting}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {t.suggestions.map((s) => (
                    <button key={s} onClick={() => send(s)} className="px-3 py-1.5 rounded-full text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-gray-400 text-left">{s}</button>
                  ))}
                </div>
              </>
            )}
            {msgs.map((m, i) => {
              if (m.role === "user") {
                return (
                  <div key={i} className="text-right">
                    <span className="inline-block rounded-2xl px-3 py-2 max-w-[85%] bg-[#1428a0] text-white">{m.content}</span>
                  </div>
                );
              }
              const { text, gotos } = splitGoto(m.content);
              return (
                <div key={i} className="text-left space-y-2">
                  <span className="inline-block rounded-2xl px-3 py-2 max-w-[85%] bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{renderRich(text)}</span>
                  {gotos.length > 0 && (
                    <div className="flex flex-col items-start gap-2">
                      {gotos.map((g, k) => (
                        <button
                          key={g}
                          onClick={() => { router.push(hrefFor(g)); setOpen(false); }}
                          className={`${k === 0 ? "btn-primary" : "btn-outline"} px-4 py-2 text-sm`}
                        >
                          {t.goto(nameFor(g) || "")}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {loading && <div className="text-left"><span className="inline-block rounded-2xl px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t.thinking}</span></div>}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-gray-200 dark:border-gray-800 p-2 flex gap-2 shrink-0">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#1428a0]" />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4 py-2 text-sm disabled:opacity-40">{t.send}</button>
          </form>
        </div>
      )}
    </>
  );
}
