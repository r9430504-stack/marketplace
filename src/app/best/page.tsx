import type { Metadata } from "next";
import BestIndexContent from "@/components/BestIndexContent";

export const metadata: Metadata = {
  title: "Samsung Galaxy guides and collections",
  description:
    "Curated Samsung Galaxy collections: foldables, Ultra flagships, S Pen phones, big-battery models, affordable Galaxy phones and landmark firsts.",
  alternates: { canonical: "/best", languages: { en: "/best", ru: "/ru/best" } },
};

export default function BestIndexPage() {
  return <BestIndexContent locale="en" />;
}
