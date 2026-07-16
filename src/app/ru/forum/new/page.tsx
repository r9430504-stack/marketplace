import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import NewTopic from "@/components/NewTopic";
import { getAllPhones, seriesMeta } from "@/lib/phones";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Новая тема — Форум",
  robots: { index: false, follow: true },
};

export default function NewTopicPageRu() {
  const T = t("ru");
  const phones = getAllPhones().map((p) => ({ slug: p.slug, name: p.name, line: seriesMeta(p.series).label }));
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-4">
        <BackButton fallback="/ru/forum" label={T.back} />
      </div>
      <header className="rise mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">Новая тема</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Выберите модель, придумайте заголовок и опишите тему.</p>
      </header>
      <NewTopic phones={phones} locale="ru" />
    </div>
  );
}
