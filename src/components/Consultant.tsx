"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/i18n";
import { recommend, type ConsultPhone, type Use } from "@/lib/consult";

type Tier = ConsultPhone["tier"] | "any";
type ChatMsg = { role: "user" | "assistant"; content: string };

const T = {
  en: {
    greet: "I'm your personal Galaxy consultant — I'll help you choose 👋",
    open: "Open the phone consultant",
    title: "Choose your Galaxy",
    tabGuided: "Quick picker",
    tabChat: "Ask AI",
    intro: "Answer two quick questions and I'll suggest the best models for you.",
    q1: "What's your budget?",
    tiers: { flagship: "Flagship", mid: "Mid-range", budget: "Budget", any: "Doesn't matter" } as Record<Tier, string>,
    q2: "What matters most? (pick any)",
    uses: { camera: "Camera / photos", gaming: "Power / gaming", battery: "Battery life", spen: "S Pen / notes", compact: "Compact size", foldable: "Foldable" } as Record<Use, string>,
    show: "Show my picks",
    result: "My picks for you:",
    restart: "Start over",
    chatIntro: "Ask me anything about Samsung Galaxy phones — I'll recommend from our catalog.",
    suggestions: ["Which Galaxy has the best battery?", "S24 or S25?", "Recommend a compact flagship", "Best Samsung foldable"],
    placeholder: "Ask about a Galaxy phone…",
    send: "Send",
    thinking: "Thinking…",
    notReady: "AI chat isn't switched on yet — try the Quick picker for now 🙂",
    rate: "A bit too many questions at once — please try again in a minute.",
    error: "Something went wrong. Please try again.",
    reasons: {
      battery: (p: ConsultPhone) => `${p.batteryMah.toLocaleString()} mAh — lasts long`,
      camera: (p: ConsultPhone) => `${p.cameraMp} MP main camera`,
      spen: () => "Built-in S Pen",
      foldable: () => "Folds into a tablet",
      compact: (p: ConsultPhone) => `Compact ${p.displayIn}″ screen`,
      gaming: (p: ConsultPhone) => `Flagship performance (${p.year})`,
      default: (p: ConsultPhone) => `${p.releaseDate}`,
    },
  },
  ru: {
    greet: "Я ваш личный консультант по Galaxy — помогу выбрать 👋",
    open: "Открыть консультанта",
    title: "Подберём ваш Galaxy",
    tabGuided: "Быстрый подбор",
    tabChat: "Чат с ИИ",
    intro: "Ответьте на два вопроса — предложу лучшие модели под вас.",
    q1: "Какой бюджет?",
    tiers: { flagship: "Флагман", mid: "Средний", budget: "Бюджет", any: "Не важно" } as Record<Tier, string>,
    q2: "Что важнее всего? (можно несколько)",
    uses: { camera: "Камера / фото", gaming: "Мощность / игры", battery: "Батарея", spen: "S Pen / заметки", compact: "Компактность", foldable: "Складной" } as Record<Use, string>,
    show: "Показать подборку",
    result: "Моя подборка для вас:",
    restart: "Начать заново",
    chatIntro: "Спросите что угодно про смартфоны Samsung Galaxy — подскажу из нашего каталога.",
    suggestions: ["Какой Galaxy с лучшей батареей?", "S24 или S25?", "Посоветуй компактный флагман", "Лучший складной Samsung"],
    placeholder: "Спросите про телефон Galaxy…",
    send: "Отпр.",
    thinking: "Думаю…",
    notReady: "Чат с ИИ ещё не подключён — пока воспользуйтесь быстрым подбором 🙂",
    rate: "Слишком много вопросов сразу — попробуйте через минуту.",
    error: "Что-то пошло не так. Попробуйте ещё раз.",
    reasons: {
      battery: (p: ConsultPhone) => `${p.batteryMah.toLocaleString()} мА·ч — надолго`,
      camera: (p: ConsultPhone) => `Камера ${p.cameraMp} Мп`,
      spen: () => "Есть перо S Pen",
      foldable: () => "Складной экран",
      compact: (p: ConsultPhone) => `Компактный экран ${p.displayIn}″`,
      gaming: (p: ConsultPhone) => `Флагманская мощность (${p.year})`,
      default: (p: ConsultPhone) => `${p.releaseDate}`,
    },
  },
};

const USE_KEYS: Use[] = ["camera", "gaming", "battery", "spen", "compact", "foldable"];
const TIER_KEYS: Tier[] = ["flagship", "mid", "budget", "any"];
const LINK_RE = /(\/(?:ru\/)?(?:phones|compare|best|series)\/[a-z0-9-]+)/g;

function reasonFor(p: ConsultPhone, uses: Use[], r: (typeof T)["en"]["reasons"]) {
  for (const u of ["foldable", "spen", "battery", "camera", "compact", "gaming"] as Use[]) {
    if (uses.includes(u)) {
      if (u === "foldable" && p.foldable) return r.foldable();
      if (u === "spen" && p.spen) return r.spen();
      if (u === "battery" && p.batteryMah) return r.battery(p);
      if (u === "camera" && p.cameraMp) return r.camera(p);
      if (u === "compact" && p.displayIn) return r.compact(p);
      if (u === "gaming") return r.gaming(p);
    }
  }
  return r.default(p);
}

