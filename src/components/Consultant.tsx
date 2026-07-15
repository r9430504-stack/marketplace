"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { localeFromPathname } from "@/lib/i18n";
import type { ConsultPhone } from "@/lib/consult";

type ChatMsg = { role: "user" | "assistant"; content: string };

const T = {
  en: {
    open: "Open the AI consultant",
    title: "Galaxy AI Consultant",
    intro: "Ask me anything about Samsung Galaxy phones — I'll recommend the right one from our catalog.",
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
    intro: "Спросите что угодно про смартфоны Samsung Galaxy — подберу подходящий из нашего каталога.",
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

function splitGoto(content: string): { text: string; goto: string | null } {
  const m = content.match(/^\s*GOTO:\s*(\/\S+)\s*$/im);
  if (!m) return { text: content, goto: null };
  return { text: content.replace(m[0], "").trim(), goto: m[1] };
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

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
      let reply: string;
      if (r.status === 503) reply = t.notReady;
      else if (r.status === 429) reply = t.rate;
      else if (!r.ok) reply = t.error;
      else reply = (await r.json()).reply || t.error;
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: t.error }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        id="ai-consultant-button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.open}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-[#1428a0] text-white text-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
      >
        {open ? "✕" : "G"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[75vh] max-h-[560px]">
          <div className="bg-[#1428a0] text-white px-4 py-3 flex items-center gap-2 shrink-0">
            <span className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center font-bold">G</span>
            <span className="font-semibold">{t.title}</span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-sm space-y-3">
            {msgs.length === 0 && (
              <>
                <p className="text-gray-600">{t.intro}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {t.suggestions.map((s) => (
                    <button key={s} onClick={() => send(s)} className="px-3 py-1.5 rounded-full text-xs border border-gray-300 text-gray-700 hover:border-black text-left">{s}</button>
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
              const { text, goto } = splitGoto(m.content);
              return (
                <div key={i} className="text-left space-y-2">
                  <span className="inline-block rounded-2xl px-3 py-2 max-w-[85%] bg-gray-100 text-gray-800">{renderRich(text)}</span>
                  {goto && (
                    <div>
                      <button
                        onClick={() => { router.push(hrefFor(goto)); setOpen(false); }}
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        {t.goto(nameFor(goto) || "")}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {loading && <div className="text-left"><span className="inline-block rounded-2xl px-3 py-2 bg-gray-100 text-gray-500">{t.thinking}</span></div>}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-gray-200 p-2 flex gap-2 shrink-0">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#1428a0]" />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4 py-2 text-sm disabled:opacity-40">{t.send}</button>
          </form>
        </div>
      )}
    </>
  );
}
