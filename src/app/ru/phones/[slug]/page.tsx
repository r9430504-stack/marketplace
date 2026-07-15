import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPhoneBySlug,
  relatedPhones,
  comparisonsFor,
  comparisonSlug,
  seriesNeighbours,
  hasRuTranslation,
  localizedPhone,
  ruTranslatedSlugs,
  seriesMeta,
} from "@/lib/phones";
import PhoneVisual from "@/components/PhoneVisual";
import PhotoViewer from "@/components/PhotoViewer";
import PhoneCard from "@/components/PhoneCard";
import SpecTable from "@/components/SpecTable";
import BuyLinks from "@/components/BuyLinks";
import BackButton from "@/components/BackButton";
import AdSlot from "@/components/AdSlot";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return ruTranslatedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const base = getPhoneBySlug(slug);
  if (!base) return { title: "Модель не найдена" };
  const phone = localizedPhone(base, "ru");
  const title = `${phone.name} — характеристики и история`;
  const description = `${phone.name} (${phone.releaseDate}): ${phone.tagline} Экран ${phone.specs.display}, ${phone.specs.chipset}, камера ${phone.specs.mainCamera}, аккумулятор ${phone.specs.battery}.`;
  return {
    title,
    description,
    alternates: {
      canonical: `/ru/phones/${slug}`,
      languages: { en: `/phones/${slug}`, ru: `/ru/phones/${slug}` },
    },
    openGraph: { title, description, type: "article", locale: "ru_RU" },
  };
}

function faqsRu(phone: ReturnType<typeof localizedPhone>) {
  const s = phone.specs;
  const list: { q: string; a: string }[] = [
    { q: `Когда вышел ${phone.name}?`, a: `${phone.name} вышел в ${phone.releaseDate}.` },
    {
      q: `Какой экран у ${phone.name}?`,
      a: `У ${phone.name} экран ${s.display}${s.refreshRate ? ` с частотой обновления ${s.refreshRate}` : ""}.`,
    },
    {
      q: `Какой процессор в ${phone.name}?`,
      a: `${phone.name} работает на ${s.chipset}, с ${s.ram} оперативной памяти и ${s.storage} накопителя.`,
    },
    {
      q: `Какая камера у ${phone.name}?`,
      a: `Основная камера ${phone.name} — ${s.mainCamera}${s.frontCamera ? `, фронтальная — ${s.frontCamera}` : ""}.`,
    },
    {
      q: `Какой аккумулятор у ${phone.name}?`,
      a: `У ${phone.name} аккумулятор ${s.battery}${s.charging ? `, поддерживается ${s.charging}` : ""}.`,
    },
  ];
  if (s.waterResistance)
    list.push({ q: `Защищён ли ${phone.name} от воды?`, a: `${phone.name} имеет защиту ${s.waterResistance}.` });
  return list;
}

export default async function PhonePageRu({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = getPhoneBySlug(slug);
  if (!base || !hasRuTranslation(slug)) notFound();
  const phone = localizedPhone(base, "ru");

  const s = seriesMeta(phone.series);
  const related = relatedPhones(base);
  const comparisons = comparisonsFor(base);
  const { prev, next } = seriesNeighbours(base);
  const gallery = [phone.image, ...(phone.images ?? [])].filter(Boolean) as string[];
  const faqs = faqsRu(phone);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const modelHref = (p: { slug: string }) =>
    hasRuTranslation(p.slug) ? `/ru/phones/${p.slug}` : `/phones/${p.slug}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="mb-4">
        <BackButton fallback="/ru/phones" label="Назад" />
      </div>

      <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex flex-wrap gap-1">
        <Link href="/ru" className="hover:text-[#1428a0]">Главная</Link>
        <span>/</span>
        <Link href="/ru/phones" className="hover:text-[#1428a0]">Каталог</Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300">{phone.name}</span>
      </nav>

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
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#eef1fb] text-[#1428a0] border border-[#dbe1f6] dark:bg-[#1b2338] dark:text-blue-300 dark:border-[#2b3a5e]"
              >
                {f}
              </span>
            ))}
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <QuickFact label="Экран" value={phone.specs.display.split(",")[0]} />
            <QuickFact label="Процессор" value={phone.specs.chipset.split("/")[0].trim()} />
            <QuickFact label="Камера" value={phone.specs.mainCamera.split(",")[0]} />
            <QuickFact label="Аккумулятор" value={phone.specs.battery.split(",")[0]} />
          </dl>
        </div>
      </div>

      <BuyLinks name={phone.name} locale="ru" />

      <AdSlot />

      <section className="mt-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">История модели</h2>
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
          {phone.history.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Полные характеристики</h2>
        <SpecTable specs={phone.specs} locale="ru" />
      </section>

      {comparisons.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Сравнить {phone.name}</h2>
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
                    Характеристики бок о бок →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {phone.name} — частые вопросы
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="glass rounded-xl px-4 py-3 group">
              <summary className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between gap-2">
                {f.q}
                <span className="text-gray-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ещё {s.label}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <PhoneCard key={p.slug} phone={p} locale="ru" />
            ))}
          </div>
        </section>
      )}

      {(prev || next) && (
        <nav className="mt-12 grid grid-cols-2 gap-3">
          {prev ? (
            <Link href={modelHref(prev)} className="glass rounded-xl px-4 py-3 hover:shadow-md transition-all">
              <span className="block text-[11px] uppercase tracking-wide text-gray-400">← Предыдущий {s.label}</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={modelHref(next)} className="glass rounded-xl px-4 py-3 text-right hover:shadow-md transition-all">
              <span className="block text-[11px] uppercase tracking-wide text-gray-400">Следующий {s.label} →</span>
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
