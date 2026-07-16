import type { Metadata } from "next";
import HistoryContent from "@/components/HistoryContent";

export const metadata: Metadata = {
  title: "Samsung Galaxy timeline by year",
  description:
    "The history of Samsung Galaxy phones year by year: key flagships, foldables and development milestones from 2013 to today.",
  alternates: { canonical: "/history", languages: { en: "/history", ru: "/ru/history" } },
};

export default function HistoryPage() {
  return <HistoryContent locale="en" />;
}
