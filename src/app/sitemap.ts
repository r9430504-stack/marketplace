import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

// Строим карту сайта при запросе (нужна база данных)
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stores = await prisma.store.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      updatedAt: true,
      products: { select: { id: true, createdAt: true } },
    },
  });

  const storeUrls: MetadataRoute.Sitemap = stores.map((s) => ({
    url: `${SITE_URL}/store/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productUrls: MetadataRoute.Sitemap = stores.flatMap((s) =>
    s.products.map((p) => ({
      url: `${SITE_URL}/store/${s.slug}/${p.id}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...storeUrls,
    ...productUrls,
  ];
}
