import type { Metadata } from "next";
import { auth, isOwnerEmail } from "@/auth";
import BackButton from "@/components/BackButton";
import AdminPhones from "@/components/AdminPhones";
import AdminSettings from "@/components/AdminSettings";
import { IconLock } from "@/components/icons";
import { SERIES } from "@/lib/phones";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  const owner = isOwnerEmail(session?.user?.email);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-4">
        <BackButton fallback="/" label="Back" />
      </div>

      {owner ? (
        <>
          <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-gray-100">Admin</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Edit page text and add phone models. Only you can see and use this page.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Home page text</h2>
            <AdminSettings />
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Add a model</h2>
            <AdminPhones seriesOptions={SERIES.map((s) => ({ id: s.id, label: s.label }))} />
          </section>
        </>
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <IconLock className="mx-auto h-9 w-9 text-gray-300 dark:text-gray-600" />
          <p className="mt-3 text-gray-600 dark:text-gray-300">This page is for the site owner only.</p>
        </div>
      )}
    </div>
  );
}
