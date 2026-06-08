import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeConfig } from "@/types";
import AddToCart from "@/components/store/AddToCart";

const currencySymbols: Record<string, string> = {
  RUB: "₽", USD: "$", EUR: "€", KZT: "₸",
};

export type ProductLike = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  currency: string;
  images: string[];
  inStock: boolean;
  createdAt?: string | Date;
};

interface Props {
  product: ProductLike;
  theme: ThemeConfig;
  slug: string;
  storeName: string;
  variant?: "card" | "compact" | "list" | "showcase";
  index?: number;
}

export default function ProductCard({ product, theme, slug, storeName, variant = "card", index = 0 }: Props) {
  const money = (v: number) => `${v.toLocaleString("ru-RU")} ${currencySymbols[product.currency] ?? product.currency}`;
  const onSale = product.oldPrice != null && product.oldPrice > product.price;
  const pct = onSale ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100) : 0;
  const href = `/store/${slug}/${product.id}`;
  const isNew = product.createdAt
    ? Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000
    : false;
  const newBadge = isNew && (
    <span className="absolute top-2 right-2 z-10 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
      НОВОЕ
    </span>
  );

  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency,
    image: product.images[0] ?? "",
    storeSlug: slug,
    storeName,
  };

  const saleBadge = onSale && (
    <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
      −{pct}%
    </span>
  );
  const oosOverlay = !product.inStock && (
    <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center">
      <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">Нет в наличии</span>
    </div>
  );
  const placeholder = (h: string) => (
    <div className={cn("w-full flex items-center justify-center text-5xl", h, theme.bg)}>📦</div>
  );

  /* ─── LIST (горизонтальная строка) ─── */
  if (variant === "list") {
    return (
      <Link href={href} className={cn("group flex gap-4 rounded-2xl overflow-hidden transition-all hover:shadow-lg", theme.card)}>
        <div className="relative w-28 sm:w-40 shrink-0">
          {saleBadge}
          {newBadge}
          {oosOverlay}
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover aspect-square" />
          ) : placeholder("h-full aspect-square")}
        </div>
        <div className="flex flex-col flex-1 py-3 pr-4 min-w-0">
          <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
          {product.description && <p className="text-sm opacity-60 mt-1 line-clamp-2">{product.description}</p>}
          <div className="flex items-end gap-2 mt-auto pt-2 flex-wrap">
            <span className={cn("text-xl font-extrabold", onSale && "text-red-500")}>{money(product.price)}</span>
            {onSale && <span className="text-sm line-through opacity-40 mb-0.5">{money(product.oldPrice!)}</span>}
            <span className="ml-auto"><AddToCart inStock={product.inStock} item={cartItem} /></span>
          </div>
        </div>
      </Link>
    );
  }

  /* ─── SHOWCASE (крупный чередующийся блок) ─── */
  if (variant === "showcase") {
    const reverse = index % 2 === 1;
    return (
      <Link href={href} className={cn("group grid sm:grid-cols-2 gap-0 rounded-3xl overflow-hidden transition-all hover:shadow-xl", theme.card)}>
        <div className={cn("relative", reverse && "sm:order-2")}>
          {saleBadge}
          {newBadge}
          {oosOverlay}
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-full h-64 sm:h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : placeholder("h-64 sm:h-full min-h-[16rem]")}
        </div>
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold">{product.name}</h3>
          {product.description && <p className="opacity-70 mt-2">{product.description}</p>}
          <div className="flex items-end gap-3 mt-4 flex-wrap">
            <span className={cn("text-3xl font-extrabold", onSale && "text-red-500")}>{money(product.price)}</span>
            {onSale && <span className="text-lg line-through opacity-40 mb-1">{money(product.oldPrice!)}</span>}
          </div>
          <div className="mt-4">
            <AddToCart inStock={product.inStock} item={cartItem} big />
          </div>
        </div>
      </Link>
    );
  }

  /* ─── CARD / COMPACT (вертикальная карточка) ─── */
  const compact = variant === "compact";
  return (
    <Link href={href} className={cn("group rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col", theme.card)}>
      <div className="relative overflow-hidden">
        {saleBadge}
        {newBadge}
        {oosOverlay}
        {product.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className={cn("w-full object-cover transition-transform duration-300 group-hover:scale-110", compact ? "h-32 sm:h-36" : "h-44 md:h-52")}
          />
        ) : placeholder(compact ? "h-32 sm:h-36" : "h-44 md:h-52")}
      </div>
      <div className={cn("flex flex-col flex-1", compact ? "p-2.5" : "p-4")}>
        <h3 className={cn("font-semibold leading-snug line-clamp-2", compact ? "text-sm" : "text-base")}>{product.name}</h3>
        {!compact && product.description && (
          <p className="text-sm opacity-60 mt-1 line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-end gap-2 mt-2 flex-wrap">
          <span className={cn("font-extrabold", compact ? "text-base" : "text-xl", onSale && "text-red-500")}>{money(product.price)}</span>
          {onSale && <span className={cn("line-through opacity-40 mb-0.5", compact ? "text-xs" : "text-sm")}>{money(product.oldPrice!)}</span>}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 mt-auto pt-2">
          {!compact && (
            <span className={cn("text-xs font-semibold px-3 py-1.5 rounded-full border", theme.border)}>
              Подробнее →
            </span>
          )}
          <AddToCart inStock={product.inStock} item={cartItem} className={compact ? "w-full justify-center" : ""} />
        </div>
      </div>
    </Link>
  );
}
