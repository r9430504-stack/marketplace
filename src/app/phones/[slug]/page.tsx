import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllPhones,
  getPhoneBySlug,
  relatedPhones,
  seriesMeta,
} from "@/lib/phones";
import PhoneVisual from "@/components/PhoneVisual";
import PhotoViewer from "@/components/PhotoViewer";
import PhoneCard from "@/components/PhoneCard";
import SpecTable from "@/components/SpecTable";
import BuyLinks from "@/components/BuyLinks";
import AdSlot from "@/components/AdSlot";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getAllPhones().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const phone = getPhoneBySlug(slug);
  if (!phone) return { title: "Model not found" };

  const title = `${phone.name} — specifications and history`;
  const description = `${phone.name} (${phone.releaseDate}): ${phone.tagline} ${phone.specs.display} display, ${phone.specs.chipset}, ${phone.specs.mainCamera} camera, ${phone.specs.battery} battery.`;
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
  const phone = getPhoneBySlug(slug);
  if (!phone) notFound();

  const s = seriesMeta(phone.series);
  const related = relatedPhones(phone);
  const gallery = [phone.image, ...(phone.images ?? [])].filter(Boolean) as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: phone.name,
    brand: { "@type": "Brand", name: "Samsung" },
    category: s.label,
    releaseDate: String(phone.releaseYear),
    description: phone.tagline,
    url: `${SITE_URL}/phones/${phone.slug}`,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex flex-wrap gap-1">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
        <span>/</span>
        <Link href="/phones" className="hover:text-blue-600 dark:hover:text-blue-400">Catalog</Link>
        <span>/</span>
        <Link
          href={`/phones?series=${encodeURIComponent(phone.series)}`}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          {s.label}
        </Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300">{phone.name}</span>
      </nav>

      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="h-72 sm:h-96 rounded-3xl overflow-hidden glass">
          <PhotoViewer images={gallery} name={phone.name}>
            <PhoneVisual phone={phone} />
          </PhotoViewer>
        </div>
        <div>
          <span className={`text-sm font-semibold ${s.accent}`}>{s.label}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
            {phone.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{phone.releaseDate}</p>
          <p className="text-lg text-gray-700 dark:text-gray-200 mt-4">{phone.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {phone.keyFeatures.map((f) => (
              <span
                key={f}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/55 backdrop-blur-md text-blue-700 border border-white/60"
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

      <AdSlot />

      {/* History */}
      <section className="mt-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Model history</h2>
        <div className="prose-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
          {phone.history.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Specifications */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Full specifications</h2>
        <SpecTable specs={phone.specs} />
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
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
