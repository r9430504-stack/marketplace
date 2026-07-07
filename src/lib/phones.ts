// ─────────────────────────────────────────────────────────────
//  Data model for the Samsung Galaxy phone catalog.
//  The canonical data source is src/data/phones.ts.
//  To add a model, append a Phone object to that array.
// ─────────────────────────────────────────────────────────────

export type Specs = {
  display: string;
  displayType?: string;
  resolution?: string;
  refreshRate?: string;
  chipset: string;
  cpu?: string;
  ram: string;
  storage: string;
  mainCamera: string;
  frontCamera?: string;
  battery: string;
  charging?: string;
  os: string;
  dimensions?: string;
  weight?: string;
  build?: string;
  waterResistance?: string;
  colors?: string;
  launchPrice?: string;
};

export type Phone = {
  /** URL identifier, e.g. "galaxy-s24-ultra" */
  slug: string;
  /** Full name, e.g. "Galaxy S24 Ultra" */
  name: string;
  /** Line: a value from SERIES */
  series: SeriesId;
  /** Release year */
  releaseYear: number;
  /** Announce/release date, human-readable, e.g. "January 2024" */
  releaseDate: string;
  /** Short description (1 line) */
  tagline: string;
  /** Model history — 1-3 paragraphs, separated by \n\n */
  history: string;
  /** Key features (bullets) */
  keyFeatures: string[];
  /** Specifications */
  specs: Specs;
  /** Optional link to a real photo (can be added later) */
  image?: string;
  /** Additional photos (other angles/colors) — shown in the gallery */
  images?: string[];
};

// ─── Lines ───

export type SeriesId =
  | "Galaxy S"
  | "Galaxy Note"
  | "Galaxy Z Fold"
  | "Galaxy Z Flip"
  | "Galaxy A"
  | "Galaxy M"
  | "Galaxy J"
  | "Galaxy F"
  | "Galaxy Xcover"
  | "Galaxy Mega"
  | "Galaxy Grand"
  | "Galaxy Ace"
  | "Galaxy Alpha"
  | "Galaxy Round"
  | "Galaxy Beam";

export type SeriesMeta = {
  id: SeriesId;
  label: string;
  /** A pair of Tailwind colors for the placeholder gradient and accents */
  from: string;
  to: string;
  accent: string;
  blurb: string;
};

export const SERIES: SeriesMeta[] = [
  {
    id: "Galaxy S",
    label: "Galaxy S",
    from: "from-blue-600",
    to: "to-indigo-800",
    accent: "text-[#1428a0] dark:text-blue-400",
    blurb: "Samsung's main flagship line — the annual Android benchmark.",
  },
  {
    id: "Galaxy Note",
    label: "Galaxy Note",
    from: "from-amber-500",
    to: "to-orange-700",
    accent: "text-amber-600 dark:text-amber-400",
    blurb: "S Pen phablets that set the trend for big screens.",
  },
  {
    id: "Galaxy Z Fold",
    label: "Galaxy Z Fold",
    from: "from-emerald-500",
    to: "to-teal-800",
    accent: "text-emerald-600 dark:text-emerald-400",
    blurb: "Book-style foldables: a tablet that fits in your pocket.",
  },
  {
    id: "Galaxy Z Flip",
    label: "Galaxy Z Flip",
    from: "from-fuchsia-500",
    to: "to-purple-800",
    accent: "text-fuchsia-600 dark:text-fuchsia-400",
    blurb: "Compact clamshells — the cult format's return in the foldable era.",
  },
  {
    id: "Galaxy A",
    label: "Galaxy A",
    from: "from-slate-500",
    to: "to-slate-800",
    accent: "text-slate-600 dark:text-slate-300",
    blurb: "The mid-range — affordable models with flagship features.",
  },
  {
    id: "Galaxy M",
    label: "Galaxy M",
    from: "from-rose-500",
    to: "to-rose-800",
    accent: "text-rose-600 dark:text-rose-400",
    blurb: "An online series focused on huge batteries and a low price.",
  },
  {
    id: "Galaxy J",
    label: "Galaxy J",
    from: "from-lime-500",
    to: "to-green-800",
    accent: "text-lime-600 dark:text-lime-500",
    blurb: "An early budget line — mass-market affordable phones of 2015–2017.",
  },
  {
    id: "Galaxy F",
    label: "Galaxy F",
    from: "from-orange-500",
    to: "to-red-700",
    accent: "text-orange-600 dark:text-orange-400",
    blurb: "An online series for emerging markets with large batteries.",
  },
  {
    id: "Galaxy Xcover",
    label: "Galaxy Xcover",
    from: "from-yellow-600",
    to: "to-stone-700",
    accent: "text-yellow-700 dark:text-yellow-500",
    blurb: "MIL-STD rugged phones for tough conditions.",
  },
  {
    id: "Galaxy Mega",
    label: "Galaxy Mega",
    from: "from-sky-500",
    to: "to-blue-800",
    accent: "text-sky-600 dark:text-sky-400",
    blurb: "Early “phablets” with screens that were huge for their time.",
  },
  {
    id: "Galaxy Grand",
    label: "Galaxy Grand",
    from: "from-violet-500",
    to: "to-indigo-800",
    accent: "text-violet-600 dark:text-violet-400",
    blurb: "A mass-market, affordable mid-size line of the early 2010s.",
  },
  {
    id: "Galaxy Ace",
    label: "Galaxy Ace",
    from: "from-teal-500",
    to: "to-cyan-800",
    accent: "text-teal-600 dark:text-teal-400",
    blurb: "Iconic compact budget phones of the early 2010s.",
  },
  {
    id: "Galaxy Alpha",
    label: "Galaxy Alpha",
    from: "from-zinc-500",
    to: "to-neutral-800",
    accent: "text-zinc-600 dark:text-zinc-300",
    blurb: "The first Galaxy with a metal frame — a precursor to the S6 design.",
  },
  {
    id: "Galaxy Round",
    label: "Galaxy Round",
    from: "from-pink-500",
    to: "to-rose-800",
    accent: "text-pink-600 dark:text-pink-400",
    blurb: "The world's first curved-screen smartphone (2013).",
  },
  {
    id: "Galaxy Beam",
    label: "Galaxy Beam",
    from: "from-amber-400",
    to: "to-yellow-700",
    accent: "text-amber-600 dark:text-amber-400",
    blurb: "A phone with a built-in pico projector.",
  },
];

