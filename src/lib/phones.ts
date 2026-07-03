// ─────────────────────────────────────────────────────────────
//  Модель данных для каталога телефонов Samsung Galaxy.
//  Каноничный источник данных — файл src/data/phones.ts.
//  Чтобы добавить модель, допишите объект Phone в тот массив.
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
  /** URL-идентификатор, напр. "galaxy-s24-ultra" */
  slug: string;
  /** Полное название, напр. "Galaxy S24 Ultra" */
  name: string;
  /** Линейка: значение из SERIES */
  series: SeriesId;
  /** Год выпуска */
  releaseYear: number;
  /** Дата анонса/выхода, человекочитаемо, напр. "Январь 2024" */
  releaseDate: string;
  /** Короткое описание (1 строка) */
  tagline: string;
  /** История модели — 1-3 абзаца, абзацы через \n\n */
  history: string;
  /** Ключевые особенности (буллеты) */
  keyFeatures: string[];
  /** Характеристики */
  specs: Specs;
  /** Необязательная ссылка на реальное фото (можно добавить позже) */
  image?: string;
  /** Дополнительные фото (другие ракурсы/цвета) — показываются в галерее */
  images?: string[];
};

// ─── Линейки ───

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
  /** Пара цветов Tailwind для градиента-заглушки и акцентов */
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
    blurb: "Главная флагманская линейка Samsung — ежегодный эталон Android.",
  },
  {
    id: "Galaxy Note",
    label: "Galaxy Note",
    from: "from-amber-500",
    to: "to-orange-700",
    accent: "text-amber-600 dark:text-amber-400",
    blurb: "Фаблеты со стилусом S Pen, задавшие моду на большие экраны.",
  },
  {
    id: "Galaxy Z Fold",
    label: "Galaxy Z Fold",
    from: "from-emerald-500",
    to: "to-teal-800",
    accent: "text-emerald-600 dark:text-emerald-400",
    blurb: "Складные смартфоны-книжки: планшет, помещающийся в карман.",
  },
  {
    id: "Galaxy Z Flip",
    label: "Galaxy Z Flip",
    from: "from-fuchsia-500",
    to: "to-purple-800",
    accent: "text-fuchsia-600 dark:text-fuchsia-400",
    blurb: "Компактные раскладушки — возвращение cult-формата в эпоху складных экранов.",
  },
  {
    id: "Galaxy Fold",
    label: "Galaxy Fold",
    from: "from-cyan-500",
    to: "to-blue-800",
    accent: "text-cyan-600 dark:text-cyan-400",
    blurb: "Первое поколение складного смартфона Samsung.",
  },
  {
    id: "Galaxy A",
    label: "Galaxy A",
    from: "from-slate-500",
    to: "to-slate-800",
    accent: "text-slate-600 dark:text-slate-300",
    blurb: "Средний класс — доступные модели с флагманскими фишками.",
  },
  {
    id: "Galaxy M",
    label: "Galaxy M",
    from: "from-rose-500",
    to: "to-rose-800",
    accent: "text-rose-600 dark:text-rose-400",
    blurb: "Онлайн-серия с упором на огромные аккумуляторы и низкую цену.",
  },
  {
    id: "Galaxy J",
    label: "Galaxy J",
    from: "from-lime-500",
    to: "to-green-800",
    accent: "text-lime-600 dark:text-lime-500",
    blurb: "Ранняя бюджетная линейка — массовые доступные смартфоны 2015–2017.",
  },
  {
    id: "Galaxy F",
    label: "Galaxy F",
    from: "from-orange-500",
    to: "to-red-700",
    accent: "text-orange-600 dark:text-orange-400",
    blurb: "Онлайн-серия для развивающихся рынков с крупными аккумуляторами.",
  },
  {
    id: "Galaxy Xcover",
    label: "Galaxy Xcover",
    from: "from-yellow-600",
    to: "to-stone-700",
    accent: "text-yellow-700 dark:text-yellow-500",
    blurb: "Защищённые смартфоны по стандарту MIL-STD для тяжёлых условий.",
  },
  {
    id: "Galaxy Mega",
    label: "Galaxy Mega",
    from: "from-sky-500",
    to: "to-blue-800",
    accent: "text-sky-600 dark:text-sky-400",
    blurb: "Ранние «планшетофоны» с огромными по меркам времени экранами.",
  },
  {
    id: "Galaxy Grand",
    label: "Galaxy Grand",
    from: "from-violet-500",
    to: "to-indigo-800",
    accent: "text-violet-600 dark:text-violet-400",
    blurb: "Массовая доступная линейка среднего размера первой половины 2010-х.",
  },
  {
    id: "Galaxy Ace",
    label: "Galaxy Ace",
    from: "from-teal-500",
    to: "to-cyan-800",
    accent: "text-teal-600 dark:text-teal-400",
    blurb: "Культовые компактные бюджетники начала 2010-х.",
  },
  {
    id: "Galaxy Alpha",
    label: "Galaxy Alpha",
    from: "from-zinc-500",
    to: "to-neutral-800",
    accent: "text-zinc-600 dark:text-zinc-300",
    blurb: "Первый Galaxy с металлической рамкой — предвестник дизайна S6.",
  },
  {
    id: "Galaxy Round",
    label: "Galaxy Round",
    from: "from-pink-500",
    to: "to-rose-800",
    accent: "text-pink-600 dark:text-pink-400",
    blurb: "Первый в мире смартфон с изогнутым экраном (2013).",
  },
  {
    id: "Galaxy Beam",
    label: "Galaxy Beam",
    from: "from-amber-400",
    to: "to-yellow-700",
    accent: "text-amber-600 dark:text-amber-400",
    blurb: "Смартфон со встроенным пико-проектором.",
  },
];

export function seriesMeta(id: SeriesId): SeriesMeta {
  return SERIES.find((s) => s.id === id) ?? SERIES[0];
}

// ─── Доступ к данным (in-memory, из src/data/phones.ts) ───

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

/** Соседние модели той же линейки — для блока «Смотрите также». */
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
