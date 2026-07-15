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
  | "water"
  | "longevity"
  | "durable"
  | "display";

type Intent = {
  tier: Tier | null;
  uses: Use[];
  mentioned: ConsultPhone[];
  newest: boolean;
  cheapest: boolean;
  budgetUsd: number;
  power: boolean;
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
    re: /селфи|автопортрет|фронтал|передн(ей|яя|юю) камер|фронталк|себя снима|для себя|снять себя|блог|влог|стрим|созвон|видео[- ]?звон|видеозвон|конференц|для созвон|selfie|front[- ]?cam|vlog|video[- ]?call|face[- ]?cam/,
  },
  {
    use: "camera",
    re: /камер|фотк|фотик|фото|фотогр|фотает|фоткать|сфотк|поснима|снима|съем|съём|снимк|кадр|бок[еэ]|зум|макро|телеобъектив|широкоуг|ультрашир|стабилизац|объектив|оптик|мегапиксел|мпикс| мп камер|ночн(ой|ая|ые|ую) съ|ночн(ая|ой) фото|инстаграм|инст[аы]|тикток|content|photo|camera|\bcam\b|\bpic\b|picture|shoot|\bshot\b|portrait|bokeh|zoom|macro|telephoto|ultrawide|megapixel|\blens\b|instagram|tiktok|photograph|snap/,
  },
  {
    use: "battery",
    re: /батар|аккум|заряд(?!к)|автоном|[её]мкост|держит|хватае|надолго|целый день|весь день|на весь день|до вечера|долго работ|долгоигра|не сад|не разряж|живуч| мач | мах |battery|endur|long[- ]?last|all[- ]?day|screen[- ]?time|\bmah\b/,
  },
  {
    use: "charging",
    re: /быстр(ая|ой|о|ую)? заряд|зарядк|подзаряд|быстро заряж|за (час|30|полчаса)|ватт| вт |беспроводн(ая|ой)? заряд|турбозаряд|суперзаряд|fast charg|quick charg|wireless charg|\bwatt\b|\bwt\b|charging speed/,
  },
  {
    use: "gaming",
    re: /игр|поигр|гейм|геймер|пабг|pubg|genshin|геншин|\bcod\b|standoff|стандофф|фортнайт|fortnite|роблокс|roblox|фпс|\bfps\b|не лаг|без лаг|тормоз|не тупит|тянет игр|потянет игр|мощн|производит|шустр|летает|game|gaming|performanc|powerful|smooth|snapdragon|процессор|\bчип\b|\bgpu\b|фреймрейт|framerate/,
  },
  {
    use: "compact",
    re: /компакт|маленьк|небольш|миниат|одной рук|в карман|карманн|л[её]гк(ий|ая|ое|еньк|о)|малыш|крошечн|не лопат|small|compact|one[- ]?hand|pocket|\bmini\b|\btiny\b|lightweight|\bhandy\b/,
  },
  {
    use: "big",
    re: /больш(ой|ая|им|ую)?\s*(экран|дисплей|телефон|диагонал)|огромн|лопат|фаблет|фильм|кино|сериал|ютуб|youtube|нетфликс|netflix|видео|смотреть|читать|чтен|крупн(ый)? экран|big screen|large (screen|display)|huge|phablet|movie|watch (video|movie)|reading|media/,
  },
  {
    use: "storage",
    re: /памят|встроен(ная|ой)? памя|накопит|гигабайт| гб |терабайт| тб |много места|для файлов|для фото и видео|хранилищ|объ[её]м памяти|storage|memory|\bgb\b|\btb\b|\bspace\b/,
  },
  {
    use: "fiveg",
    re: /5g|5 g|5[- ]?джи|пят(ое|ого) поколени|хорош(ий|им|его|ая|ей) (интернет|связ|сет|при[её]м|сигнал)|быстр(ый|ым|ого|ая|ой) (интернет|связ|сет)|мобильн(ый|ым) интернет|стабильн(ый|ая|ой) (интернет|связ)|хорошо ловит|ловит сет|хороший при[её]м|качеств(о|енн) связ|сотов|good (internet|signal|reception|network)|fast internet|connectivity|reception|\bnetwork\b|\bsignal\b/,
  },
  {
    use: "longevity",
    re: /долгосроч|надолго|на (много|долгие|несколько|пару) лет|жизненн(ый|ого) цикл|срок службы|прослужит|обновлен|поддержк|актуальн|не устаре|запас на будущ|на будущее|годы вперед|годы вперёд|долго прослуж|долговечн|не выкид|future[- ]?proof|longevity|long[- ]?term|software (updates?|support)|years of updates|last(s)? (for )?years|lifespan|lifecycle/,
  },
  {
    use: "durable",
    re: /прочн|надежн|надёжн|крепк|крепыш|не сломает|не разоб|не боится удар|выдержит|ударопрочн|защищ|бронирован|титан|горилл|неубива|выносл|ремонтопригодн|антивандальн|милитари|durable|rugged|sturdy|tough|shockproof|drop[- ]?proof|gorilla|titanium|military|build quality|solid build/,
  },
  {
    use: "display",
    re: /плавн(ый|ая|ое|о) (экран|дисплей|скролл|прокрут|интерфейс)|герц|\bгц\b|частот(а|ой|у) обновлен|(90|120|144|165)\s*(гц|hz|герц)|амолед|amoled|\boled\b|яркий экран|качеств(о|енн) экран|ч[её]тк(ий|ая) (экран|картинк)|сочный экран|красивый экран|refresh rate|smooth (screen|display|scroll)|bright (screen|display)|display quality|\bnits\b/,
  },
  {
    use: "foldable",
    re: /склад|раскладушк|раскладн|гибк|книжк|раскрыв|перегиб|трансформ|гнущ|сгиба|\bфолд|\bфлип|\bfold|\bflip|foldable|clamshell|book[- ]?style/,
  },
  {
    use: "spen",
    re: /стилус| перо |рисова|рису[юеё]|рисуй|рисунок|рисован|порисова|нарисова|черч|черт[иёе]|набросок|скетч|sketch|эскиз|замет|конспект|записыва|от руки|рукопис|подпис|s[- ]?pen|\bspen\b|stylus|\bpen\b|draw|paint|\bart\b|artist|handwrit|scribble|doodle|note[- ]?tak/,
  },
  {
    use: "water",
    re: /влаг|водонепрониц|водозащ|водостойк|не боится вод|не боюсь вод|не утоп|дожд|бассейн|под водой|купа|брызг|пылевлаг|ip6[78]|water|waterproof|water[- ]?resist|\bdust\b|splash|\brain\b|\bpool\b/,
  },
];

