import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import NewTopic from "@/components/NewTopic";
import { getAllPhones, seriesMeta } from "@/lib/phones";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "New topic — Forum",
  robots: { index: false, follow: true },
};

export default function NewTopicPage() {
  const T = t("en");
  const phones = getAllPhones().map((p) => ({ slug: p.slug, name: p.name, line: seriesMeta(p.series).label }));
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-4">
        <BackButton fallback="/forum" label={T.back} />
      </div>
      <header className="rise mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">New topic</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Pick a model, give your topic a title and describe it.</p>
      </header>
      <NewTopic phones={phones} locale="en" />
    </div>
  );
}
