import type { Metadata } from "next";
import CatalogContent from "@/components/CatalogContent";

export const metadata: Metadata = {
  title: "Samsung Galaxy phone catalog",
  description:
    "The full catalog of Samsung Galaxy phones with search by name, chipset and year. The S, Note, foldable Z Fold and Z Flip flagships with exact specifications.",
  alternates: { canonical: "/phones" },
};

export default async function PhonesPage({
  searchParams,
}: {
  searchParams: Promise<{ series?: string; q?: string }>;
}) {
  const { series, q } = await searchParams;
  return <CatalogContent locale="en" series={series} q={q} />;
}