/** Parse a stated budget into USD (0 if none). Handles ₽/руб/к/тыс, $/usd and
 * budgets stated with a preposition and no currency ("до 60000"). */
function parseBudgetUsd(t: string): number {
  const rub =
    t.match(/(\d{1,3}(?:[ .]\d{3})+|\d{4,6})\s*(?:руб|₽|р(?=\s)|rub)/) ||
    t.match(/(?:до|за|около|порядка|бюджет\w*|в районе|максимум|уложит\w*|не (?:больше|дороже))\s*~?\s*(\d{1,3}(?:[ .]\d{3})+|\d{4,6})/) ||
    t.match(/(\d{1,3})\s*(?:к|тыс)(?=\s|$)/);
  const usd = t.match(/\$\s*(\d{2,4})/) || t.match(/(\d{2,4})\s*(?:\$|usd|dollar|доллар)/);
  if (usd) return parseInt(usd[1], 10);
  if (rub) {
    let n = parseInt(rub[1].replace(/[ .]/g, ""), 10);
    if (/к|тыс/.test(rub[0]) && n < 1000) n *= 1000;
    return Math.round(n / 95); // ₽→$ for matching against catalog USD prices
  }
  return 0;
}

function detectTier(t: string): Tier | null {
  const priceUsd = parseBudgetUsd(t);
  if (priceUsd > 0) {
    if (priceUsd < 320) return "budget";
    if (priceUsd < 720) return "mid";
    return "flagship";
  }
  if (/флагман|флагманск|топ(?:\b|ов)|самый мощн|премиум|премиальн|лучш|мощнейш|топчик|топовое желез|high[- ]?end|flagship|premium|\bbest\b|top[- ]?tier/.test(t)) return "flagship";
  if (/бюджет|деш[её ]|дешо|дишо|дишев|дешманск|недорог|подешевл|подешевш|эконом|копееч|за копейки|не дорог|бомж|самый дешёв|самый дешев|\bcheap|budget|affordable|inexpensive|low[- ]?cost/.test(t)) return "budget";
  if (/средн(?:ий|яя|его|ей|юю)|среднячок|золотая середин|\bmid\b|mid[- ]?range|middle/.test(t)) return "mid";
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
  budgetUsd: number;
  power: boolean;
};

