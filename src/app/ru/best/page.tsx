import type { Metadata } from "next";
import BestIndexContent from "@/components/BestIndexContent";

export const metadata: Metadata = {
  title: "Подборки и гайды Samsung Galaxy",
  description:
    "Подборки Samsung Galaxy: складные, флагманы Ultra, модели с S Pen, с большой батареей, доступные Galaxy и знаковые первопроходцы.",
  alternates: { canonical: "/ru/best", languages: { en: "/best", ru: "/ru/best" } },
};

export default function BestIndexPageRu() {
  return <BestIndexContent locale="ru" />;
}
