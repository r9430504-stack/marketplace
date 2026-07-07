import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", ru: "/ru" },
  },
};

export default function HomePage() {
  return <HomeContent locale="en" />;
}
