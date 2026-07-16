import type { Metadata } from "next";
import TopicThread from "@/components/TopicThread";

export const metadata: Metadata = {
  title: "Topic — Forum",
  robots: { index: false, follow: true },
};

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <TopicThread id={id} locale="en" />
    </div>
  );
}
