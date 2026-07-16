import type { Locale } from "@/lib/i18n";

const L = {
  en: { justNow: "just now", min: "min ago", hr: "h ago", day: "d ago" },
  ru: { justNow: "только что", min: "мин назад", hr: "ч назад", day: "дн назад" },
};

/** Relative time like "5 мин назад" / "2 d ago", falling back to a date. */
export function timeAgo(iso: string, locale: Locale): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  const t = L[locale];
  if (s < 60) return t.justNow;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} ${t.min}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ${t.hr}`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ${t.day}`;
  return new Date(then).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
