import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import ForumContent from "@/components/ForumContent";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Forum — Samsung Galaxy discussions",
  description:
    "Community forum for Samsung Galaxy phones. See which models people are discussing and join the conversation on any model's page.",
  alternates: { canonical: "/forum", languages: { en: "/forum", ru: "/ru/forum" } },
};

export default function ForumPage() {
  const T = t("en");
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-4">
        <BackButton fallback="/" label={T.back} />
      </div>
      <header className="rise mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">{T.nav.forum}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Discussions about Samsung Galaxy phones — join the conversation on any model&rsquo;s page.
        </p>
      </header>
      <ForumContent locale="en" />
    </div>
  );
}