/** Turn /phones/… paths inside AI text into clickable links. */
function renderRich(text: string) {
  return text.split(LINK_RE).map((part, i) =>
    LINK_RE.test(part) ? (
      <Link key={i} href={part} className="text-[#1428a0] underline font-medium">
        {part}
      </Link>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function Consultant({ phones }: { phones: ConsultPhone[] }) {
  const locale = localeFromPathname(usePathname() || "/");
  const t = T[locale];

  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [tab, setTab] = useState<"guided" | "chat">("guided");

  // guided
  const [tier, setTier] = useState<Tier | null>(null);
  const [uses, setUses] = useState<Use[]>([]);
  const [done, setDone] = useState(false);

  // chat
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("consult-bubble") === "seen") return;
    const id = window.setTimeout(() => setBubble(true), 3500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const dismissBubble = () => {
    setBubble(false);
    try { sessionStorage.setItem("consult-bubble", "seen"); } catch {}
  };
  const toggleUse = (u: Use) => setUses((p) => (p.includes(u) ? p.filter((x) => x !== u) : [...p, u]));
  const reset = () => { setTier(null); setUses([]); setDone(false); };

  const picks = done && tier ? recommend(phones, tier, uses) : [];
  const modelHref = (p: ConsultPhone) => (locale === "ru" && p.hasRu ? `/ru/phones/${p.slug}` : `/phones/${p.slug}`);

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

  const tabCls = (active: boolean) =>
    `flex-1 py-2 text-sm font-semibold transition-colors ${active ? "text-[#1428a0] border-b-2 border-[#1428a0]" : "text-gray-500 hover:text-gray-800"}`;

  return (
    <>
      {bubble && !open && (
        <div className="fixed bottom-24 right-4 z-40 max-w-[15rem] rounded-2xl bg-white shadow-xl border border-gray-200 px-4 py-3 text-sm text-gray-800" style={{ animation: "fadeIn .3s ease" }}>
          <button onClick={dismissBubble} aria-label="Close" className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gray-800 text-white text-xs">✕</button>
          <button className="text-left" onClick={() => { setOpen(true); dismissBubble(); }}>{t.greet}</button>
        </div>
      )}

      <button
        onClick={() => { setOpen((o) => !o); dismissBubble(); }}
        aria-label={t.open}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-[#1428a0] text-white text-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
      >
        {open ? "✕" : "G"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[75vh]">
          <div className="bg-[#1428a0] text-white px-4 py-3 flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center font-bold">G</span>
            <span className="font-semibold">{t.title}</span>
          </div>

          <div className="flex border-b border-gray-200">
            <button className={tabCls(tab === "guided")} onClick={() => setTab("guided")}>{t.tabGuided}</button>
            <button className={tabCls(tab === "chat")} onClick={() => setTab("chat")}>{t.tabChat}</button>
          </div>

          {tab === "guided" ? (
            <div className="p-4 overflow-y-auto text-sm">
              {!done ? (
                <>
                  <p className="text-gray-600 mb-4">{t.intro}</p>
                  <p className="font-semibold text-gray-900 mb-2">{t.q1}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {TIER_KEYS.map((k) => (
                      <button key={k} onClick={() => setTier(k)} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${tier === k ? "bg-[#1428a0] text-white border-[#1428a0]" : "border-gray-300 text-gray-700 hover:border-black"}`}>{t.tiers[k]}</button>
                    ))}
                  </div>
                  <p className="font-semibold text-gray-900 mb-2">{t.q2}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {USE_KEYS.map((u) => (
                      <button key={u} onClick={() => toggleUse(u)} aria-pressed={uses.includes(u)} className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${uses.includes(u) ? "bg-[#1428a0] text-white border-[#1428a0]" : "border-gray-300 text-gray-700 hover:border-black"}`}>{t.uses[u]}</button>
                    ))}
                  </div>
                  <button disabled={!tier} onClick={() => setDone(true)} className="btn-primary w-full py-2.5 disabled:opacity-40 disabled:cursor-not-allowed">{t.show}</button>
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-900 mb-3">{t.result}</p>
                  <div className="space-y-3">
                    {picks.map((p) => (
                      <Link key={p.slug} href={modelHref(p)} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl border border-gray-200 p-2.5 hover:shadow-md hover:border-black transition-all">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/models/thumbs/${p.slug}.webp`} alt={p.name} className="h-16 w-14 object-contain bg-white rounded-md shrink-0" width={56} height={70} loading="lazy" />
                        <span>
                          <span className="block font-bold text-gray-900">{p.name}</span>
                          <span className="block text-xs text-[#1428a0] mt-0.5">{reasonFor(p, uses, t.reasons)}</span>
                          <span className="block text-[11px] text-gray-400">{p.releaseDate}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <button onClick={reset} className="mt-4 text-sm font-semibold text-[#1428a0] hover:underline">← {t.restart}</button>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-0">
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-sm space-y-3">
                {msgs.length === 0 && (
                  <>
                    <p className="text-gray-600">{t.chatIntro}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {t.suggestions.map((s) => (
                        <button key={s} onClick={() => send(s)} className="px-3 py-1.5 rounded-full text-xs border border-gray-300 text-gray-700 hover:border-black text-left">{s}</button>
                      ))}
                    </div>
                  </>
                )}
                {msgs.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                    <span className={`inline-block rounded-2xl px-3 py-2 max-w-[85%] ${m.role === "user" ? "bg-[#1428a0] text-white" : "bg-gray-100 text-gray-800"}`}>
                      {m.role === "assistant" ? renderRich(m.content) : m.content}
                    </span>
                  </div>
                ))}
                {loading && <div className="text-left"><span className="inline-block rounded-2xl px-3 py-2 bg-gray-100 text-gray-500">{t.thinking}</span></div>}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-gray-200 p-2 flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} className="flex-1 rounded-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#1428a0]" />
                <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4 py-2 text-sm disabled:opacity-40">{t.send}</button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
