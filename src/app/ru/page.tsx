import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  title: "Galaxy Archive — история смартфонов Samsung Galaxy",
  description:
    "Неофициальный архив истории смартфонов Samsung Galaxy: флагманы S, Note, складные Z Fold и Z Flip, а также линейки A, M и другие. Характеристики, даты выхода и поиск по моделям.",
  alternates: {
    canonical: "/ru",
    languages: { en: "/", ru: "/ru" },
  },
  openGraph: {
    title: "Galaxy Archive — история смартфонов Samsung Galaxy",
    description:
      "Неофициальный архив истории смартфонов Samsung Galaxy: характеристики, даты выхода и поиск по моделям.",
    url: "/ru",
    type: "website",
    locale: "ru_RU",
  },
};

export default function HomePageRu() {
  return <HomeContent locale="ru" />;
}
