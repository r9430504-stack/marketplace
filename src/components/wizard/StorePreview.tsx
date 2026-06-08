"use client";
import { getTheme, getTemplate, Theme, Layout } from "@/types";
import { cn } from "@/lib/utils";
import { ProductDraft } from "./StepProducts";

interface PreviewData {
  theme: Theme;
  layout: Layout;
  name: string;
  tagline: string;
  bannerImage: string;
  bannerText: string;
  bannerTextColor: string;
  categories: string[];
  products: ProductDraft[];
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  deliveryInfo: string;
  aboutText: string;
}

const currencySymbols: Record<string, string> = { RUB: "₽", USD: "$", EUR: "€", KZT: "₸" };
const BENEFITS = ["🚚", "🛡️", "🎧", "💳"];

function hasDiscount(p: ProductDraft) {
  return !!p.oldPrice && Number(p.oldPrice) > Number(p.price) && Number(p.price) > 0;
}

export default function StorePreview({ data }: { data: PreviewData }) {
  const theme = getTheme(data.theme);
  const template = getTemplate(data.layout);
  const textColor = data.bannerTextColor || "#ffffff";

  function MiniCard({ p, big }: { p: ProductDraft; big?: boolean }) {
    return (
      <div className={cn("rounded-lg overflow-hidden relative", theme.card)}>
        {hasDiscount(p) && <span className="absolute top-1 left-1 z-10 bg-red-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-full">SALE</span>}
        {p.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images[0]} alt="" className={cn("w-full object-cover", big ? "h-24" : "h-16")} />
        ) : (
          <div className={cn("w-full flex items-center justify-center", big ? "h-24 text-2xl" : "h-16 text-xl", theme.bg)}>📦</div>
        )}
        <div className="p-1.5">
          <p className="text-[9px] font-semibold truncate">{p.name || "Товар"}</p>
          <p className="text-[9px] font-bold">{p.price ? Number(p.price).toLocaleString("ru-RU") : "0"} {currencySymbols[p.currency] ?? p.currency}</p>
        </div>
      </div>
    );
  }

  function Grid({ cols = 2, big }: { cols?: number; big?: boolean }) {
    return (
      <div className="space-y-3">
        {data.categories.length === 0 && (
          <p className="text-center text-[10px] opacity-50 py-6">Добавьте товары —<br />появятся здесь</p>
        )}
        {data.categories.map((cat, ci) => (
          <div key={ci}>
            <p className="text-[11px] font-bold mb-1.5">{cat}</p>
            <div className={cn("grid gap-1.5", cols === 1 ? "grid-cols-1" : cols === 3 ? "grid-cols-3" : "grid-cols-2")}>
              {data.products.filter((p) => p.categoryIndex === ci).map((p, i) => <MiniCard key={i} p={p} big={big} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  let body: React.ReactNode;

  if (template === "classic") {
    body = (
      <>
        <div className={cn("flex items-center justify-between px-2 py-1 text-[8px]", theme.accent)}>
          <span>{data.contactPhone || "📞 телефон"}</span><span>RU</span>
        </div>
        <div className={cn("flex items-center justify-between px-2 py-1.5 border-b", theme.border)}>
          <span className="text-sm font-extrabold">{data.name || "Магазин"}</span>
          {data.contactAddress && <span className="text-[8px] opacity-60">📍 адрес</span>}
        </div>
        <div className={cn("flex items-center gap-2 px-2 py-1.5 text-[9px] font-medium", theme.accent)}>
          <span className="font-bold">☰ Каталог</span><span>Товары</span><span>Контакты</span><span className="ml-auto">🔍</span>
        </div>
        <div className={cn("relative h-16 flex items-center justify-center bg-gradient-to-br", theme.preview)}>
          {data.bannerImage && (<>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-black/30" /></>)}
          <p className="relative z-10 text-sm font-extrabold drop-shadow" style={{ color: textColor }}>{data.bannerText || data.name || "Магазин"}</p>
        </div>
        <div className={cn("flex justify-around px-2 py-2 border-b", theme.border)}>
          {BENEFITS.map((b, i) => <span key={i} className="text-base">{b}</span>)}
        </div>
        <div className="px-2 py-2"><Grid cols={2} /></div>
      </>
    );
  } else if (template === "corporate") {
    body = (
      <>
        <div className={cn("flex items-center justify-between px-2 py-1.5 border-b", theme.border)}>
          <span className="text-xs font-extrabold uppercase">{data.name || "Бренд"}</span>
          <span className="flex gap-2 text-[8px] opacity-70">Главная Товары Контакты</span>
        </div>
        <div className={cn("relative h-28 flex items-end justify-center bg-gradient-to-br", theme.preview)}>
          {data.bannerImage && (<>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /></>)}
          <p className="relative z-10 pb-3 px-2 text-center font-serif text-sm font-bold uppercase tracking-wide drop-shadow" style={{ color: textColor }}>
            {data.bannerText || data.tagline || data.name || "Магазин"}
          </p>
        </div>
        <div className={cn("px-2 py-3 border-b", theme.border)}>
          <p className="text-center font-serif text-xs font-bold mb-2">Почему мы?</p>
          <div className="grid grid-cols-4 gap-1 text-center">
            {BENEFITS.map((b, i) => <div key={i} className={cn("rounded-md py-1.5", theme.card)}><span className="text-base">{b}</span></div>)}
          </div>
        </div>
        <div className="px-2 py-2">
          {data.categories.map((cat, ci) => (
            <div key={ci} className="mb-3">
              <p className="text-center font-serif text-[11px] font-bold mb-1.5">{cat}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {data.products.filter((p) => p.categoryIndex === ci).map((p, i) => <MiniCard key={i} p={p} />)}
              </div>
            </div>
          ))}
          {data.categories.length === 0 && <p className="text-center text-[10px] opacity-50 py-4">Добавьте товары</p>}
        </div>
      </>
    );
  } else {
    body = (
      <>
        <div className="px-2 py-2">
          <div className={cn("rounded-full px-3 py-1.5 flex items-center justify-between shadow-sm", theme.card)}>
            <span className="text-[11px] font-bold">{data.name || "Магазин"}</span>
            <span className="flex gap-2 text-[8px] opacity-60">Товары Контакты 🛒</span>
          </div>
        </div>
        <div className="px-3 py-6 text-center">
          <p className="text-lg font-extrabold tracking-tight leading-tight">{data.bannerText || data.tagline || data.name || "Магазин"}</p>
          {data.tagline && data.bannerText && <p className="text-[10px] opacity-60 mt-1">{data.tagline}</p>}
          <span className={cn("inline-block mt-3 px-4 py-1.5 rounded-full text-[10px] font-semibold", theme.accent)}>Смотреть товары</span>
        </div>
        {data.bannerImage && (
          <div className="px-3 pb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.bannerImage} alt="" className="w-full h-24 object-cover rounded-2xl" />
          </div>
        )}
        <div className="px-3 py-2"><Grid cols={1} big /></div>
      </>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-700">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-[10px] text-gray-400 truncate">мой-магазин.storebuilder.app</span>
      </div>
      <div className={cn("max-h-[70vh] overflow-y-auto", theme.bg, theme.text)}>{body}</div>
    </div>
  );
}
