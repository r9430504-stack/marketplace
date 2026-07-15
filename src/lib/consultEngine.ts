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
type Use =
  | "camera"
  | "selfie"
  | "battery"
  | "charging"
  | "gaming"
  | "compact"
  | "big"
  | "storage"
  | "fiveg"
  | "foldable"
  | "spen"
  | "water";

type Intent = {
  tier: Tier | null;
  uses: Use[];
  mentioned: ConsultPhone[];
  newest: boolean;
  cheapest: boolean;
  greeting: boolean;
  thanks: boolean;
  bye: boolean;
  affirm: boolean;
  hasSignal: boolean;
};

// ── Text helpers ──────────────────────────────────────────────
function norm(s: string): string {
  return ` ${s.toLowerCase().replace(/[^\p{L}\p{N}$₽.\s-]/gu, " ").replace(/\s+/g, " ").trim()} `;
}

// A rough Cyrillic spelling of an English model alias, so "с24 ультра",
// "нот 20", "фолд 6", "а52" all match too.
function toCyrillic(a: string): string {
  return a
    .replace(/\bultra\b/g, "ультра")
    .replace(/\bplus\b/g, "плюс")
    .replace(/\bnote\b/g, "нот")
    .replace(/\bfold\b/g, "фолд")
    .replace(/\bflip\b/g, "флип")
    .replace(/\bedge\b/g, "эйдж")
    .replace(/\bactive\b/g, "актив")
    .replace(/\bfe\b/g, "фе")
    .replace(/\bs(\d)/g, "с$1")
    .replace(/\ba(\d)/g, "а$1")
    .replace(/\bm(\d)/g, "м$1")
    .replace(/\bz\b/g, "з");
}

// Aliases people actually type for a model: "s24 ultra", "note 20", "fold 6".
function aliasesFor(p: ConsultPhone): string[] {
  const out = new Set<string>();
  const name = p.name.toLowerCase().replace(/^galaxy\s+/, ""); // "s24 ultra"
  out.add(name);
  out.add(p.slug.replace(/^galaxy-/, "").replace(/-/g, " "));
  const noZ = name.replace(/^z\s+/, ""); // "z fold 6" → "fold 6"
  if (noZ !== name) out.add(noZ);
  // Cyrillic variants
  for (const a of [...out]) {
    const c = toCyrillic(a);
    if (c !== a) out.add(c);
  }
  out.add(toCyrillic(name).replace(/\bнот\b/, "ноут")); // "ноут 20"
  return [...out].filter((a) => a.length >= 2);
}

/** Detect which catalog models are named in the text, longest-alias-first so
 * "s24 ultra" wins over "s24" and each match is consumed only once. */
function findMentions(text: string, phones: ConsultPhone[]): ConsultPhone[] {
  const entries: { p: ConsultPhone; a: string }[] = [];
  for (const p of phones) for (const a of aliasesFor(p)) entries.push({ p, a: ` ${a} ` });
  entries.sort((x, y) => y.a.length - x.a.length);

  let masked = norm(text);
  const found: { p: ConsultPhone; at: number }[] = [];
  for (const { p, a } of entries) {
    if (found.some((f) => f.p.slug === p.slug)) continue;
    const idx = masked.indexOf(a);
    if (idx !== -1) {
      found.push({ p, at: idx });
      masked = masked.slice(0, idx) + " ".repeat(a.length) + masked.slice(idx + a.length);
    }
  }
  return found.sort((x, y) => x.at - y.at).map((f) => f.p);
}

