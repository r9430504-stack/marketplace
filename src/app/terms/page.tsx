import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms governing use of Galaxy Archive — an unofficial, informational Samsung Galaxy reference site not affiliated with Samsung.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "July 6, 2026";

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-4">
        <BackButton fallback="/" label="Back" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Terms of Use</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Last updated: {UPDATED}</p>

      <div className="mt-6 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <p>
            Welcome to {SITE_NAME}. By accessing or using this Site you agree to these Terms of Use.
            If you do not agree, please do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Informational purpose
          </h2>
          <p>
            The Site is an independent, informational reference about the history and specifications
            of Samsung Galaxy phones. Content is provided “as is” for general information only. We
            strive for accuracy but do not warrant that specifications, dates or descriptions are
            complete, current or error-free. For official information, always check the
            manufacturer’s website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            No affiliation with Samsung
          </h2>
          <p>
            This Site is not connected with, affiliated with, or endorsed by Samsung Electronics.
            “Samsung,” “Galaxy” and related names and logos are trademarks of Samsung Electronics
            and are used here for reference and descriptive purposes only. See our{" "}
            <Link href="/disclaimer" className="text-[#1428a0] hover:underline">
              Legal information
            </Link>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Intellectual property
          </h2>
          <p>
            The Site’s original text and layout are the property of their respective authors. Product
            names, trademarks and imagery belong to their respective owners. You may share links to
            our pages and quote short excerpts with attribution, but you may not copy substantial
            portions of the Site without permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            External and affiliate links
          </h2>
          <p>
            The Site contains links to third-party websites, including retailers. Some outbound links
            may be affiliate links, which means we could earn a small commission if you make a
            purchase — at no extra cost to you. Such links never affect the information we publish.
            We are not responsible for the content, products or practices of third-party sites.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Acceptable use
          </h2>
          <p>
            You agree not to misuse the Site — for example, by attempting to disrupt it, access it
            through automated means that place an unreasonable load on it, or use it for any unlawful
            purpose.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Limitation of liability
          </h2>
          <p>
            To the fullest extent permitted by law, the Site’s administrators are not liable for any
            loss or damage arising from your use of, or reliance on, the information provided here.
            All materials are provided without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Changes
          </h2>
          <p>
            We may update these Terms from time to time. The “Last updated” date reflects the latest
            revision, and continued use of the Site means you accept the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Contact</h2>
          <p>
            Questions about these Terms? Email{" "}
            <a href="mailto:r9430504@gmail.com" className="text-[#1428a0] hover:underline">
              r9430504@gmail.com
            </a>
            . See also our{" "}
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
