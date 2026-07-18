import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllPhones,
  getPhoneBySlug,
  relatedPhones,
  comparisonsFor,
  comparisonSlug,
  seriesNeighbours,
  seriesSlug,
  seriesMeta,
} from "@/lib/phones";
import PhoneVisual from "@/components/PhoneVisual";
import PhotoViewer from "@/components/PhotoViewer";
import PhoneCard from "@/components/PhoneCard";
import SpecTable from "@/components/SpecTable";
import BuyLinks from "@/components/BuyLinks";
import BackButton from "@/components/BackButton";
import FavoriteButton from "@/components/FavoriteButton";
import Comments from "@/components/Comments";
import { getCustomPhone } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getAllPhones().map((p) => ({ slug: p.slug }));
}

// Owner-added models aren't in the static set — render them on demand.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const phone = getPhoneBySlug(slug) ?? (await getCustomPhone(slug)) ?? undefined;
  if (!phone) return { title: "Model not found" };

  const title = `${phone.name} specs, price & release date (${phone.releaseYear})`;
  const description = `${phone.name} full specifications: released ${phone.releaseDate}. ${phone.specs.display} display, ${phone.specs.chipset}, ${phone.specs.mainCamera} camera, ${phone.specs.battery} battery${phone.specs.launchPrice ? `, launch price ${phone.specs.launchPrice}` : ""}. Where to buy and full history.`;
  return {
    title,
    description,
    alternates: { canonical: `/phones/${phone.slug}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function PhonePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const phone = getPhoneBySlug(slug) ?? (await getCustomPhone(slug)) ?? undefined;
  if (!phone) notFound();

  const s = seriesMeta(phone.series);
  const related = relatedPhones(phone);
  const comparisons = comparisonsFor(phone);
  const { prev, next } = seriesNeighbours(phone);
  const gallery = [phone.image, ...(phone.images ?? [])].filter(Boolean) as string[];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Catalog", item: `${SITE_URL}/phones` },
      {
        "@type": "ListItem",
        position: 3,
        name: phone.name,
        item: `${SITE_URL}/phones/${phone.slug}`,
      },
    ],
  };

  // Build a few Q&A from the phone's own data — indexable, and eligible for
  // FAQ rich results in Google.
  const faqs: { q: string; a: string }[] = [
    { q: `When was the ${phone.name} released?`, a: `The ${phone.name} was released in ${phone.releaseDate}.` },
    {
      q: `What are the ${phone.name}'s display specifications?`,
      a: `The ${phone.name} has a ${phone.specs.display}${
        phone.specs.refreshRate ? ` with a ${phone.specs.refreshRate} refresh rate` : ""
      }.`,
    },
    {
      q: `What chipset does the ${phone.name} use?`,
      a: `The ${phone.name} is powered by the ${phone.specs.chipset}, with ${phone.specs.ram} of RAM and ${phone.specs.storage} of storage.`,
    },
    {
      q: `What camera does the ${phone.name} have?`,
      a: `The ${phone.name}'s main camera is ${phone.specs.mainCamera}${
        phone.specs.frontCamera ? `, with a ${phone.specs.frontCamera} front camera` : ""
      }.`,
    },
    {
      q: `What is the battery capacity of the ${phone.name}?`,
      a: `The ${phone.name} has a ${phone.specs.battery} battery${
        phone.specs.charging ? ` and supports ${phone.specs.charging}` : ""
      }.`,
    },
    ...(phone.specs.waterResistance
      ? [
          {
            q: `Is the ${phone.name} water resistant?`,
            a: `The ${phone.name} has a ${phone.specs.waterResistance} rating.`,
          },
        ]
      : []),
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="mb-4">
        <BackButton fallback="/phones" label="Back" />
      </div>

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex flex-wrap gap-1">
        <Link href="/" className="hover:text-[#1428a0] dark:hover:text-blue-400">Home</Link>
        <span>/</span>
        <Link href="/phones" className="hover:text-[#1428a0] dark:hover:text-blue-400">Catalog</Link>
        <span>/</span>
        <Link
          href={`/series/${seriesSlug(phone.series)}`}
          className="hover:text-[#1428a0] dark:hover:text-blue-400"
        >
          {s.label}
        </Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300">{phone.name}</span>
      </nav>

      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="rise h-72 sm:h-96 rounded-3xl overflow-hidden glass" style={{ animationDelay: "60ms" }}>
          <PhotoViewer images={gallery} name={phone.name}>
            <PhoneVisual phone={phone} />
          </PhotoViewer>
        </div>
        <div className="rise" style={{ animationDelay: "180ms" }}>
          <span className={`text-sm font-semibold ${s.accent}`}>{s.label}</span>
          <div className="flex items-start justify-between gap-3 mt-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              {phone.name}
            </h1>
            <FavoriteButton slug={phone.slug} size="lg" className="shrink-0 border border-gray-200 dark:border-gray-700" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{phone.releaseDate}</p>
          <p className="text-lg text-gray-700 dark:text-gray-200 mt-4">{phone.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {phone.keyFeatures.map((f) => (
              <span
                key={f}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#eef1fb] text-[#1428a0] border border-[#dbe1f6] dark:bg-[#1b2338] dark:text-blue-300 dark:border-[#2b3a5e]"
              >
                {f}
              </span>
            ))}
          </div>

          {/* Quick facts */}
          <dl className="mt-6 grid grid-cols-2 gap-3">
            <QuickFact label="Display" value={phone.specs.display.split(",")[0]} />
            <QuickFact label="Chipset" value={phone.specs.chipset.split("/")[0].trim()} />
            <QuickFact label="Camera" value={phone.specs.mainCamera.split(",")[0]} />
            <QuickFact label="Battery" value={phone.specs.battery.split(",")[0]} />
          </dl>
        </div>
      </div>

      <BuyLinks name={phone.name} />

      {/* History */}
      <section className="reveal-up mt-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Model history</h2>
        <div className="prose-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
          {phone.history.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Specifications */}
      <section className="reveal-up mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Full specifications</h2>
        <SpecTable specs={phone.specs} year={phone.releaseYear} />
      </section>

      {/* Compare */}
      {comparisons.length > 0 && (
        <section className="reveal-up mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Compare the {phone.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {comparisons.map((c) => {
              const other = c.a.slug === phone.slug ? c.b : c.a;
              return (
                <Link
                  key={comparisonSlug(c.a, c.b)}
                  href={`/compare/${comparisonSlug(c.a, c.b)}`}
                  className="glass rounded-xl px-4 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {phone.name} <span className="text-gray-400 font-normal">vs</span> {other.name}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Side-by-side specifications →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="reveal-up mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {phone.name} — frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="glass rounded-xl px-4 py-3 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between gap-2">
                {f.q}
                <span className="text-gray-400 group-open:rotate-45 transition-transform duration-300">+</span>
              </summary>
              <p className="faq-a text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="reveal-up mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            More {s.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <PhoneCard key={p.slug} phone={p} />
            ))}
          </div>
        </section>
      )}

      {/* Comments */}
      <section id="discussion" className="reveal-up mt-12 scroll-mt-24">
        <Comments slug={phone.slug} locale="en" />
      </section>

      {/* Prev / next in the line */}
      {(prev || next) && (
        <nav className="reveal-up mt-12 grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/phones/${prev.slug}`}
              className="glass rounded-xl px-4 py-3 hover:shadow-md transition-all"
            >
              <span className="block text-[11px] uppercase tracking-wide text-gray-400">
                ← Previous {s.label}
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/phones/${next.slug}`}
              className="glass rounded-xl px-4 py-3 text-right hover:shadow-md transition-all"
            >
              <span className="block text-[11px] uppercase tracking-wide text-gray-400">
                Next {s.label} →
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{next.name}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">{label}</dt>
      <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{value}</dd>
    </div>
  );
}
