import Link from "next/link";
import { seriesMeta, hasRuTranslation, type Phone } from "@/lib/phones";
import type { Locale } from "@/lib/i18n";
import PhoneVisual from "./PhoneVisual";

export default function PhoneCard({ phone, locale = "en" }: { phone: Phone; locale?: Locale }) {
  const s = seriesMeta(phone.series);
  const href =
    locale === "ru" && hasRuTranslation(phone.slug)
      ? `/ru/phones/${phone.slug}`
      : `/phones/${phone.slug}`;
  return (
    <Link
      href={href}
      className="reveal group glass rounded-2xl relative hover:shadow-2xl hover:-translate-y-1.5 hover:z-10 transition-all duration-300 ease-out flex flex-col"
    >
      <div className="aspect-[4/5] rounded-t-2xl bg-white [clip-path:inset(-40%_-6%_0_-6%)]">
        <PhoneVisual
          phone={phone}
          thumb
          className="origin-bottom rounded-t-2xl group-hover:scale-[1.12] group-hover:-translate-y-2 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[11px] font-semibold ${s.accent}`}>{s.label}</span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">{phone.releaseDate}</span>
        </div>
        <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-tight">{phone.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{phone.tagline}</p>
        <div className="mt-auto pt-2 flex flex-wrap gap-1">
          <Spec>{phone.specs.display.split(",")[0]}</Spec>
          <Spec>{phone.specs.chipset.split("/")[0].trim()}</Spec>
        </div>
      </div>
    </Link>
  );
}

function Spec({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600">
      {children}
    </span>
  );
}
