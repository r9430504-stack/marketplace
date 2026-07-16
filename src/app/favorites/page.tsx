import type { Metadata } from "next";
import { getAllPhones, seriesMeta, hasRuTranslation } from "@/lib/phones";
import FavoritesContent, { type FavPhone } from "@/components/FavoritesContent";

export const metadata: Metadata = {
  title: "My favorites",
  description: "Your saved Samsung Galaxy phones.",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
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
  return <FavoritesContent phones={phones} locale="en" />;
}
