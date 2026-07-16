import type { Metadata } from "next";
import CompareIndexContent from "@/components/CompareIndexContent";

export const metadata: Metadata = {
  title: "Сравнение смартфонов Samsung Galaxy",
  description:
    "Сравнения Samsung Galaxy бок о бок: флагманы и их предшественники — Galaxy S, Note, Z Fold и Z Flip. Сравните экран, процессор, камеру и батарею.",
  alternates: { canonical: "/ru/compare", languages: { en: "/compare", ru: "/ru/compare" } },
};

export default function CompareIndexPageRu() {
  return <CompareIndexContent locale="ru" />;
}