export function seriesMeta(id: SeriesId): SeriesMeta {
  return SERIES.find((s) => s.id === id) ?? SERIES[0];
}

/** URL-safe slug for a line, e.g. "Galaxy Z Fold" → "galaxy-z-fold". */
export function seriesSlug(id: SeriesId): string {
  return id.toLowerCase().replace(/\s+/g, "-");
}

export function seriesFromSlug(slug: string): SeriesMeta | undefined {
  return SERIES.find((s) => seriesSlug(s.id) === slug);
}

// ─── Data access (in-memory, from src/data/phones.ts) ───

import { PHONES } from "@/data/phones";

export function getAllPhones(): Phone[] {
  return [...PHONES].sort(
    (a, b) => b.releaseYear - a.releaseYear || a.name.localeCompare(b.name)
  );
}

export function getPhoneBySlug(slug: string): Phone | undefined {
  return PHONES.find((p) => p.slug === slug);
}

export function getYears(): number[] {
  return [...new Set(PHONES.map((p) => p.releaseYear))].sort((a, b) => b - a);
}

/** Neighbouring models from the same line — for the "See also" block. */
export function relatedPhones(phone: Phone, limit = 4): Phone[] {
  return getAllPhones()
    .filter((p) => p.slug !== phone.slug && p.series === phone.series)
    .slice(0, limit);
}

/** Previous/next model in the same line, ordered by release year (for internal
 * linking and easier crawling). */
export function seriesNeighbours(phone: Phone): { prev?: Phone; next?: Phone } {
  const line = getAllPhones()
    .filter((p) => p.series === phone.series)
    .sort((a, b) => a.releaseYear - b.releaseYear || a.name.localeCompare(b.name));
  const i = line.findIndex((p) => p.slug === phone.slug);
  if (i === -1) return {};
  return { prev: line[i - 1], next: line[i + 1] };
}

// ─── Comparisons ("X vs Y") ───

/** Rough tier of a model, from its name, for pairing like-with-like. */
function tierOf(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("ultra")) return "ultra";
  if (n.includes("plus") || n.includes("+")) return "plus";
  if (/\bfe\b/.test(n)) return "fe";
  if (n.includes("edge")) return "edge";
  return "base";
}

/** Deterministic pair ordering: older model first, then by name. */
function orderPair(a: Phone, b: Phone): [Phone, Phone] {
  if (a.releaseYear !== b.releaseYear) return a.releaseYear < b.releaseYear ? [a, b] : [b, a];
  return a.name.localeCompare(b.name) <= 0 ? [a, b] : [b, a];
}

export function comparisonSlug(a: Phone, b: Phone): string {
  const [x, y] = orderPair(a, b);
  return `${x.slug}-vs-${y.slug}`;
}

