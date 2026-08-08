import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Galaxy Archive",
    description: SITE_DESCRIPTION,
    start_url: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0b0b",
    theme_color: "#1428a0",
    categories: ["reference", "utilities", "shopping"],
    icons: [
      { src: "/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
