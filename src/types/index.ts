export type Theme =
  | "MODERN"
  | "DARK"
  | "BOLD"
  | "MINIMAL"
  | "WARM"
  | "OCEAN"
  | "FOREST"
  | "SUNSET"
  | "ROSE"
  | "MIDNIGHT"
  | "CANDY"
  | "MONO";

export type ThemeConfig = {
  id: Theme;
  nameRu: string;
  nameEn: string;
  bg: string;
  text: string;
  accent: string;
  card: string;
  border: string;
  preview: string;
};

export const THEMES: ThemeConfig[] = [
  {
    id: "MODERN",
    nameRu: "Современный",
    nameEn: "Modern",
    bg: "bg-white",
    text: "text-gray-900",
    accent: "bg-blue-600 text-white",
    card: "bg-white border border-gray-200 shadow-sm",
    border: "border-gray-200",
    preview: "from-blue-50 to-white",
  },
  {
    id: "DARK",
    nameRu: "Тёмный",
    nameEn: "Dark",
    bg: "bg-gray-950",
    text: "text-gray-100",
    accent: "bg-violet-600 text-white",
    card: "bg-gray-900 border border-gray-800",
    border: "border-gray-800",
    preview: "from-gray-950 to-gray-800",
  },
  {
    id: "BOLD",
    nameRu: "Яркий",
    nameEn: "Bold",
    bg: "bg-orange-50",
    text: "text-gray-900",
    accent: "bg-orange-500 text-white",
    card: "bg-white border-2 border-orange-300 shadow",
    border: "border-orange-300",
    preview: "from-orange-400 to-yellow-300",
  },
  {
    id: "MINIMAL",
    nameRu: "Минимальный",
    nameEn: "Minimal",
    bg: "bg-stone-50",
    text: "text-stone-800",
    accent: "bg-stone-800 text-stone-50",
    card: "bg-stone-50 border border-stone-200",
    border: "border-stone-200",
    preview: "from-stone-100 to-stone-50",
  },
  {
    id: "WARM",
    nameRu: "Тёплый",
    nameEn: "Warm",
    bg: "bg-amber-50",
    text: "text-amber-900",
    accent: "bg-red-600 text-white",
    card: "bg-white border border-amber-200 shadow-sm",
    border: "border-amber-200",
    preview: "from-red-400 to-amber-300",
  },
  {
    id: "OCEAN",
    nameRu: "Океан",
    nameEn: "Ocean",
    bg: "bg-cyan-50",
    text: "text-slate-900",
    accent: "bg-cyan-600 text-white",
    card: "bg-white border border-cyan-200 shadow-sm",
    border: "border-cyan-200",
    preview: "from-cyan-400 to-blue-400",
  },
  {
    id: "FOREST",
    nameRu: "Лес",
    nameEn: "Forest",
    bg: "bg-emerald-50",
    text: "text-emerald-950",
    accent: "bg-emerald-600 text-white",
    card: "bg-white border border-emerald-200 shadow-sm",
    border: "border-emerald-200",
    preview: "from-emerald-400 to-green-300",
  },
  {
    id: "SUNSET",
    nameRu: "Закат",
    nameEn: "Sunset",
    bg: "bg-rose-50",
    text: "text-gray-900",
    accent: "bg-pink-600 text-white",
    card: "bg-white border border-pink-200 shadow-sm",
    border: "border-pink-200",
    preview: "from-pink-500 via-orange-400 to-amber-300",
  },
  {
    id: "ROSE",
    nameRu: "Роза",
    nameEn: "Rose",
    bg: "bg-rose-50",
    text: "text-rose-950",
    accent: "bg-rose-600 text-white",
    card: "bg-white border border-rose-200 shadow-sm",
    border: "border-rose-200",
    preview: "from-rose-400 to-pink-300",
  },
  {
    id: "MIDNIGHT",
    nameRu: "Полночь",
    nameEn: "Midnight",
    bg: "bg-slate-950",
    text: "text-slate-100",
    accent: "bg-indigo-500 text-white",
    card: "bg-slate-900 border border-indigo-900/50",
    border: "border-slate-800",
    preview: "from-indigo-900 via-slate-900 to-purple-900",
  },
  {
    id: "CANDY",
    nameRu: "Конфета",
    nameEn: "Candy",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-950",
    accent: "bg-fuchsia-600 text-white",
    card: "bg-white border border-fuchsia-200 shadow-sm",
    border: "border-fuchsia-200",
    preview: "from-fuchsia-400 via-purple-400 to-pink-300",
  },
  {
    id: "MONO",
    nameRu: "Чёрно-белый",
    nameEn: "Mono",
    bg: "bg-white",
    text: "text-black",
    accent: "bg-black text-white",
    card: "bg-white border-2 border-black",
    border: "border-black",
    preview: "from-gray-900 to-gray-400",
  },
];

export function getTheme(id: Theme): ThemeConfig {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