/**
 * Curated, high-intent comparison pairs — the "X vs Y" queries people search:
 *  - successors: the same tier one generation apart (S24 vs S25, Z Fold 5 vs 6)
 *  - siblings: same generation, different tier (S24 vs S24 Ultra)
 * Limited to the flagship lines to keep the set meaningful.
 */
export function getComparisonPairs(): { a: Phone; b: Phone }[] {
  const flagshipSeries: SeriesId[] = [
    "Galaxy S",
    "Galaxy Note",
    "Galaxy Z Fold",
    "Galaxy Z Flip",
  ];
  const seen = new Set<string>();
  const pairs: { a: Phone; b: Phone }[] = [];
  const add = (a: Phone, b: Phone) => {
    const [x, y] = orderPair(a, b);
    const key = `${x.slug}-vs-${y.slug}`;
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push({ a: x, b: y });
  };

  for (const s of flagshipSeries) {
    const list = getAllPhones().filter((p) => p.series === s);

    // Successors: same tier, consecutive by year.
    const tiers = new Map<string, Phone[]>();
    for (const p of list) {
      const t = tierOf(p.name);
      (tiers.get(t) ?? tiers.set(t, []).get(t)!).push(p);
    }
    for (const group of tiers.values()) {
      const sorted = [...group].sort((a, b) => a.releaseYear - b.releaseYear);
      for (let i = 0; i + 1 < sorted.length; i++) add(sorted[i], sorted[i + 1]);
    }

    // Siblings: same year, different tier.
    const years = new Map<number, Phone[]>();
    for (const p of list) {
      (years.get(p.releaseYear) ?? years.set(p.releaseYear, []).get(p.releaseYear)!).push(p);
    }
    for (const group of years.values()) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) add(group[i], group[j]);
      }
    }
  }

  return pairs;
}

/** Look up a comparison by its "a-vs-b" slug (order-independent). */
export function getComparisonBySlug(
  pairSlug: string
): { a: Phone; b: Phone } | undefined {
  const idx = pairSlug.indexOf("-vs-");
  if (idx === -1) return undefined;
  const aSlug = pairSlug.slice(0, idx);
  const bSlug = pairSlug.slice(idx + 4);
  const a = getPhoneBySlug(aSlug);
  const b = getPhoneBySlug(bSlug);
  if (!a || !b || a.slug === b.slug) return undefined;
  const [x, y] = orderPair(a, b);
  return { a: x, b: y };
}

/** Comparisons that involve a given phone (for "Compare" links on its page). */
export function comparisonsFor(phone: Phone, limit = 6): { a: Phone; b: Phone }[] {
  return getComparisonPairs()
    .filter((p) => p.a.slug === phone.slug || p.b.slug === phone.slug)
    .slice(0, limit);
}

/** Battery capacity in mAh parsed from the spec string (0 if unknown). */
export function batteryMah(p: Phone): number {
  const m = p.specs.battery.match(/(\d[\d,]*)\s*mAh/i);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}

/** Feature toggles for the catalog filter — each with a predicate. */
export const FEATURE_FILTERS: { id: string; label: string; test: (p: Phone) => boolean }[] = [
  {
    id: "spen",
    label: "S Pen",
    test: (p) =>
      p.series === "Galaxy Note" ||
      (p.series === "Galaxy S" && /ultra/i.test(p.name) && p.releaseYear >= 2022),
  },
  {
    id: "foldable",
    label: "Foldable",
    test: (p) => p.series === "Galaxy Z Fold" || p.series === "Galaxy Z Flip",
  },
  {
    id: "water",
    label: "Water-resistant",
    test: (p) => Boolean(p.specs.waterResistance && /IP\d/i.test(p.specs.waterResistance)),
  },
  {
    id: "bigbat",
    label: "Big battery (5000 mAh+)",
    test: (p) => batteryMah(p) >= 5000,
  },
];

export type PhoneFilter = {
  query?: string;
  series?: SeriesId | "all";
  year?: number | "all";
  features?: string[];
};

export function filterPhones(phones: Phone[], f: PhoneFilter): Phone[] {
  const q = (f.query ?? "").trim().toLowerCase();
  const feats = (f.features ?? [])
    .map((id) => FEATURE_FILTERS.find((x) => x.id === id))
    .filter(Boolean) as typeof FEATURE_FILTERS;
  return phones.filter((p) => {
    if (f.series && f.series !== "all" && p.series !== f.series) return false;
    if (f.year && f.year !== "all" && p.releaseYear !== f.year) return false;
    if (feats.length && !feats.every((ft) => ft.test(p))) return false;
    if (q) {
      const hay =
        `${p.name} ${p.series} ${p.specs.chipset} ${p.releaseYear}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
