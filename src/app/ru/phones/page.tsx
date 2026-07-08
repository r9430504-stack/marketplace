import type { Metadata } from "next";
import CatalogContent from "@/components/CatalogContent";

export const metadata: Metadata = {
  title: "Каталог телефонов Samsung Galaxy",
  description:
    "Полный каталог телефонов Samsung Galaxy с поиском по названию, чипсету и году. Флагманы S, Note, складные Z Fold и Z Flip с точными характеристиками.",
  alternates: { canonical: "/ru/phones", languages: { en: "/phones", ru: "/ru/phones" } },
};

export default async function PhonesPageRu({
  searchParams,
}: {
  searchParams: Promise<{ series?: string; q?: string }>;
}) {
  const { series, q } = await searchParams;
  return <CatalogContent locale="ru" series={series} q={q} />;
}
