// ─────────────────────────────────────────────────────────────
//  Galaxy Archive — self-contained consultant engine.
//
//  A narrow, specialized "assistant" that understands a natural-language
//  request (RU + EN), turns it into concrete criteria, and picks the best
//  Galaxy phone from our own catalog. No external AI, no API key, no quota,
//  no region limits — it runs entirely on our server and always works.
// ─────────────────────────────────────────────────────────────

import type { ConsultPhone } from "./consult";

export type Locale = "en" | "ru";

type Tier = ConsultPhone["tier"];
type Use = "camera" | "battery" | "gaming" | "compact" | "big" | "foldable" | "spen" | "water";

type Intent = {
  tier: Tier | null;
  uses: Use[];
  mentioned: ConsultPhone[];
  greeting: boolean;
  hasSignal: boolean;
};

// ── Text helpers ──────────────────────────────────────────────
function norm(s: string): string {
  return ` ${s.toLowerCase().replace(/[^\p{L}\p{N}$₽.\s-]/gu, " ").replace(/\s+/g, " ").trim()} `;
}

// Aliases people actually type for a model: "s24 ultra", "note 20", "fold 6", "a52".
function aliasesFor(p: ConsultPhone): string[] {
  const out = new Set<string>();
  const name = p.name.toLowerCase().replace(/^galaxy\s+/, ""); // "s24 ultra"
  out.add(name);
  const slug = p.slug.replace(/^galaxy-/, "").replace(/-/g, " "); // "s24 ultra"
  out.add(slug);
  // "z fold 6" → also "fold 6"; "z flip 5" → "flip 5"
  const noZ = name.replace(/^z\s+/, "");
  if (noZ !== name) out.add(noZ);
  return [...out].filter((a) => a.length >= 2);
}

/** Detect which catalog models are named in the text, longest-alias-first so
 * "s24 ultra" wins over "s24" and each match is consumed only once. */
function findMentions(text: string, phones: ConsultPhone[]): ConsultPhone[] {
  const entries: { p: ConsultPhone; a: string }[] = [];
  for (const p of phones) for (const a of aliasesFor(p)) entries.push({ p, a: ` ${a} ` });
  entries.sort((x, y) => y.a.length - x.a.length);

  let masked = norm(text);
  const found = new Map<string, ConsultPhone>();
  for (const { p, a } of entries) {
    if (found.has(p.slug)) continue;
    const idx = masked.indexOf(a);
    if (idx !== -1) {
      found.set(p.slug, p);
      masked = masked.slice(0, idx) + " ".repeat(a.length) + masked.slice(idx + a.length);
    }
  }
  // Preserve the order they appear in the original text.
  const t = norm(text);
  return [...found.values()].sort(
    (x, y) => t.indexOf(` ${aliasesFor(x)[0]} `) - t.indexOf(` ${aliasesFor(y)[0]} `)
  );
}

const USE_PATTERNS: { use: Use; re: RegExp }[] = [
  { use: "camera", re: /камер|фото|съем|съём|снима|селфи|photo|camera|selfie|photograph/ },
  { use: "battery", re: /батар|аккум|заряд|автоном|battery|charg|endurance|long[- ]?last/ },
  { use: "gaming", re: /игр|гейм|pubg|genshin|\bcod\b|фпс|\bfps\b|game|gaming|performanc|производит|мощн|быстр|flagship|snapdragon/ },
  { use: "compact", re: /компакт|маленьк|небольш|одной рук|small|compact|one[- ]?hand|pocket|mini/ },
  { use: "big", re: /большой экран|больш(ой|им) диспл|большой телефон|big screen|large screen|huge|phablet/ },
  { use: "foldable", re: /склад|раскладушк|гибк|book|раскрыв|\bfold|\bflip|foldable/ },
  { use: "spen", re: /стилус|перо|\bручк|рисова|замет|\bs[- ]?pen\b|\bspen\b|stylus|\bpen\b|note[- ]?tak/ },
  { use: "water", re: /влаг|водонепрониц|водозащ|ip6[78]|water|waterproof|dust/ },
];

function detectTier(t: string): Tier | null {
  // Numeric budget → tier (handles ₽/руб/к/тыс and $ / usd)
  const rub =
    t.match(/(\d{1,3}(?:[ .]\d{3})+|\d{4,6})\s*(?:руб|₽|\bр\b|rub)/) ||
    t.match(/(\d{1,3})\s*(?:к|тыс)\b/);
  const usd = t.match(/\$\s*(\d{2,4})/) || t.match(/(\d{2,4})\s*(?:\$|usd|dollar|доллар)/);
  let priceUsd = 0;
  if (usd) priceUsd = parseInt(usd[1], 10);
  else if (rub) {
    let n = parseInt(rub[1].replace(/[ .]/g, ""), 10);
    if (/к|тыс/.test(rub[0]) && n < 1000) n *= 1000;
    priceUsd = n / 95; // rough ₽→$ for tier bucketing only
  }
  if (priceUsd > 0) {
    if (priceUsd < 320) return "budget";
    if (priceUsd < 720) return "mid";
    return "flagship";
  }
  // Keyword tiers
  if (/флагман|топ(?:\b|овы)|премиум|лучш|мощнейш|high[- ]?end|flagship|premium|\bbest\b/.test(t)) return "flagship";
  if (/бюджет|дешев|дешёв|недорог|подешевл|эконом|\bcheap|budget|affordable|inexpensive/.test(t)) return "budget";
  if (/средн(?:ий|яя|его|ей)|\bmid\b|mid[- ]?range|middle/.test(t)) return "mid";
  return null;
}

