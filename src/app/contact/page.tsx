import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Galaxy Archive — report a correction, ask a question or send feedback about our Samsung Galaxy reference archive.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-4">
        <BackButton fallback="/" label="Back" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact</h1>

      <div className="mt-6 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <p>
            Have a question, spotted an inaccuracy, or want to suggest a model or correction? We’re
            glad to hear from readers of {SITE_NAME}. The best way to reach us is by email.
          </p>
        </section>

        <section className="rounded-2xl glass p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Email</h2>
          <ul className="space-y-1">
            <li>
              <a href="mailto:r9430504@gmail.com" className="text-[#1428a0] hover:underline">
                r9430504@gmail.com
              </a>
            </li>
            <li>
              <a href="mailto:r9430504@icloud.com" className="text-[#1428a0] hover:underline">
                r9430504@icloud.com
              </a>
            </li>
          </ul>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            We read every message and usually reply within a few days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            What to include
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>The model or page your message is about (a link helps).</li>
            <li>A short description of the correction, question or suggestion.</li>
            <li>A source, if you’re reporting a specification fix.</li>
          </ul>
        </section>

        <section>
          <p>
            For copyright or legal matters, please see our{" "}
            <Link href="/disclaimer" className="text-[#1428a0] hover:underline">
              Legal information
            </Link>
            . For how we handle data, see the{" "}
            <Link href="/privacy" className="text-[#1428a0] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
