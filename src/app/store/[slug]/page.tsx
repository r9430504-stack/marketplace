import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTheme, getTemplate } from "@/types";
import ClassicTemplate from "@/components/store/templates/ClassicTemplate";
import CorporateTemplate from "@/components/store/templates/CorporateTemplate";
import MinimalTemplate from "@/components/store/templates/MinimalTemplate";
import type { StoreData } from "@/components/store/templates/shared";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({ where: { slug } });
  return { title: store?.name ?? "Магазин", description: store?.tagline };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const storeRaw = await prisma.store.findUnique({
    where: { slug },
    include: {
      categories: {
        include: { products: { orderBy: { createdAt: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!storeRaw) notFound();

  const theme = getTheme(storeRaw.theme);
  const template = getTemplate(storeRaw.layout);
  const store = storeRaw as unknown as StoreData;

  if (template === "corporate") return <CorporateTemplate store={store} theme={theme} />;
  if (template === "minimal") return <MinimalTemplate store={store} theme={theme} />;
  return <ClassicTemplate store={store} theme={theme} />;
}