const GREETING_RE = /^\s*(привет|здравствуй|здаров|хай|hello|hi|hey|yo|доброе|добрый|good (morning|day|evening))\b/i;

function parseIntent(text: string, phones: ConsultPhone[]): Intent {
  const t = norm(text);
  const uses: Use[] = [];
  for (const { use, re } of USE_PATTERNS) if (re.test(t)) uses.push(use);
  const tier = detectTier(t);
  const mentioned = findMentions(text, phones);
  const greeting = GREETING_RE.test(text.trim());
  const topical =
    /телефон|смартфон|phone|galaxy|samsung|самсунг|модел|model|девайс|аппарат|устройств/.test(t);
  const hasSignal = uses.length > 0 || tier !== null || mentioned.length > 0 || topical;
  return { tier, uses, mentioned, greeting, hasSignal };
}

// ── Scoring ───────────────────────────────────────────────────
function scoreFor(p: ConsultPhone, intent: Intent): number {
  let s = (p.year - 2010) * 3; // recency baseline
  const { uses } = intent;
  if (uses.includes("battery")) s += p.batteryMah / 350;
  if (uses.includes("camera")) s += p.cameraMp / 6;
  if (uses.includes("gaming")) s += p.tier === "flagship" ? 30 : p.tier === "mid" ? 10 : 0;
  if (uses.includes("compact")) s += p.displayIn ? Math.max(0, (6.6 - p.displayIn) * 14) : 0;
  if (uses.includes("big")) s += p.displayIn * 6;
  if (uses.includes("foldable")) s += p.foldable ? 30 : 0;
  if (uses.includes("spen")) s += p.spen ? 30 : 0;
  if (uses.includes("water")) s += p.water ? 10 : 0;
  // No specific use → reward the strongest all-rounders (latest flagships).
  if (uses.length === 0) s += p.tier === "flagship" ? 20 : p.tier === "mid" ? 6 : 0;
  return s;
}

function pick(phones: ConsultPhone[], intent: Intent, limit = 3): ConsultPhone[] {
  let pool = intent.tier ? phones.filter((p) => p.tier === intent.tier) : [...phones];
  if (intent.uses.includes("foldable")) pool = pool.filter((p) => p.foldable);
  if (intent.uses.includes("spen")) pool = pool.filter((p) => p.spen);
  if (pool.length === 0) pool = intent.tier ? phones.filter((p) => p.tier === intent.tier) : [...phones];
  if (pool.length === 0) pool = [...phones];
  return pool.sort((a, b) => scoreFor(b, intent) - scoreFor(a, intent)).slice(0, limit);
}

// ── Phrasing ──────────────────────────────────────────────────
const L = {
  link: (p: ConsultPhone) => `/phones/${p.slug}`,
  reasons(p: ConsultPhone, uses: Use[], locale: Locale): string[] {
    const en = locale === "en";
    const out: string[] = [];
    const seen = uses.length ? uses : (["general"] as (Use | "general")[]);
    for (const u of seen) {
      if (u === "camera") out.push(en ? `a strong ${p.cameraMp}MP camera` : `сильная камера на ${p.cameraMp} МП`);
      else if (u === "battery") out.push(en ? `a big ${p.batteryMah} mAh battery` : `ёмкий аккумулятор ${p.batteryMah} мА·ч`);
      else if (u === "gaming") out.push(en ? `flagship-grade performance` : `флагманская производительность`);
      else if (u === "compact") out.push(en ? `a compact ${p.displayIn}″ screen` : `компактный экран ${p.displayIn}″`);
      else if (u === "big") out.push(en ? `a large ${p.displayIn}″ display` : `большой экран ${p.displayIn}″`);
      else if (u === "foldable") out.push(en ? `a folding design` : `складной корпус`);
      else if (u === "spen") out.push(en ? `built-in S Pen support` : `поддержка S Pen`);
      else if (u === "water") out.push(en ? `water resistance` : `влагозащита`);
      else out.push(en ? `it's one of the latest, most capable models` : `это одна из самых свежих и мощных моделей`);
    }
    return out.slice(0, 2);
  },
};

function joinList(items: string[], locale: Locale): string {
  if (items.length <= 1) return items[0] ?? "";
  const last = items[items.length - 1];
  const head = items.slice(0, -1).join(", ");
  return `${head} ${locale === "en" ? "and" : "и"} ${last}`;
}

