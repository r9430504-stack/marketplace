"use client";
import { getTheme, Theme } from "@/types";
import { cn } from "@/lib/utils";
import { ProductDraft } from "./StepProducts";

interface PreviewData {
  theme: Theme;
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

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {/* Browser chrome */}
      <div className="bg-gray-100 px-3 py-2 flex items-center gap-1.5 border-b border-gray-200">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-[10px] text-gray-400 truncate">
          мой-магазин.storebuilder.app
        </span>
      </div>

      {/* Store content (scaled mini version) */}
      <div className={cn("max-h-[70vh] overflow-y-auto", theme.bg, theme.text)}>
        {/* Hero banner */}
        <div className={cn("relative h-32 flex items-center justify-center bg-gradient-to-br", theme.preview)}>
          {data.bannerImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="relative z-10 text-center px-3" style={{ color: data.bannerTextColor || "#ffffff" }}>
            <h1 className="text-xl font-bold drop-shadow-lg">
              {data.name || "Название магазина"}
            </h1>
            {data.tagline && (
              <p className="mt-0.5 text-xs opacity-90 drop-shadow">{data.tagline}</p>
            )}
            {data.bannerText && (
              <p className="mt-0.5 text-[10px] opacity-80">{data.bannerText}</p>
            )}
          </div>
        </div>

        {/* Category nav */}
        {data.categories.length > 1 && (
          <div className={cn("flex gap-1.5 px-3 py-2 overflow-x-auto border-b", theme.border)}>
            {data.categories.map((cat, i) => (
              <span
                key={i}
                className={cn("px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap", theme.accent)}
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Products by category */}
        <div className="px-3 py-3 space-y-5">
          {data.categories.length === 0 && (
            <p className="text-center text-xs opacity-50 py-8">
              Добавьте категории и товары —<br />они появятся здесь
            </p>
          )}
          {data.categories.map((cat, ci) => {
            const catProducts = data.products.filter((p) => p.categoryIndex === ci);
            return (
              <section key={ci}>
                <h2 className="text-sm font-bold mb-2">{cat}</h2>
                {catProducts.length === 0 ? (
                  <p className="text-[10px] opacity-40">Нет товаров</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {catProducts.map((product, pi) => (
                      <div key={pi} className={cn("rounded-xl overflow-hidden relative", theme.card)}>
                        {hasDiscount(product) && (
                          <span className="absolute top-1 left-1 z-10 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                            -{discountPct(product)}%
                          </span>
                        )}
                        {product.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.images[0]} alt="" className="w-full h-20 object-cover" />
                        ) : (
                          <div className={cn("w-full h-20 flex items-center justify-center text-2xl", theme.bg)}>
                            📦
                          </div>
                        )}
                        <div className="p-2">
                          <p className="font-semibold text-[11px] truncate">{product.name || "Товар"}</p>
                          {product.description && (
                            <p className="text-[9px] opacity-60 line-clamp-1">{product.description}</p>
                          )}
                          <div className="flex items-baseline gap-1 mt-1">
                            <p className="text-xs font-bold">
                              {product.price ? Number(product.price).toLocaleString("ru-RU") : "0"}{" "}
                              {currencySymbols[product.currency] ?? product.currency}
                            </p>
                            {hasDiscount(product) && (
                              <span className="text-[9px] line-through opacity-50">
                                {Number(product.oldPrice).toLocaleString("ru-RU")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Delivery */}
        {data.deliveryInfo && (
          <div className={cn("border-t px-3 py-3 text-[10px]", theme.border)}>
            <p className="font-bold text-xs mb-1">🚚 Доставка</p>
            <p className="opacity-80 whitespace-pre-line">{data.deliveryInfo}</p>
          </div>
        )}

        {/* Contact footer */}
        {(data.contactPhone || data.contactEmail || data.contactAddress) && (
          <div className={cn("border-t px-3 py-3 text-[10px] space-y-1", theme.border)}>
            <p className="font-bold text-xs mb-1">Контакты</p>
            {data.contactPhone && <p>📞 {data.contactPhone}</p>}
            {data.contactEmail && <p>✉️ {data.contactEmail}</p>}
            {data.contactAddress && <p>📍 {data.contactAddress}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
