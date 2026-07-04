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
  | "Galaxy Fold"
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
    accent: "text-blue-600 dark:text-blue-400",
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
    id: "Galaxy Fold",
    label: "Galaxy Fold",
    from: "from-cyan-500",
    to: "to-blue-800",
    accent: "text-cyan-600 dark:text-cyan-400",
    blurb: "The first generation of Samsung's foldable phone.",
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

export type PhoneFilter = {
  query?: string;
  series?: SeriesId | "all";
  year?: number | "all";
};

export function filterPhones(phones: Phone[], f: PhoneFilter): Phone[] {
  const q = (f.query ?? "").trim().toLowerCase();
  return phones.filter((p) => {
    if (f.series && f.series !== "all" && p.series !== f.series) return false;
    if (f.year && f.year !== "all" && p.releaseYear !== f.year) return false;
    if (q) {
      const hay =
        `${p.name} ${p.series} ${p.specs.chipset} ${p.releaseYear}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
