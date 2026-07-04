import Link from "next/link";
import { seriesMeta, type Phone } from "@/lib/phones";
import PhoneVisual from "./PhoneVisual";

export default function PhoneCard({ phone }: { phone: Phone }) {
  const s = seriesMeta(phone.series);
  return (
    <Link
      href={`/phones/${phone.slug}`}
      className="reveal group glass rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col"
    >
      <div className="aspect-[4/5] overflow-hidden bg-white">
        <PhoneVisual phone={phone} className="group-hover:scale-[1.03] transition-transform duration-300" />
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
