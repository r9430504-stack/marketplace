import Link from "next/link";
import { seriesMeta, type Phone } from "@/lib/phones";
import type { Locale } from "@/lib/i18n";
import PhoneVisual from "./PhoneVisual";
import FavoriteButton from "./FavoriteButton";

export default function PhoneCard({
  phone,
  locale = "en",
  badge,
}: {
  phone: Phone;
  locale?: Locale;
  badge?: string;
}) {
  const s = seriesMeta(phone.series);
  const href = locale === "ru" ? `/ru/phones/${phone.slug}` : `/phones/${phone.slug}`;
  return (
    <Link
      href={href}
      className="reveal group glass rounded-2xl relative hover:shadow-[0_22px_44px_-14px_rgba(20,40,160,0.38)] hover:-translate-y-1.5 hover:z-10 transition-all duration-300 ease-out flex flex-col"
    >
      {/* The emerge transform lives on this wrapper (not the <img>) because the
       * image's `img-fade` class sets `transition: opacity`, which would clobber
       * a transform transition on the same element and make it jump instantly. */}
      {badge && (
        <span className="absolute top-2 left-2 z-20 inline-flex items-center gap-1 rounded-full bg-[#1428a0] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.6l5.8-.8z" />
          </svg>
          {badge}
        </span>
      )}
      <FavoriteButton slug={phone.slug} className="absolute top-2 right-2 z-20 bg-white/85 dark:bg-black/50 backdrop-blur" />
      <div className="aspect-[4/5] rounded-t-2xl bg-white [clip-path:inset(-8%_-2%_0_-2%)] origin-bottom group-hover:scale-[1.03] group-hover:-translate-y-0.5 transition-transform duration-[1400ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
        <PhoneVisual phone={phone} thumb className="rounded-t-2xl" />
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
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
      {children}
    </span>
  );
}
