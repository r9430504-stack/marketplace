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

  return (
    <div className={cn("min-h-screen", theme.bg, theme.text)}>
      {/* Hero banner */}
      <div className={cn("relative h-64 md:h-80 flex items-center justify-center bg-gradient-to-br", theme.preview)}>
        {store.bannerImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={store.bannerImage}
            alt={store.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="relative z-10 text-center px-4" style={{ color: store.bannerTextColor || "#ffffff" }}>
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
            {store.name}
          </h1>
          {store.tagline && (
            <p className="mt-2 text-lg opacity-90 drop-shadow">{store.tagline}</p>
          )}
          {store.bannerText && (
            <p className="mt-1 text-sm opacity-80">{store.bannerText}</p>
          )}
        </div>
      </div>

      {/* Categories nav */}
      {store.categories.length > 1 && (
        <div className={cn("sticky top-0 z-10 border-b py-3 px-4 overflow-x-auto", theme.bg, theme.border)}>
          <div className="flex gap-2 max-w-5xl mx-auto">
            {store.categories.map((cat) => (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className={cn("px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors", theme.accent)}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Products by category */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {store.categories.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`}>
            <h2 className="text-2xl font-bold mb-6">{cat.name}</h2>
            {cat.products.length === 0 ? (
              <p className="text-gray-400 text-sm">Нет товаров в этой категории</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.products.map((product) => (
                  <div
                    key={product.id}
                    className={cn("rounded-2xl overflow-hidden transition-transform hover:scale-[1.01]", theme.card)}
                  >
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className={cn("w-full h-48 flex items-center justify-center text-4xl", theme.bg)}>
                        📦
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-base">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm opacity-60 mt-1 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold">
                          {product.price.toLocaleString("ru-RU")}{" "}
                          {currencySymbols[product.currency] ?? product.currency}
                        </span>
                        {!product.inStock && (
                          <span className="text-xs text-red-500 font-medium">Нет в наличии</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