const USE_PATTERNS: { use: Use; re: RegExp }[] = [
  {
    use: "selfie",
    re: /селфи|автопортрет|фронтал|передн(ей|яя) камер|себя снима|для себя|блог|влог|стрим|созвон|видеозвон|selfie|front[- ]?cam|vlog|video call|face/,
  },
  {
    use: "camera",
    re: /камер|фотк|фото|фотогр|снима|съем|съём|снимк|кадр|боке|зум|макро|ночн(ой|ая|ые) съ|инстаграм|инст[аы]|тикток|content|photo|camera|\bpic\b|picture|shoot|\bshot\b|portrait|bokeh|zoom|macro|instagram|tiktok|photograph/,
  },
  {
    use: "battery",
    re: /батар|аккум|заряд(?!к)|автоном|[её]мкост|держит|хватае|надолго|целый день|весь день|на весь день|долго работ|не сад|не разряж| мач |battery|endur|long[- ]?last|all[- ]?day|screen[- ]?time|\bmah\b/,
  },
  {
    use: "charging",
    re: /быстр(ая|ой|о)? заряд|зарядк|подзаряд|быстро заряж|за час|ватт| вт |fast charg|quick charg|\bwatt\b|\bwt\b|charging speed/,
  },
  {
    use: "gaming",
    re: /игр|поигр|гейм|геймер|пабг|pubg|genshin|геншин|\bcod\b|standoff|стандофф|фортнайт|fortnite|роблокс|roblox|фпс|\bfps\b|не лаг|без лаг|тормоз|мощн|производит|быстр|шустр|\bgame|gaming|performanc|powerful|\bfast\b|smooth|snapdragon|процессор/,
  },
  {
    use: "compact",
    re: /компакт|маленьк|небольш|миниат|одной рук|в карман|карманн|л[её]гк(ий|ая|ое|еньк)|small|compact|one[- ]?hand|pocket|\bmini\b|\btiny\b|lightweight/,
  },
  {
    use: "big",
    re: /больш(ой|ая|им)?\s*(экран|дисплей|телефон|диагонал)|огромн|лопат|фаблет|фильм|кино|сериал|ютуб|youtube|нетфликс|netflix|видео|смотреть|читать|чтен|big screen|large (screen|display)|huge|phablet|movie|watch (video|movie)|reading|media/,
  },
  {
    use: "storage",
    re: /памят|встроен|накопит|гигабайт| гб |терабайт|много места|для файлов|storage|memory|\bgb\b|\btb\b|space/,
  },
  {
    use: "fiveg",
    re: /5g|5 g|5[- ]?джи|пят(ое|ого) поколени|хорош(ий|им|его) интернет|быстр(ый|ым|ого) интернет|мобильн(ый|ым) интернет|хорошая связь|хорошей связ|ловит сет|good internet|fast internet|connectivity|\bnetwork\b/,
  },
  {
    use: "foldable",
    re: /склад|раскладушк|раскладн|гибк|книжк|раскрыв|перегиб|трансформ|\bfold|\bflip|foldable|clamshell|book[- ]?style/,
  },
  {
    use: "spen",
    re: /стилус| перо |рисова|рису[юеё]|рисуй|рисунок|рисован|порисова|нарисова|черч|черт[иёе]|набросок|скетч|sketch|эскиз|замет|конспект|записыва|подпис|s[- ]?pen|\bspen\b|stylus|\bpen\b|draw|paint|art\b|artist|handwrit|scribble|doodle|note[- ]?tak/,
  },
  {
    use: "water",
    re: /влаг|водонепрониц|водозащ|водостойк|не боится вод|не боюсь вод|дожд|бассейн|под водой|ip6[78]|water|waterproof|water[- ]?resist|\bdust\b|splash|\brain\b|\bpool\b/,
  },
];

