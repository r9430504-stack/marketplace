import type { Metadata } from "next";
import HistoryContent from "@/components/HistoryContent";

export const metadata: Metadata = {
  title: "Хронология Samsung Galaxy по годам",
  description:
    "История смартфонов Samsung Galaxy по годам: ключевые флагманы, складные модели и вехи развития с 2010 года до сегодня.",
  alternates: { canonical: "/ru/history", languages: { en: "/history", ru: "/ru/history" } },
};

export default function HistoryPageRu() {
  return <HistoryContent locale="ru" />;
}
