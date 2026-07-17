import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Galaxy Archive handles data and cookies. An unofficial, informational reference site.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "July 6, 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-4">
        <BackButton fallback="/" label="Back" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Last updated: {UPDATED}</p>

      <div className="mt-6 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <p>
            {SITE_NAME} (“we,” “us,” the “Site”) is an independent, informational reference
            resource about the history of Samsung Galaxy phones. This Privacy Policy explains what
            information is collected when you visit the Site, how it is used, and the choices you
            have. By using the Site you agree to the practices described here.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Information we collect
          </h2>
          <p>
            The Site does not require registration and we do not ask you to create an account or
            provide personal details to browse it. We do not knowingly collect names, phone numbers
            or payment information.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong>Server logs.</strong> Like most websites, our hosting provider automatically
              records standard technical data such as your IP address, browser type, device type,
              referring page and the date and time of your request. This is used for security,
              diagnostics and aggregate statistics.
            </li>
            <li>
              <strong>Cookies.</strong> Small files stored by your browser (see below).
            </li>
            <li>
              <strong>Information you send us.</strong> If you email us, we receive your email
              address and the contents of your message so we can reply.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Cookies and similar technologies
          </h2>
          <p>
            Cookies are small text files placed on your device. We use them to keep the Site
            working and to understand aggregate usage. You can block or delete cookies in your
            browser settings; some parts of the Site may then work less smoothly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Analytics
          </h2>
          <p>
            We may use privacy-respecting, aggregate analytics to understand how many people visit
            the Site and which pages are popular. Such statistics are reviewed only in aggregate and
            are not used to identify individual visitors.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Your choices and rights
          </h2>
          <p>
            Depending on where you live (for example, under the EU GDPR or the California CCPA), you
            may have the right to access, correct or delete personal data relating to you, to object
            to certain processing, and to withdraw consent. Because we hold very little personal
            data, most requests concern messages you have emailed us. To make a request, contact us
            using the details below and we will respond as required by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Children’s privacy
          </h2>
          <p>
            The Site is intended for a general audience and is not directed at children. We do not
            knowingly collect personal information from children. If you believe a child has
            provided us with personal data, contact us and we will delete it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Third-party links
          </h2>
          <p>
            The Site links to external websites (for example, retailers and manufacturer pages). We
            are not responsible for the privacy practices or content of those sites. Please review
            their policies separately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Data retention and security
          </h2>
          <p>
            We keep information only as long as needed for the purposes described here, and we take
            reasonable technical and organizational measures to protect it. No method of
            transmission or storage over the Internet is completely secure, however, so we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Changes to this policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. The “Last updated” date at the top
            reflects the latest revision. Continued use of the Site after changes take effect means
            you accept the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Contact</h2>
          <p>
            Questions about this policy or your data? Email us at{" "}
            <a href="mailto:r9430504@gmail.com" className="text-[#1428a0] hover:underline">
              r9430504@gmail.com
            </a>
            . See also our{" "}
            <Link href="/terms" className="text-[#1428a0] hover:underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/disclaimer" className="text-[#1428a0] hover:underline">
              Legal information
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