// Personas / buying contexts: who or what the phone is for → soft preferences.
// These only add "soft" use-cases (never spen/foldable, which hard-filter) plus
// an optional tier, so a persona shapes the pick without over-narrowing it.
const CONTEXTS: { re: RegExp; add: Use[]; tier?: Tier; newest?: boolean; cheapest?: boolean }[] = [
  { re: /для работ|рабоч(ий|ая) (телефон|модел)|для бизнес|бизнес[- ]?телефон|офис|for work|for business|work phone/, add: ["longevity", "battery", "display"], tier: "flagship" },
  { re: /для (учеб|студент)|студенч|школьник|for (a )?student|for school/, add: ["battery"], tier: "mid", cheapest: true },
  { re: /для (ребен|реб[её]н|дет)|детск|ребёнку|ребенку|for (a )?(kid|child|children)/, add: ["durable", "battery"], tier: "budget" },
  { re: /для (мам|бабушк|дедушк|родител|пожил|бати|отц)|для пожилых|простой в использован|для родителей|for (my )?(mom|mum|parent|grandma|grandpa|elderly)/, add: ["big", "display"], tier: "mid" },
  { re: /фотограф|фото[- ]?блог|для съ[её]мк|для фото|photograph|for photos|content creat/, add: ["camera", "selfie"] },
  { re: /путешеств|в поездк|для поездок|турист|travel|for trips/, add: ["battery", "durable", "camera"] },
  { re: /крут(ой|ая|ое|ый)|понт|чтобы завидовал|статусн|престиж|флексить|\bflex\b|show off|status symbol|понтов|вау[- ]?эффект|wow[- ]?effect/, add: [], tier: "flagship" },
  { re: /цена.?качеств|цену.?качеств|соотношени[ею] цен|выгодн|оправдыва|разумн(ая|ой) цен|value for money|bang for (the )?buck|worth the money/, add: [], tier: "mid", cheapest: true },
];

