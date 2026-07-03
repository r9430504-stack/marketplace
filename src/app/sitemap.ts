import type { MetadataRoute } from "next";
import { getAllPhones } from "@/lib/phones";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const phones = getAllPhones();

  const phoneUrls: MetadataRoute.Sitemap = phones.map((p) => ({
    url: `${SITE_URL}/phones/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/phones`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/history`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    ...phoneUrls,
  ];
}