function detectTier(t: string): Tier | null {
  const rub =
    t.match(/(\d{1,3}(?:[ .]\d{3})+|\d{4,6})\s*(?:руб|₽|р(?=\s)|rub)/) ||
    t.match(/(\d{1,3})\s*(?:к|тыс)(?=\s)/);
  const usd = t.match(/\$\s*(\d{2,4})/) || t.match(/(\d{2,4})\s*(?:\$|usd|dollar|доллар)/);
  let priceUsd = 0;
  if (usd) priceUsd = parseInt(usd[1], 10);
  else if (rub) {
    let n = parseInt(rub[1].replace(/[ .]/g, ""), 10);
    if (/к|тыс/.test(rub[0]) && n < 1000) n *= 1000;
    priceUsd = n / 95;
  }
  if (priceUsd > 0) {
    if (priceUsd < 320) return "budget";
    if (priceUsd < 720) return "mid";
    return "flagship";
  }
  if (/флагман|топ(?:\b|овы)|премиум|лучш|мощнейш|high[- ]?end|flagship|premium|\bbest\b/.test(t)) return "flagship";
  if (/бюджет|деш[её ]|дешо|дишо|дишев|недорог|подешевл|подешевш|эконом|копееч|за копейки|не дорог|\bcheap|budget|affordable|inexpensive|low[- ]?cost/.test(t)) return "budget";
  if (/средн(?:ий|яя|его|ей)|\bmid\b|mid[- ]?range|middle/.test(t)) return "mid";
  return null;
}

// These run on a normalized (lowercased, punctuation-stripped, trimmed) copy
// of the last message — no ASCII \b, which does not work with Cyrillic.
const GREETING_RE = /^(привет|здравствуй|здаров|хай|hello|hi|hey|yo|доброе|добрый|good (morning|day|evening))/;
const THANKS_RE = /спасиб|благодар|пасиб|спс|thank|thx/;
const BYE_RE = /^(пока|до свидан|прощай|бывай|bye|goodbye|see ya|see you)/;
const AFFIRM_RE = /^(да|ага|угу|окей|ок|хорошо|ладно|давай|конечно|yes|yeah|yep|ok|sure|alright)$/;

type Extract = {
  tier: Tier | null;
  uses: Use[];
  mentioned: ConsultPhone[];
  newest: boolean;
  cheapest: boolean;
};

function extract(text: string, phones: ConsultPhone[]): Extract {
  const t = norm(text);
  const uses: Use[] = [];
  for (const { use, re } of USE_PATTERNS) if (re.test(t)) uses.push(use);
  return {
    tier: detectTier(t),
    uses,
    mentioned: findMentions(text, phones),
    newest: /новее|нов(ый|ая|ое|еньк|инк)|свеж|последн|актуальн|latest|newest|recent|\bnew\b/.test(t),
    cheapest: /дешевле|подешевл|деш[её ]|дешо|дишо|бюджетн|эконом|копееч|cheaper|cheapest|affordable/.test(t),
  };
}

// Build the intent from recent messages. The LAST message takes priority: if
// it carries its own criteria (a tier, a use-case or a named model), it is a
// fresh request that OVERRIDES earlier context — so switching from "flagship"
// to "cheap" actually switches. Only a bare refinement ("а подешевле?", "что-то
// новее") inherits the previous criteria and just tweaks them.
function parseIntent(recent: string[], phones: ConsultPhone[]): Intent {
  const last = recent[recent.length - 1] ?? "";
  const prevText = recent.slice(0, -1).join(" \n ");
  const lastX = extract(last, phones);
  const prevX = extract(prevText, phones);

  // A new use-case or a named model = a fresh request that resets the criteria.
  // A price/tier change alone ("а подешевле") is a refinement: keep the prior
  // use-cases, just override the tier.
  const fresh = lastX.uses.length > 0 || lastX.mentioned.length > 0;

  const tier = lastX.tier ?? prevX.tier;
  const uses = fresh ? lastX.uses : prevX.uses;
  const mentioned = lastX.mentioned.length ? lastX.mentioned : fresh ? [] : prevX.mentioned;
  const newest = lastX.newest || (!fresh && prevX.newest);
  const cheapest = lastX.cheapest || (!fresh && prevX.cheapest);

  const nl = norm(last).trim();
  const t = norm([prevText, last].join(" "));
  const topical = /телефон|смартфон|phone|galaxy|samsung|самсунг|модел|model|девайс|аппарат|устройств/.test(t);
  const hasSignal = uses.length > 0 || tier !== null || mentioned.length > 0 || newest || cheapest || topical;
  return {
    tier,
    uses,
    mentioned,
    newest,
    cheapest,
    greeting: GREETING_RE.test(nl),
    thanks: THANKS_RE.test(nl),
    bye: BYE_RE.test(nl),
    affirm: AFFIRM_RE.test(nl),
    hasSignal,
  };
}

