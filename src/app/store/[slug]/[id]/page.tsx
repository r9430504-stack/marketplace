import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTheme } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import AddToCart from "@/components/store/AddToCart";
import CartFab from "@/components/store/CartFab";
import { parseVideo } from "@/lib/video";

const currencySymbols: Record<string, string> = {
  RUB: "₽", USD: "$", EUR: "€", KZT: "₸",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  return { title: product?.name ?? "Товар" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { store: true, category: true },
  });

  if (!product || product.store.slug !== slug) notFound();

  const store = product.store;
  const theme = getTheme(store.theme);
  const money = (v: number) => `${v.toLocaleString("ru-RU")} ${currencySymbols[product.currency] ?? product.currency}`;
  const onSale = product.oldPrice != null && product.oldPrice > product.price;
  const pct = onSale ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100) : 0;

  return (
    <div className={cn("min-h-screen", theme.bg, theme.text)}>
      {/* Top bar */}
      <div className={cn("border-b py-3 px-4", theme.border)}>
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm">
          <Link href={`/store/${slug}`} className="hover:underline opacity-70">← {store.name}</Link>
          <span className="opacity-30">/</span>
          <span className="opacity-50">{product.category.name}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Media */}
        <div className="relative space-y-3">
          {onSale && (
            <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow">
              −{pct}%
            </span>
          )}
          {(() => {
            const video = parseVideo(product.videoUrl);
            if (video.type === "youtube") {
              return (
                <div className="aspect-video rounded-2xl overflow-hidden">
                  <iframe src={video.embed} className="w-full h-full" allowFullScreen title={product.name} />
                </div>
              );
            }
            if (video.type === "file") {
              return (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={video.src} controls className="w-full rounded-2xl max-h-[420px]" />
              );
            }
            return product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt={product.name} className="w-full rounded-2xl object-cover aspect-square" />
            ) : (
              <div className={cn("w-full aspect-square rounded-2xl flex items-center justify-center text-7xl", theme.card)}>
                📦
              </div>
            );
          })()}
          {/* Если есть и видео, и фото — показываем фото под видео */}
          {parseVideo(product.videoUrl).type !== "none" && product.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.name} className="w-full rounded-2xl object-cover max-h-64" />
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {product.description && (
            <p className="mt-2 text-base opacity-70">{product.description}</p>
          )}

          <div className="flex items-end gap-3 mt-5 flex-wrap">
            <span className={cn("text-4xl font-extrabold", onSale && "text-red-500")}>
              {money(product.price)}
            </span>
            {onSale && (
              <span className="text-xl line-through opacity-40 mb-1">{money(product.oldPrice!)}</span>
            )}
          </div>
          {onSale && (
            <p className="text-sm text-green-600 font-semibold mt-1">
              Вы экономите {money(product.oldPrice! - product.price)}
            </p>
          )}

          <div className="mt-3">
            {product.inStock ? (
              <span className="text-sm text-green-600 font-medium">✓ В наличии</span>
            ) : (
              <span className="text-sm text-red-500 font-medium">Нет в наличии</span>
            )}
          </div>

          <div className="mt-6">
            <AddToCart
              big
              inStock={product.inStock}
              item={{
                id: product.id,
                name: product.name,
                price: product.price,
                currency: product.currency,
                image: product.images[0] ?? "",
                storeSlug: store.slug,
                storeName: store.name,
              }}
            />
          </div>

          {/* Подробное описание */}
          {product.details && (
            <div className={cn("mt-8 pt-6 border-t", theme.border)}>
              <h2 className="text-lg font-bold mb-2">Описание</h2>
              <p className="text-sm opacity-80 whitespace-pre-line leading-relaxed">{product.details}</p>
            </div>
          )}

          {/* Доставка */}
          {store.deliveryInfo && (
            <div className={cn("mt-6 pt-6 border-t", theme.border)}>
              <h2 className="text-lg font-bold mb-2">🚚 Доставка</h2>
              <p className="text-sm opacity-80 whitespace-pre-line leading-relaxed">{store.deliveryInfo}</p>
            </div>
          )}
        </div>
      </div>

      <CartFab />
    </div>
  );
}
