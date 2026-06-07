import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTheme } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({ where: { slug } });
  return { title: store?.name ?? "Магазин", description: store?.tagline };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      categories: {
        include: { products: { orderBy: { createdAt: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!store) notFound();

  const theme = getTheme(store.theme);
  const currencySymbols: Record<string, string> = {
    RUB: "₽", USD: "$", EUR: "€", KZT: "₸",
  };

  const totalProducts = store.categories.reduce((n, c) => n + c.products.length, 0);
  const money = (v: number, cur: string) =>
    `${v.toLocaleString("ru-RU")} ${currencySymbols[cur] ?? cur}`;

  return (
    <div className={cn("min-h-screen", theme.bg, theme.text)}>
      {/* Hero banner */}
      <div className={cn("relative h-72 md:h-96 flex items-center justify-center bg-gradient-to-br overflow-hidden", theme.preview)}>
        {store.bannerImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={store.bannerImage}
              alt={store.name}
              className="absolute inset-0 w-full h-full object-cover scale-105"
            />
            {/* лёгкая подложка для читаемости текста */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          </>
        )}
        <div className="relative z-10 text-center px-4" style={{ color: store.bannerTextColor || "#ffffff" }}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            {store.name}
          </h1>
          {store.tagline && (
            <p className="mt-3 text-lg md:text-xl opacity-95 drop-shadow font-medium">{store.tagline}</p>
          )}
          {store.bannerText && (
            <p className="mt-1 text-sm md:text-base opacity-85 drop-shadow">{store.bannerText}</p>
          )}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-sm font-medium">
            🛍️ {totalProducts} товаров · {store.categories.length} категорий
          </div>
        </div>
      </div>

      {/* Categories nav */}
      {store.categories.length > 1 && (
        <div className={cn("sticky top-0 z-20 border-b py-3 px-4 overflow-x-auto backdrop-blur-md", theme.bg, theme.border)}>
          <div className="flex gap-2 max-w-5xl mx-auto">
            {store.categories.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-transform hover:scale-105 shadow-sm",
                  theme.accent
                )}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Products by category */}
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-14">
        {store.categories.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">{cat.name}</h2>
              <span className="text-sm opacity-50 font-medium">{cat.products.length}</span>
              <div className={cn("flex-1 h-px", theme.border, "border-t")} />
            </div>
            {cat.products.length === 0 ? (
              <p className="opacity-40 text-sm">Нет товаров в этой категории</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {cat.products.map((product) => {
                  const onSale =
                    product.oldPrice != null && product.oldPrice > product.price;
                  const pct = onSale
                    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
                    : 0;
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        "group rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
                        theme.card
                      )}
                    >
                      <div className="relative overflow-hidden">
                        {/* Badges */}
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          {onSale && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                              −{pct}%
                            </span>
                          )}
                        </div>
                        {!product.inStock && (
                          <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center">
                            <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full">
                              Нет в наличии
                            </span>
                          </div>
                        )}
                        {product.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-44 md:h-52 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className={cn("w-full h-44 md:h-52 flex items-center justify-center text-5xl", theme.bg)}>
                            📦
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-base leading-snug line-clamp-2">{product.name}</h3>
                        {product.description && (
                          <p className="text-sm opacity-60 mt-1 line-clamp-2">{product.description}</p>
                        )}
                        <div className="flex items-end gap-2 mt-3 flex-wrap">
                          <span className={cn("text-xl font-extrabold", onSale && "text-red-500")}>
                            {money(product.price, product.currency)}
                          </span>
                          {onSale && (
                            <span className="text-sm line-through opacity-40 mb-0.5">
                              {money(product.oldPrice!, product.currency)}
                            </span>
                          )}
                        </div>
                        {onSale && (
                          <p className="text-xs text-green-600 font-semibold mt-1">
                            Выгода {money(product.oldPrice! - product.price, product.currency)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Contact footer */}
      {(store.contactPhone || store.contactEmail || store.contactAddress) && (
        <footer className={cn("border-t mt-8 py-8 px-4", theme.border)}>
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              {store.contactPhone && (
                <a href={`tel:${store.contactPhone}`} className="flex items-center gap-2 hover:opacity-80">
                  📞 {store.contactPhone}
                </a>
              )}
              {store.contactEmail && (
                <a href={`mailto:${store.contactEmail}`} className="flex items-center gap-2 hover:opacity-80">
                  ✉️ {store.contactEmail}
                </a>
              )}
              {store.contactAddress && (
                <span className="flex items-center gap-2">📍 {store.contactAddress}</span>
              )}
              {store.contactWhatsapp && (
                <a
                  href={`https://wa.me/${store.contactWhatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80"
                >
                  💬 WhatsApp
                </a>
              )}
              {store.contactInstagram && (
                <span className="flex items-center gap-2">📸 {store.contactInstagram}</span>
              )}
            </div>
          </div>
        </footer>
      )}

      {/* Powered by */}
      <div className="text-center py-4 opacity-40 text-xs">
        Создан на{" "}
        <Link href="/" className="hover:underline">
          StoreBuilder
        </Link>
      </div>
    </div>
  );
}
