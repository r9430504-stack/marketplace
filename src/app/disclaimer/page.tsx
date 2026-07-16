import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import BackButton from "@/components/BackButton";

export const metadata: Metadata = {
  title: "Legal information",
  description:
    "Legal information and disclaimer. An unofficial reference site, not affiliated with Samsung Electronics.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-4">
        <BackButton fallback="/" label="Back" />
      </div>
      <div className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 mb-8">
        <p className="font-bold text-amber-900 dark:text-amber-200">
          This is not the official Samsung site.
        </p>
        <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
          This project is not connected with, affiliated with, or endorsed by Samsung Electronics.
        </p>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Legal information</h1>

      <div className="mt-6 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            No affiliation
          </h2>
          <p>
            {SITE_NAME} is an independent, informational reference resource dedicated to smartphone
            history. The site is made by enthusiasts and is <strong>in no way connected</strong> with
            Samsung Electronics Co., Ltd., its subsidiaries or its partners. The company is not the
            author, sponsor or endorser of this project.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Trademarks
          </h2>
          <p>
            “Samsung,” “Galaxy” and the related names, logos and marks are registered trademarks of
            Samsung Electronics. They are mentioned on this site purely for reference and descriptive
            purposes — to indicate which devices are being discussed. All trademark rights belong to
            their respective owner.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Information and accuracy
          </h2>
          <p>
            Specifications, release dates and descriptions are compiled from open sources and provided
            as is. We strive for accuracy but do not guarantee that the data is complete or error-free.
            For current, official information, please check the manufacturer’s website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Images
          </h2>
          <p>
            The site does not host Samsung’s official marketing photos without the appropriate rights.
            If you believe any material infringes copyright, let us know at{" "}
            <a href="mailto:r9430504@gmail.com" className="text-[#1428a0] hover:underline">
              r9430504@gmail.com
            </a>{" "}
            — we will remove it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Disclaimer
          </h2>
          <p>
            All materials are provided “as is,” without any warranties. The site’s administrators bear
            no responsibility for decisions made on the basis of the information published here.
          </p>
        </section>
      </div>
    </div>
  );
}
