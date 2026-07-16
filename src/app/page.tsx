import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", ru: "/ru" },
  },
};

// Refresh periodically so owner-added models and edited text appear
// automatically (ISR) without a rebuild.
export const revalidate = 60;

export default function HomePage() {
  return <HomeContent locale="en" />;
}
