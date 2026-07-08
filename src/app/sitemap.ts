import type { MetadataRoute } from "next";
import {
  getAllPhones,
  getComparisonPairs,
  comparisonSlug,
  ruTranslatedSlugs,
  SERIES,
  seriesSlug,
} from "@/lib/phones";
import { getCollections } from "@/lib/collections";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const phones = getAllPhones();

  const phoneUrls: MetadataRoute.Sitemap = phones.map((p) => ({
    url: `${SITE_URL}/phones/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const compareUrls: MetadataRoute.Sitemap = getComparisonPairs().map(({ a, b }) => ({
    url: `${SITE_URL}/compare/${comparisonSlug(a, b)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const seriesUrls: MetadataRoute.Sitemap = SERIES.map((s) => ({
    url: `${SITE_URL}/series/${seriesSlug(s.id)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const collectionUrls: MetadataRoute.Sitemap = getCollections().map((c) => ({
    url: `${SITE_URL}/best/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const ruPhoneUrls: MetadataRoute.Sitemap = ruTranslatedSlugs().map((slug) => ({
    url: `${SITE_URL}/ru/phones/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/ru`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/ru/phones`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/phones`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/compare`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/best`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/history`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    ...seriesUrls,
    ...collectionUrls,
    ...phoneUrls,
    ...ruPhoneUrls,
    ...compareUrls,
  ];
}