// ── Scoring ───────────────────────────────────────────────────
function scoreFor(p: ConsultPhone, intent: Intent): number {
  let s = (p.year - 2010) * 3; // recency baseline
  const { uses } = intent;
  if (uses.includes("camera")) s += p.cameraMp / 6;
  if (uses.includes("selfie")) s += p.frontMp / 2.5;
  if (uses.includes("battery")) s += p.batteryMah / 350;
  if (uses.includes("charging")) s += p.chargingW / 2.5;
  if (uses.includes("gaming")) s += p.tier === "flagship" ? 30 : p.tier === "mid" ? 10 : 0;
  if (uses.includes("compact")) {
    s += p.displayIn ? Math.max(0, (6.6 - p.displayIn) * 14) : 0;
    s += p.tier === "flagship" ? 16 : p.tier === "mid" ? 7 : 0;
  }
  if (uses.includes("big")) {
    s += p.displayIn * 6;
    s += p.tier === "flagship" ? 12 : p.tier === "mid" ? 5 : 0;
  }
  if (uses.includes("storage")) s += p.storageGb / 64;
  if (uses.includes("fiveg")) s += p.fiveG ? 14 : -20;
  if (uses.includes("foldable")) s += p.foldable ? 30 : 0;
  if (uses.includes("spen")) s += p.spen ? 30 : 0;
  if (uses.includes("water")) s += p.water ? 10 : 0;
  if (uses.length === 0) s += p.tier === "flagship" ? 20 : p.tier === "mid" ? 6 : 0;
  // Mild premium proxy: among otherwise-tied models the pricier (top) variant
  // edges ahead, so "best phone" lands on the Ultra rather than the base model.
  // Foldables are excluded so a general "best phone" isn't a niche foldable.
  s += p.foldable ? 0 : p.priceUsd / 1000;
  // Refinement modifiers
  if (intent.newest) s += (p.year - 2010) * 10;
  if (intent.cheapest) s += p.priceUsd > 0 ? (1200 - p.priceUsd) / 12 : 0;
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
const link = (p: ConsultPhone) => `/phones/${p.slug}`;

function descriptor(p: ConsultPhone): string {
  const price = p.priceUsd > 0 ? `, $${p.priceUsd}` : "";
  return `${p.name} (${p.year}${price})`;
}

function reasonsFor(p: ConsultPhone, uses: Use[], locale: Locale): string[] {
  const en = locale === "en";
  const out: string[] = [];
  const list = uses.length ? uses : (["general"] as (Use | "general")[]);
  for (const u of list) {
    if (u === "camera") out.push(en ? `a strong ${p.cameraMp}MP camera` : `сильная камера на ${p.cameraMp} МП`);
    else if (u === "selfie") out.push(en ? `a sharp ${p.frontMp}MP selfie camera` : `чёткая фронталка ${p.frontMp} МП`);
    else if (u === "battery") out.push(en ? `a big ${p.batteryMah} mAh battery` : `ёмкий аккумулятор ${p.batteryMah} мА·ч`);
    else if (u === "charging") out.push(en ? `${p.chargingW}W fast charging` : `быстрая зарядка ${p.chargingW} Вт`);
    else if (u === "gaming") out.push(en ? `flagship-grade performance` : `флагманская производительность`);
    else if (u === "compact") out.push(en ? `a compact ${p.displayIn}″ screen` : `компактный экран ${p.displayIn}″`);
    else if (u === "big") out.push(en ? `a large ${p.displayIn}″ display` : `большой экран ${p.displayIn}″`);
    else if (u === "storage") out.push(en ? `up to ${p.storageGb >= 1024 ? p.storageGb / 1024 + "TB" : p.storageGb + "GB"} storage` : `память до ${p.storageGb >= 1024 ? p.storageGb / 1024 + " ТБ" : p.storageGb + " ГБ"}`);
    else if (u === "fiveg") out.push(en ? `5G support` : `поддержка 5G`);
    else if (u === "foldable") out.push(en ? `a folding design` : `складной корпус`);
    else if (u === "spen") out.push(en ? `an S Pen that's great for drawing and notes` : `S Pen — удобно рисовать и делать заметки`);
    else if (u === "water") out.push(en ? `water resistance` : `влагозащита`);
    else out.push(en ? `modern, capable hardware` : `свежая и мощная начинка`);
  }
  return out.slice(0, 2);
}

function joinList(items: string[], locale: Locale): string {
  if (items.length <= 1) return items[0] ?? "";
  const last = items[items.length - 1];
  return `${items.slice(0, -1).join(", ")} ${locale === "en" ? "and" : "и"} ${last}`;
}

function tierWord(p: ConsultPhone, locale: Locale): string {
  const en = locale === "en";
  if (p.tier === "flagship") return en ? "a top-tier flagship" : "флагман высшего уровня";
  if (p.tier === "mid") return en ? "a solid mid-ranger" : "крепкий представитель среднего класса";
  return en ? "a budget-friendly pick" : "доступная модель без переплат";
}

// A short spec highlight line for the chosen phone.
function specLine(p: ConsultPhone, locale: Locale): string {
  const en = locale === "en";
  return en
    ? `a ${p.displayIn}″ screen, a ${p.cameraMp}MP main camera and a ${p.batteryMah} mAh battery`
    : `экран ${p.displayIn}″, основная камера ${p.cameraMp} МП и батарея ${p.batteryMah} мА·ч`;
}

// Who this phone suits — one warm sentence based on its stand-out traits.
function suitsSentence(p: ConsultPhone, locale: Locale): string {
  const en = locale === "en";
  if (p.foldable) return en ? "It's for people who want a big-screen experience that still folds into a pocket." : "Он для тех, кто хочет большой экран, который складывается и помещается в карман.";
  if (p.spen) return en ? "With the built-in S Pen it's a great pick for drawing, notes and getting things done." : "Со встроенным S Pen это отличный выбор для рисования, заметок и работы.";
  if (p.tier === "flagship") return en ? "It's a powerful everyday phone that will stay fast for years to come." : "Это мощный аппарат на каждый день, которого хватит на годы вперёд.";
  if (p.tier === "mid") return en ? "It strikes a nice balance between price and features for everyday use." : "Он хорошо балансирует цену и возможности для повседневных задач.";
  return en ? "It covers the essentials well without stretching your budget." : "Он закрывает всё нужное и при этом не бьёт по кошельку.";
}

function altsSentence(alts: ConsultPhone[], locale: Locale): string {
  if (alts.length === 0) return "";
  const en = locale === "en";
  const list = joinList(alts.map((p) => `${p.name} (${link(p)})`), locale);
  return en
    ? ` If you'd like to compare, ${alts.length > 1 ? "two" : "another"} option${alts.length > 1 ? "s" : ""} worth a look ${alts.length > 1 ? "are" : "is"} ${list}.`
    : ` Если хочется сравнить, присмотритесь ещё к ${list}.`;
}

function recommendReply(intent: Intent, phones: ConsultPhone[], locale: Locale): string {
  const top = pick(phones, intent, 3);
  const best = top[0];
  const en = locale === "en";
  const reasons = joinList(reasonsFor(best, intent.uses, locale), locale);
  const alts = top.slice(1, 3);
  const msg = en
    ? `Good question! For that I'd go with the **${descriptor(best)}**. You'll get ${reasons} — exactly what you're after. Overall it's ${tierWord(best, locale)} with ${specLine(best, locale)}. ${suitsSentence(best, locale)}${altsSentence(alts, locale)} You can open its full page here: ${link(best)}.`
    : `Хороший вопрос! Под такое я бы посоветовал **${descriptor(best)}**. Вас порадует ${reasons} — как раз то, что вам нужно. В целом это ${tierWord(best, locale)}: ${specLine(best, locale)}. ${suitsSentence(best, locale)}${altsSentence(alts, locale)} Открыть страницу с полными характеристиками можно здесь: ${link(best)}.`;
  return `${msg}\nGOTO: ${link(best)}`;
}

function endorseReply(p: ConsultPhone, intent: Intent, locale: Locale): string {
  const en = locale === "en";
  const reasons = joinList(reasonsFor(p, intent.uses, locale), locale);
  const msg = en
    ? `Yes, great choice — the **${descriptor(p)}** is a great fit for that. You'll get ${reasons}, which is just what you mentioned. It's ${tierWord(p, locale)} with ${specLine(p, locale)}. ${suitsSentence(p, locale)} Here's its full page: ${link(p)}.`
    : `Да, отличный выбор — **${descriptor(p)}** под это подходит прекрасно. Вы получите ${reasons} — ровно то, о чём вы сказали. Это ${tierWord(p, locale)}: ${specLine(p, locale)}. ${suitsSentence(p, locale)} Вот его полная страница: ${link(p)}.`;
  return `${msg}\nGOTO: ${link(p)}`;
}

function passesFilters(p: ConsultPhone, intent: Intent): boolean {
  if (intent.uses.includes("foldable") && !p.foldable) return false;
  if (intent.uses.includes("spen") && !p.spen) return false;
  return true;
}

function compareReply(a: ConsultPhone, b: ConsultPhone, intent: Intent, locale: Locale): string {
  const en = locale === "en";
  const winner = scoreFor(a, intent) >= scoreFor(b, intent) ? a : b;
  const loser = winner === a ? b : a;
  const diffs: string[] = [];
  if (winner.year !== loser.year) diffs.push(en ? `it's newer (${winner.year})` : `новее (${winner.year})`);
  if (winner.batteryMah > loser.batteryMah) diffs.push(en ? `a bigger ${winner.batteryMah} mAh battery` : `батарея больше — ${winner.batteryMah} мА·ч`);
  if (winner.cameraMp > loser.cameraMp) diffs.push(en ? `a higher-res ${winner.cameraMp}MP camera` : `камера выше — ${winner.cameraMp} МП`);
  if (winner.chargingW > loser.chargingW) diffs.push(en ? `faster ${winner.chargingW}W charging` : `зарядка быстрее — ${winner.chargingW} Вт`);
  if (winner.spen && !loser.spen) diffs.push(en ? `S Pen support` : `есть S Pen`);
  const why = joinList(diffs.slice(0, 3), locale) || (en ? `it's the stronger all-rounder` : `он сильнее в целом`);
  const msg = en
    ? `Both are strong phones, but I'd pick the **${winner.name}** — ${why}. The ${loser.name} is still a good phone, yet the ${winner.name} comes out ahead for most people. On paper the winner gives you ${specLine(winner, locale)}. Here's its page so you can dive into the details: ${link(winner)}.`
    : `Обе модели сильные, но я бы взял **${winner.name}** — ${why}. ${loser.name} тоже хорош, но ${winner.name} в большинстве сценариев ощутимо выигрывает. По характеристикам у него ${specLine(winner, locale)}. Вот его страница, чтобы посмотреть детали: ${link(winner)}.`;
  return `${msg}\nGOTO: ${link(winner)}`;
}

function singleReply(p: ConsultPhone, locale: Locale): string {
  const en = locale === "en";
  const extras: string[] = [];
  if (p.spen) extras.push("S Pen");
  if (p.foldable) extras.push(en ? "a folding screen" : "складной экран");
  if (p.water) extras.push(en ? "water resistance" : "влагозащита");
  const tail = extras.length ? (en ? ` It also has ${joinList(extras, locale)}.` : ` Также есть ${joinList(extras, locale)}.`) : "";
  const msg = en
    ? `The **${descriptor(p)}** is ${tierWord(p, locale)} from ${p.releaseDate}. It has ${specLine(p, locale)}.${tail} ${suitsSentence(p, locale)} You can read its full specs and story here: ${link(p)}.`
    : `**${descriptor(p)}** — это ${tierWord(p, locale)}, вышел в ${p.year} году. У него ${specLine(p, locale)}.${tail} ${suitsSentence(p, locale)} Полные характеристики и историю модели можно посмотреть здесь: ${link(p)}.`;
  return `${msg}\nGOTO: ${link(p)}`;
}

const SAY = {
  greet: {
    en: "Hi! Tell me what matters most — budget, camera, battery, screen size, gaming, S Pen or a foldable — and I'll pick the best Galaxy for you.",
    ru: "Привет! Скажите, что важнее — бюджет, камера, батарея, размер экрана, игры, S Pen или складной — и я подберу лучший Galaxy.",
  },
  thanks: {
    en: "Happy to help! 🙂 Ask me anytime — I can also compare two models or find one for a specific budget.",
    ru: "Рад помочь! 🙂 Обращайтесь — ещё могу сравнить две модели или подобрать под конкретный бюджет.",
  },
  bye: {
    en: "Good luck with your choice! 👋 Come back anytime.",
    ru: "Удачи с выбором! 👋 Заходите ещё.",
  },
  affirm: {
    en: "Great! What matters most to you — camera, battery, gaming, screen size or budget?",
    ru: "Отлично! Что для вас важнее всего — камера, батарея, игры, размер экрана или бюджет?",
  },
  offtopic: {
    en: "I only help with choosing Samsung Galaxy phones 🙂 Tell me what you need — camera, battery, budget, size — and I'll recommend one.",
    ru: "Я помогаю только с выбором смартфонов Samsung Galaxy 🙂 Скажите, что нужно — камера, батарея, бюджет, размер — и я подберу.",
  },
};

/** Produce a consultant reply. `userTexts` are the recent user messages
 * (oldest→newest); the last one drives greeting/thanks, all of them together
 * drive the criteria so short follow-ups like "а подешевле?" still work. */
export function answerLocal(userTexts: string[], locale: Locale, phones: ConsultPhone[]): string {
  const recent = userTexts.slice(-3);
  const intent = parseIntent(recent, phones);

  if (intent.mentioned.length >= 2) {
    return compareReply(intent.mentioned[0], intent.mentioned[1], intent, locale);
  }
  if (intent.mentioned.length === 1) {
    const p = intent.mentioned[0];
    const otherSignal = intent.uses.length > 0 || intent.tier !== null || intent.newest || intent.cheapest;
    if (otherSignal) {
      if (passesFilters(p, intent)) return endorseReply(p, intent, locale);
      return recommendReply(intent, phones, locale);
    }
    return singleReply(p, locale);
  }
  if (intent.uses.length > 0 || intent.tier !== null || intent.newest || intent.cheapest) {
    return recommendReply(intent, phones, locale);
  }
  if (intent.thanks) return SAY.thanks[locale];
  if (intent.bye) return SAY.bye[locale];
  if (intent.greeting) return SAY.greet[locale];
  if (intent.affirm) return SAY.affirm[locale];
  if (intent.hasSignal) return recommendReply(intent, phones, locale);
  return SAY.offtopic[locale];
}
