import type { Metadata } from "next";
import CatalogContent from "@/components/CatalogContent";

const BASE: Metadata = {
  title: "Samsung Galaxy phone catalog",
  description:
    "The full catalog of Samsung Galaxy phones with search by name, chipset and year. The S, Note, foldable Z Fold and Z Flip flagships with exact specifications.",
  alternates: { canonical: "/phones" },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ series?: string; q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  // Search-result / filtered views are thin duplicates of the clean catalog —
  // keep them out of the index (this also clears the /phones?q={search_term_string}
  // template that Google picks up from the site-search markup).
  if (q) return { ...BASE, robots: { index: false, follow: true } };
  return BASE;
}

export default async function PhonesPage({
  searchParams,
}: {
  searchParams: Promise<{ series?: string; q?: string }>;
}) {
  const { series, q } = await searchParams;
  return <CatalogContent locale="en" series={series} q={q} />;
}