function extract(text: string, phones: ConsultPhone[]): Extract {
  const t = norm(text);
  const uses: Use[] = [];
  for (const { use, re } of USE_PATTERNS) if (re.test(t)) uses.push(use);

  // Wants power / a flagship-class device (regardless of age).
  const power =
    /мощн|мощь|флагман|топ(ов|\b)|топчик|производит|шустр|летает|не тормоз|не тупит|зверь|монстр|ракета|быстр(ый|ая|ое)?\b|премиум|премиальн|premium|flagship|powerful|performance|beast|monster|high[- ]?end|fast phone/.test(
      t
    ) || uses.includes("gaming");

  let tier = detectTier(t);
  let newest =
    /новее|нов(ый|ая|ое|еньк|инк)|свеж(ий|ак|ее)?|последн|актуальн|только что вышел|недавно вышел|latest|newest|recent|\bnew\b/.test(
      t
    );
  const cheapestBase =
    /дешевле|подешевл|деш[её ]|дешо|дишо|дешманск|бюджетн|эконом|копееч|подешевше|самый дешёв|самый дешев|cheaper|cheapest|affordable/.test(
      t
    );
  let cheapest = cheapestBase;

  // Persona / context expansion.
  for (const c of CONTEXTS) {
    if (!c.re.test(t)) continue;
    for (const u of c.add) if (!uses.includes(u)) uses.push(u);
    if (c.tier && !tier) tier = c.tier;
    if (c.newest) newest = true;
    if (c.cheapest) cheapest = true;
  }

  // "Upgrade from an old phone" → wants something current.
  if (/апгрейд|обновить телефон|поменять телефон|замен(а|у|ить) телефон|перейти с|пересесть с|мой старый|старый телефон|устарел|upgrade|replace my (old )?phone|time for a new phone/.test(t)) {
    newest = true;
    if (!tier) tier = "flagship";
  }

  // Negations: strip a hard-filter use the user explicitly does NOT want, so
  // "не складной" doesn't get read as wanting a foldable.
  let cleaned = uses;
  if (/без стилус|не нужен стилус|не нужен s[- ]?pen|без s[- ]?pen|не хочу стилус|without (a )?stylus|no s[- ]?pen/.test(t))
    cleaned = cleaned.filter((u) => u !== "spen");
  if (/не складн|без складн|не нужен складн|не хочу складн|not (a )?fold|no fold|not foldable/.test(t))
    cleaned = cleaned.filter((u) => u !== "foldable");
  if (/не большой|не нужен большой|небольшой|not (too )?big|not large/.test(t))
    cleaned = cleaned.filter((u) => u !== "big");

  // Budget: an explicit number wins; otherwise infer a ceiling from words so
  // "дешёвый"/"средняя цена" act as price limits (which lets value flagships in).
  let budgetUsd = parseBudgetUsd(t);
  if (budgetUsd === 0) {
    if (/средн(яя|юю|ей|его)?\s*цен|средн\w* ценов|mid[- ]?price|average price/.test(t)) budgetUsd = 550;
    else if (/дешев|дешёв|дешов|дишов|недорог|не дорог|подешевл|бюджет|эконом|копееч|cheap|budget|affordable|low[- ]?cost|inexpensive/.test(t))
      budgetUsd = 320;
  }

  return {
    tier,
    uses: cleaned,
    mentioned: findMentions(text, phones),
    newest,
    cheapest,
    budgetUsd,
    power,
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
  const budgetUsd = lastX.budgetUsd || (!fresh ? prevX.budgetUsd : 0);
  const power = lastX.power || (!fresh && prevX.power);
  const hasSignal =
    uses.length > 0 || tier !== null || mentioned.length > 0 || newest || cheapest || power || topical;
  return {
    tier,
    uses,
    mentioned,
    newest,
    cheapest,
    budgetUsd,
    power,
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
  if (uses.includes("longevity")) {
    // Longer software support + more years of life left = newer flagships.
    s += (p.year - 2010) * 8;
    s += p.tier === "flagship" ? 26 : p.tier === "mid" ? 9 : 0;
  }
  if (uses.includes("durable")) {
    s += p.water ? 12 : 0;
    s += p.tier === "flagship" ? 12 : p.tier === "mid" ? 5 : 0;
    s += (p.year - 2010) * 2;
  }
  if (uses.includes("display")) {
    s += p.tier === "flagship" ? 20 : p.tier === "mid" ? 8 : 0;
    s += (p.year - 2010) * 3;
  }
  if (uses.length === 0) s += p.tier === "flagship" ? 14 : p.tier === "mid" ? 6 : 0;
  // Mild premium proxy: among otherwise-tied models the pricier (top) variant
  // edges ahead, so "best phone" lands on the Ultra rather than the base model.
  // Foldables are excluded so a general "best phone" isn't a niche foldable.
  s += p.foldable ? 0 : (p.currentUsd || p.priceUsd) / 1500;
  // Refinement modifiers
  if (intent.newest) s += (p.year - 2010) * 10;
  if (intent.cheapest) {
    const price = p.currentUsd || p.priceUsd;
    s += price > 0 ? (1000 - price) / 10 : 0;
  }
  // Within budget → boost; over budget → strong penalty.
  if (intent.budgetUsd > 0 && p.currentUsd > 0) {
    s += p.currentUsd <= intent.budgetUsd ? 12 : -((p.currentUsd - intent.budgetUsd) / 20);
  }
  // Wants power → favour the most capable device: a former flagship that's now
  // cheap beats a new budget phone at the same price. Capability = flagship
  // class + newer chip (recency). Deprioritise niche foldables for a generic
  // "powerful" ask so it lands on an S-Ultra, not a Fold.
  if (intent.power) {
    s += p.tier === "flagship" ? 40 : p.tier === "mid" ? 16 : 0;
    s += (p.year - 2010) * 4; // newer chip
    s += Math.min(p.priceUsd, 1400) / 45; // premium/Ultra models were more powerful (capped so Folds don't run away)
    if (p.foldable && !intent.uses.includes("foldable")) s -= 60;
  }
  return s;
}

/** Never recommend a phone older than 7 years. */
export function isRecommendable(p: ConsultPhone): boolean {
  return new Date().getFullYear() - p.year <= 7;
}

function pick(phones: ConsultPhone[], intent: Intent, limit = 3): ConsultPhone[] {
  // Only recommend phones that are at most 7 years old.
  let recent = phones.filter(isRecommendable);
  // Honour a stated budget by the estimated CURRENT price (what it costs today),
  // with a little headroom. If nothing fits, ignore the budget rather than fail.
  if (intent.budgetUsd > 0) {
    const withinBudget = recent.filter((p) => p.currentUsd > 0 && p.currentUsd <= intent.budgetUsd * 1.12);
    if (withinBudget.length) recent = withinBudget;
  }
  // Whenever a budget is set, consider ALL models that fit that price (don't
  // lock to a class), so an affordable ex-flagship competes with new budget
  // phones and the best value wins. Only lock to a tier when no budget is given.
  const budgetRanking = intent.budgetUsd > 0;
  let pool = intent.tier && !budgetRanking ? recent.filter((p) => p.tier === intent.tier) : [...recent];
  if (intent.uses.includes("foldable")) pool = pool.filter((p) => p.foldable);
  if (intent.uses.includes("spen")) pool = pool.filter((p) => p.spen);
  if (pool.length === 0) pool = intent.tier && !budgetRanking ? recent.filter((p) => p.tier === intent.tier) : [...recent];
  if (pool.length === 0) pool = [...recent];
  if (pool.length === 0) pool = [...phones]; // ultimate safety net
  return pool.sort((a, b) => scoreFor(b, intent) - scoreFor(a, intent)).slice(0, limit);
}

// ── Phrasing ──────────────────────────────────────────────────
const link = (p: ConsultPhone) => `/phones/${p.slug}`;

function descriptor(p: ConsultPhone): string {
  // Show the estimated current price (what it costs today) rather than launch.
  const price = p.currentUsd > 0 ? `, ≈$${p.currentUsd}` : "";
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
    else if (u === "fiveg") out.push(en ? `strong 5G connectivity` : `уверенная 5G-связь`);
    else if (u === "foldable") out.push(en ? `a folding design` : `складной корпус`);
    else if (u === "spen") out.push(en ? `an S Pen that's great for drawing and notes` : `S Pen — удобно рисовать и делать заметки`);
    else if (u === "water") out.push(en ? `water resistance` : `влагозащита`);
    else if (u === "longevity") out.push(en ? `long software support for years to come` : `долгая поддержка обновлений на годы вперёд`);
    else if (u === "durable") out.push(en ? `a tough, well-protected build` : `прочный, хорошо защищённый корпус`);
    else if (u === "display") out.push(en ? `a smooth, high-quality display` : `плавный качественный экран`);
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
  // Never frame a 7+ year-old phone as a phone to buy today.
  if (!isRecommendable(p))
    return en
      ? "It's an older model now — worth knowing for its place in Galaxy history rather than as a phone to buy today."
      : "Это уже устаревшая модель — интересна скорее как часть истории Galaxy, чем как телефон для покупки сегодня.";
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
  // Offer a button for the top pick and each alternative (up to 3).
  const gotos = top.slice(0, 3).map((p) => `GOTO: ${link(p)}`).join("\n");
  return `${msg}\n${gotos}`;
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
  clarify: {
    en: "Happy to help you choose! To get it right, tell me two things: roughly what budget, and what matters most to you — camera, battery, gaming, screen size — or who it's for (work, a kid, a parent). Then I'll pick the best match.",
    ru: "С удовольствием помогу выбрать! Чтобы попасть точно, подскажите два момента: какой примерно бюджет и что для вас важнее всего — камера, батарея, игры, размер экрана — или для кого он (работа, ребёнку, родителям)? И я подберу лучший вариант.",
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
      // Only endorse the named model if it fits AND isn't older than 7 years;
      // otherwise suggest a current model instead of recommending an old one.
      if (passesFilters(p, intent) && isRecommendable(p)) return endorseReply(p, intent, locale);
      return recommendReply(intent, phones, locale);
    }
    return singleReply(p, locale);
  }
  if (intent.uses.length > 0 || intent.tier !== null || intent.newest || intent.cheapest || intent.power || intent.budgetUsd > 0) {
    return recommendReply(intent, phones, locale);
  }
  if (intent.thanks) return SAY.thanks[locale];
  if (intent.bye) return SAY.bye[locale];
  if (intent.greeting) return SAY.greet[locale];
  if (intent.affirm) return SAY.affirm[locale];
  if (intent.hasSignal) {
    // Topical but no concrete criteria (e.g. "посоветуй телефон"). On the first
    // vague message, act like a real consultant and ask what matters instead of
    // dumping a flagship. If they stay vague across turns, just recommend.
    const dontMind = /любой|не знаю|всё равно|все равно|не важно|不|any|whatever|don'?t (know|care)|no idea/.test(
      norm(userTexts.join(" "))
    );
    if (!dontMind && userTexts.filter((x) => x.trim()).length <= 1) return SAY.clarify[locale];
    return recommendReply(intent, phones, locale);
  }
  return SAY.offtopic[locale];
}