function recommendReply(intent: Intent, phones: ConsultPhone[], locale: Locale): string {
  const top = pick(phones, intent, 3);
  const best = top[0];
  const en = locale === "en";
  const reasons = joinList(L.reasons(best, intent.uses, locale), locale);
  const alts = top.slice(1, 3).map((p) => `${p.name} (${L.link(p)})`);

  let msg = en
    ? `For that I'd go with the **${best.name}** — ${reasons}. Take a look: ${L.link(best)}.`
    : `Под такое советую **${best.name}** — ${reasons}. Смотри здесь: ${L.link(best)}.`;
  if (alts.length) {
    msg += en ? ` Also worth a look: ${alts.join(", ")}.` : ` Ещё присмотрись: ${alts.join(", ")}.`;
  }
  return `${msg}\nGOTO: ${L.link(best)}`;
}

function compareReply(a: ConsultPhone, b: ConsultPhone, intent: Intent, locale: Locale): string {
  const en = locale === "en";
  // Winner: honour requested use if any, else the higher overall score.
  const winner = scoreFor(a, intent) >= scoreFor(b, intent) ? a : b;
  const loser = winner === a ? b : a;
  const diffs: string[] = [];
  if (winner.year !== loser.year)
    diffs.push(en ? `it's newer (${winner.year})` : `новее (${winner.year})`);
  if (winner.batteryMah > loser.batteryMah)
    diffs.push(en ? `a bigger ${winner.batteryMah} mAh battery` : `батарея больше — ${winner.batteryMah} мА·ч`);
  if (winner.cameraMp > loser.cameraMp)
    diffs.push(en ? `a higher-res ${winner.cameraMp}MP camera` : `камера выше — ${winner.cameraMp} МП`);
  if (winner.spen && !loser.spen) diffs.push(en ? `S Pen support` : `есть S Pen`);
  const why = joinList(diffs.slice(0, 3), locale) || (en ? `it's the stronger all-rounder` : `он сильнее в целом`);

  const head = en
    ? `Between the ${a.name} and ${b.name}, I'd pick the **${winner.name}** — ${why}.`
    : `Из ${a.name} и ${b.name} я бы взял **${winner.name}** — ${why}.`;
  return `${head} ${L.link(winner)}.\nGOTO: ${L.link(winner)}`;
}

function singleReply(p: ConsultPhone, locale: Locale): string {
  const en = locale === "en";
  const extras: string[] = [];
  if (p.spen) extras.push(en ? "S Pen" : "S Pen");
  if (p.foldable) extras.push(en ? "folding screen" : "складной экран");
  if (p.water) extras.push(en ? "water resistance" : "влагозащита");
  const tail = extras.length ? (en ? `, plus ${joinList(extras, locale)}` : `, а также ${joinList(extras, locale)}`) : "";
  const body = en
    ? `The **${p.name}** (${p.releaseDate}) — ${p.displayIn}″ display, ${p.cameraMp}MP camera and ${p.batteryMah} mAh battery${tail}. Full details: ${L.link(p)}.`
    : `**${p.name}** (${p.releaseDate}) — экран ${p.displayIn}″, камера ${p.cameraMp} МП и батарея ${p.batteryMah} мА·ч${tail}. Все характеристики: ${L.link(p)}.`;
  return `${body}\nGOTO: ${L.link(p)}`;
}

const GREET = {
  en: "Hi! Tell me what matters most — budget, camera, battery, screen size, S Pen or a foldable — and I'll pick the best Galaxy for you.",
  ru: "Привет! Скажите, что важнее — бюджет, камера, батарея, размер экрана, S Pen или складной — и я подберу лучший Galaxy.",
};
const OFFTOPIC = {
  en: "I only help with choosing Samsung Galaxy phones 🙂 Tell me what you need — camera, battery, budget, size — and I'll recommend one.",
  ru: "Я помогаю только с выбором смартфонов Samsung Galaxy 🙂 Скажите, что нужно — камера, батарея, бюджет, размер — и я подберу.",
};

/** Produce a consultant reply for the user's latest message. Always answers. */
export function answerLocal(userText: string, locale: Locale, phones: ConsultPhone[]): string {
  const intent = parseIntent(userText || "", phones);

  // Two or more named models → comparison.
  if (intent.mentioned.length >= 2) {
    return compareReply(intent.mentioned[0], intent.mentioned[1], intent, locale);
  }
  // A single named model with no other criteria → tell them about it.
  if (intent.mentioned.length === 1 && intent.uses.length === 0 && intent.tier === null) {
    return singleReply(intent.mentioned[0], locale);
  }
  // Any real signal (criteria and/or a model + criteria) → recommend.
  if (intent.hasSignal) {
    return recommendReply(intent, phones, locale);
  }
  // Pure greeting.
  if (intent.greeting) return GREET[locale];
  // Nothing to go on.
  return OFFTOPIC[locale];
}
