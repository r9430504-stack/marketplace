export type Theme = "MODERN" | "DARK" | "BOLD" | "MINIMAL" | "WARM";

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
];

export function getTheme(id: Theme): ThemeConfig {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
