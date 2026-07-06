import type { Metadata } from "next";
import Link from "next/link";
import { getAllPhones } from "@/lib/phones";
import { SITE_NAME } from "@/lib/site";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Galaxy Archive — an independent, unofficial reference archive of Samsung Galaxy smartphone history, specifications and release dates.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const phones = getAllPhones();
  const total = phones.length;
  const firstYear = Math.min(...phones.map((p) => p.releaseYear));
  const lastYear = Math.max(...phones.map((p) => p.releaseYear));

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-4">
        <BackButton fallback="/" label="Back" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">About {SITE_NAME}</h1>

      <div className="mt-6 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <p>
            {SITE_NAME} is an independent, enthusiast-run reference archive dedicated to the history
            of Samsung Galaxy smartphones. It brings together {total} officially released models —
            from {firstYear} to {lastYear} — in one place, with specifications, release dates and a
            short history for each device.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            What you’ll find here
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              A searchable <Link href="/phones" className="text-[#1428a0] hover:underline">catalog</Link>{" "}
              of every model, filterable by line, chipset and year.
            </li>
            <li>
              A year-by-year <Link href="/history" className="text-[#1428a0] hover:underline">timeline</Link>{" "}
              of the Galaxy S, Note, foldable Z Fold / Z Flip, and the A, M and other lines.
            </li>
            <li>
              Per-model pages with full specifications, key features and the story behind each phone.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            How the information is compiled
          </h2>
          <p>
            Specifications, dates and descriptions are gathered from public sources and organized
            into a consistent, easy-to-compare format. We aim for accuracy and keep the archive up
            to date as new models are released, but the data is provided for reference only — for
            official details, always check the manufacturer’s website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Independent and unofficial
          </h2>
          <p>
            {SITE_NAME} is <strong>not affiliated with, endorsed by, or connected to Samsung
            Electronics</strong>. “Samsung” and “Galaxy” are trademarks of Samsung Electronics, used
            here purely for reference. See our{" "}
            <Link href="/disclaimer" className="text-[#1428a0] hover:underline">
              Legal information
            </Link>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Get in touch
          </h2>
          <p>
            Spotted an error or have a suggestion? We’d love to hear from you — visit our{" "}
            <Link href="/contact" className="text-[#1428a0] hover:underline">
              Contact
            </Link>{" "}
            page.
          </p>
        </section>
      </div>
    </div>
  );
}
