"use client";
import { getTheme, getLayout, Theme, Layout } from "@/types";
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

const currencySymbols: Record<string, string> = {
  RUB: "₽", USD: "$", EUR: "€", KZT: "₸",
};

function hasDiscount(p: ProductDraft): boolean {
  const oldP = Number(p.oldPrice);
  const price = Number(p.price);
  return !!p.oldPrice && oldP > price && price > 0;
}
function discountPct(p: ProductDraft): number {
  const oldP = Number(p.oldPrice);
  const price = Number(p.price);
  return Math.round(((oldP - price) / oldP) * 100);
}

export default function StorePreview({ data }: { data: PreviewData }) {
  const theme = getTheme(data.theme);
  const layout = getLayout(data.layout);
  const textColor = data.bannerTextColor || "#ffffff";

  function MiniCard({ product, big, compact }: { product: ProductDraft; big?: boolean; compact?: boolean }) {
    return (
      <div className={cn("rounded-xl overflow-hidden relative", theme.card)}>
        {hasDiscount(product) && (
          <span className="absolute top-1 left-1 z-10 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
            −{discountPct(product)}%
          </span>
        )}
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt="" className={cn("w-full object-cover", big ? "h-28" : compact ? "h-14" : "h-20")} />
        ) : (
          <div className={cn("w-full flex items-center justify-center", big ? "h-28 text-3xl" : compact ? "h-14 text-lg" : "h-20 text-2xl", theme.bg)}>📦</div>
        )}
        <div className={compact ? "p-1.5" : "p-2"}>
          <p className={cn("font-semibold truncate", compact ? "text-[9px]" : "text-[11px]")}>{product.name || "Товар"}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <p className={cn("font-bold", compact ? "text-[9px]" : "text-xs")}>
              {product.price ? Number(product.price).toLocaleString("ru-RU") : "0"} {currencySymbols[product.currency] ?? product.currency}
            </p>
            {hasDiscount(product) && (
              <span className="text-[8px] line-through opacity-50">{Number(product.oldPrice).toLocaleString("ru-RU")}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  function MiniGrid({ items }: { items: ProductDraft[] }) {
    if (items.length === 0) return <p className="text-[10px] opacity-40">Нет товаров</p>;
    switch (layout.grid) {
      case "compact":
        return <div className="grid grid-cols-3 gap-1.5">{items.map((p, i) => <MiniCard key={i} product={p} compact />)}</div>;
      case "cards2":
        return <div className="grid grid-cols-1 gap-2">{items.map((p, i) => <MiniCard key={i} product={p} big />)}</div>;
      case "list":
        return (
          <div className="flex flex-col gap-1.5">
            {items.map((p, i) => (
              <div key={i} className={cn("flex gap-2 rounded-lg overflow-hidden", theme.card)}>
                {p.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt="" className="w-12 h-12 object-cover shrink-0" />
                ) : <div className={cn("w-12 h-12 flex items-center justify-center text-base shrink-0", theme.bg)}>📦</div>}
                <div className="py-1 pr-2 min-w-0">
                  <p className="text-[10px] font-semibold truncate">{p.name || "Товар"}</p>
                  <p className="text-[9px] font-bold">{p.price ? Number(p.price).toLocaleString("ru-RU") : "0"} {currencySymbols[p.currency] ?? p.currency}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case "showcase":
        return (
          <div className="flex flex-col gap-2">
            {items.map((p, i) => (
              <div key={i} className={cn("grid grid-cols-2 rounded-lg overflow-hidden", theme.card)}>
                {p.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt="" className={cn("w-full h-16 object-cover", i % 2 ? "order-2" : "")} />
                ) : <div className={cn("w-full h-16 flex items-center justify-center text-xl", theme.bg, i % 2 ? "order-2" : "")}>📦</div>}
                <div className="p-2 flex flex-col justify-center">
                  <p className="text-[10px] font-bold truncate">{p.name || "Товар"}</p>
                  <p className="text-[10px] font-bold">{p.price ? Number(p.price).toLocaleString("ru-RU") : "0"} {currencySymbols[p.currency] ?? p.currency}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case "row":
        return (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {items.map((p, i) => <div key={i} className="w-24 shrink-0"><MiniCard product={p} /></div>)}
          </div>
        );
      case "cards3":
      default:
        return <div className="grid grid-cols-2 gap-1.5">{items.map((p, i) => <MiniCard key={i} product={p} />)}</div>;
    }
  }

  // HERO mini
  function MiniHero() {
    if (layout.hero === "minimal") {
      return (
        <div className={cn("border-b px-3 py-4", theme.border)}>
          <p className="text-base font-extrabold">{data.name || "Название магазина"}</p>
          {data.tagline && <p className="text-[10px] opacity-60">{data.tagline}</p>}
        </div>
      );
    }
    if (layout.hero === "split") {
      return (
        <div className="grid grid-cols-2">
          <div className={cn("relative h-24 bg-gradient-to-br", theme.preview)}>
            {data.bannerImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
          </div>
          <div className={cn("h-24 flex flex-col justify-center px-2", theme.bg)}>
            <p className="text-sm font-extrabold leading-tight">{data.name || "Магазин"}</p>
            {data.tagline && <p className="text-[9px] opacity-60">{data.tagline}</p>}
          </div>
        </div>
      );
    }
    const tall = layout.hero === "fullscreen" || layout.hero === "big" || layout.hero === "overlay";
    const bottom = layout.hero === "overlay";
    return (
      <div className={cn("relative flex bg-gradient-to-br", tall ? "h-32" : "h-20", bottom ? "items-end" : "items-center justify-center", theme.preview)}>
        {data.bannerImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className={cn("absolute inset-0", bottom ? "bg-gradient-to-t from-black/60 to-transparent" : "bg-black/20")} />
          </>
        )}
        <div className={cn("relative z-10 px-3", bottom ? "pb-2 text-left w-full" : "text-center")} style={{ color: textColor }}>
          <p className={cn("font-extrabold drop-shadow", tall ? "text-lg" : "text-sm")}>{data.name || "Название магазина"}</p>
          {data.tagline && <p className="text-[10px] opacity-90 drop-shadow">{data.tagline}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Browser chrome */}
      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 flex items-center gap-1.5 border-b border-gray-200 dark:border-gray-700">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-[10px] text-gray-400 truncate">мой-магазин.storebuilder.app</span>
        <span className="ml-auto text-[9px] text-gray-400">{layout.emoji} {layout.nameRu}</span>
      </div>

      <div className={cn("max-h-[70vh] overflow-y-auto", theme.bg, theme.text)}>
        <MiniHero />

        {/* Nav */}
        {layout.nav === "topbar" && (
          <div className={cn("flex gap-2 px-3 py-2 border-b text-[10px] font-medium", theme.border)}>
            <span className={cn("px-2 py-0.5 rounded-full", theme.accent)}>Товары</span>
            {data.aboutText && <span className="px-2 py-0.5 opacity-60">О нас</span>}
            <span className="px-2 py-0.5 opacity-60">Контакты</span>
          </div>
        )}
        {layout.nav === "pills" && data.categories.length > 1 && (
          <div className={cn("flex gap-1.5 px-3 py-2 overflow-x-auto border-b", theme.border)}>
            {data.categories.map((cat, i) => (
              <span key={i} className={cn("px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap", theme.accent)}>{cat}</span>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="px-3 py-3">
          {layout.nav === "sidebar" ? (
            <div className="grid grid-cols-[64px_1fr] gap-2">
              <div className={cn("rounded-lg p-2 h-fit", theme.card)}>
                <p className="text-[9px] font-bold mb-1">Меню</p>
                {data.categories.map((cat, i) => <p key={i} className="text-[9px] opacity-70 truncate">{cat}</p>)}
              </div>
              <div className="space-y-4">
                {(data.categories.length ? data.categories : [""]).map((cat, ci) => (
                  <div key={ci}>
                    {cat && <p className="text-[11px] font-bold mb-1">{cat}</p>}
                    <MiniGrid items={data.products.filter((p) => p.categoryIndex === ci)} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {data.categories.length === 0 && (
                <p className="text-center text-[10px] opacity-50 py-6">Добавьте категории и товары —<br />они появятся здесь</p>
              )}
              {data.categories.map((cat, ci) => (
                <section key={ci}>
                  <p className="text-[11px] font-bold mb-1.5">{cat}</p>
                  <MiniGrid items={data.products.filter((p) => p.categoryIndex === ci)} />
                </section>
              ))}
            </div>
          )}

          {data.aboutText && (
            <div className={cn("border-t mt-3 pt-2", theme.border)}>
              <p className="text-[11px] font-bold mb-0.5">О нас</p>
              <p className="text-[9px] opacity-70 whitespace-pre-line line-clamp-3">{data.aboutText}</p>
            </div>
          )}
          {data.deliveryInfo && (
            <div className={cn("border-t mt-3 pt-2", theme.border)}>
              <p className="text-[11px] font-bold mb-0.5">🚚 Доставка</p>
              <p className="text-[9px] opacity-70 whitespace-pre-line line-clamp-2">{data.deliveryInfo}</p>
            </div>
          )}
          {(data.contactPhone || data.contactEmail || data.contactAddress) && (
            <div className={cn("border-t mt-3 pt-2 text-[9px] space-y-0.5", theme.border)}>
              <p className="text-[11px] font-bold mb-0.5">Контакты</p>
              {data.contactPhone && <p>📞 {data.contactPhone}</p>}
              {data.contactEmail && <p>✉️ {data.contactEmail}</p>}
              {data.contactAddress && <p>📍 {data.contactAddress}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
