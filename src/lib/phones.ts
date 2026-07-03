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
  | "Galaxy J";

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
