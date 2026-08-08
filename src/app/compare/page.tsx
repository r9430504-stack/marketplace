import type { Metadata } from "next";
import CompareIndexContent from "@/components/CompareIndexContent";

export const metadata: Metadata = {
  title: "Compare Samsung Galaxy phones",
  description:
    "Side-by-side Samsung Galaxy comparisons: flagship successors and siblings — Galaxy S, Note, Z Fold and Z Flip. Compare display, chipset, camera and battery.",
  alternates: { canonical: "/compare" },
};

export default function CompareIndexPage() {
  return <CompareIndexContent locale="en" />;
}
