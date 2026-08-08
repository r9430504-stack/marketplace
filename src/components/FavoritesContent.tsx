"use client";

import Link from "next/link";
import { useFavorites, useRecentPicks } from "@/lib/saved";
import FavoriteButton from "./FavoriteButton";
import type { Locale } from "@/lib/i18n";

export type FavPhone = {
  slug: string;
  name: string;
  seriesLabel: string;
  accent: string;
  releaseDate: string;
  hasRu: boolean;
};

const T = {
  en: {
    title: "My favorites",
    sub: "Phones you bookmarked. Stored on this device.",
    empty: "No favorites yet.",
    emptyHint: "Tap the bookmark on any phone to save it here.",
    browse: "Browse the catalog →",
    recent: "Recent AI picks",
    recentSub: "Models the consultant recommended you.",
  },
  ru: {
    title: "Моё избранное",
    sub: "Телефоны, отмеченные флажком. Хранятся на этом устройстве.",
    empty: "Пока пусто.",
    emptyHint: "Нажмите на флажок на любом телефоне, чтобы сохранить его сюда.",
    browse: "Открыть каталог →",
    recent: "Недавние подборы ИИ",
    recentSub: "Модели, которые советовал консультант.",
  },
};

function Card({ p, locale }: { p: FavPhone; locale: Locale }) {
  const href = locale === "ru" ? `/ru/phones/${p.slug}` : `/phones/${p.slug}`;
  return (
    <Link
      href={href}
      className="group glass rounded-2xl relative overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
    >
      <FavoriteButton slug={p.slug} className="absolute top-2 right-2 z-10 bg-white/85 dark:bg-black/50 backdrop-blur" />
      <div className="aspect-[4/5] bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/models/thumbs/${p.slug}.webp`} alt={p.name} className="w-full h-full object-contain" loading="lazy" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-semibold ${p.accent}`}>{p.seriesLabel}</span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">{p.releaseDate}</span>
        </div>
        <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-tight mt-0.5">{p.name}</h3>
      </div>
    </Link>
  );
}

export default function FavoritesContent({ phones, locale }: { phones: FavPhone[]; locale: Locale }) {
  const t = T[locale];
  const { favorites } = useFavorites();
  const recent = useRecentPicks();
  const bySlug = new Map(phones.map((p) => [p.slug, p]));

  const favPhones = favorites.map((s) => bySlug.get(s)).filter((p): p is FavPhone => Boolean(p));
  const recentPhones = recent
    .filter((s) => !favorites.includes(s))
    .map((s) => bySlug.get(s))
    .filter((p): p is FavPhone => Boolean(p));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.sub}</p>

      {favPhones.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center mt-8">
          <p className="text-4xl">🔖</p>
          <p className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{t.empty}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.emptyHint}</p>
          <Link href={locale === "ru" ? "/ru" : "/phones"} className="btn-primary px-5 py-2.5 text-sm mt-5 inline-flex">
            {t.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {favPhones.map((p) => (
            <Card key={p.slug} p={p} locale={locale} />
          ))}
        </div>
      )}

      {recentPhones.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t.recent}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.recentSub}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {recentPhones.map((p) => (
              <Card key={p.slug} p={p} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
