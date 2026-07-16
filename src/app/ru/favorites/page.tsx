import type { Metadata } from "next";
import { getAllPhones, seriesMeta, hasRuTranslation } from "@/lib/phones";
import FavoritesContent, { type FavPhone } from "@/components/FavoritesContent";

export const metadata: Metadata = {
  title: "Моё избранное",
  description: "Сохранённые смартфоны Samsung Galaxy.",
  robots: { index: false, follow: true },
};

export default function FavoritesPageRu() {
  const phones: FavPhone[] = getAllPhones()
    .filter((p) => p.image)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      seriesLabel: seriesMeta(p.series).label,
      accent: seriesMeta(p.series).accent,
      releaseDate: p.releaseDate,
      hasRu: hasRuTranslation(p.slug),
    }));
  return <FavoritesContent phones={phones} locale="ru" />;
}
