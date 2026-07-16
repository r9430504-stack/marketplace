import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import ForumTopics from "@/components/ForumTopics";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Форум — обсуждения Samsung Galaxy",
  description:
    "Форум по смартфонам Samsung Galaxy. Смотрите, какие модели обсуждают, и присоединяйтесь к беседе на странице любой модели.",
  alternates: { canonical: "/ru/forum", languages: { en: "/forum", ru: "/ru/forum" } },
};

export default function ForumPageRu() {
  const T = t("ru");
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-4">
        <BackButton fallback="/ru" label={T.back} />
      </div>
      <header className="rise mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">{T.nav.forum}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Обсуждения смартфонов Samsung Galaxy — присоединяйтесь к беседе на странице любой модели.
        </p>
      </header>
      <ForumTopics locale="ru" />
    </div>
  );
}
