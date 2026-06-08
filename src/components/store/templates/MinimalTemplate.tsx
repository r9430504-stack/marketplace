import { cn } from "@/lib/utils";
import { ThemeConfig } from "@/types";
import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import CartFab from "@/components/store/CartFab";
import { StoreData, Contacts, PoweredBy } from "./shared";

export default function MinimalTemplate({ store, theme }: { store: StoreData; theme: ThemeConfig }) {
  const heading = store.bannerText || store.tagline || store.name;
  const sub = store.bannerText ? store.tagline : null;

  return (
    <div className={cn("min-h-screen", theme.bg, theme.text)}>
      {/* Clean nav */}
      <header className="sticky top-0 z-20 px-4 py-3">
        <div className={cn("max-w-5xl mx-auto rounded-full px-6 py-3 flex items-center justify-between gap-4 shadow-sm backdrop-blur", theme.card)}>
          <span className="font-bold text-lg">{store.name}</span>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <a href="#products" className="hover:opacity-60">Товары</a>
            {store.aboutText && <a href="#about" className="hover:opacity-60">О нас</a>}
            <a href="#contacts" className="hover:opacity-60">Контакты</a>
          </nav>
          <Link href="/cart" className="text-xl">🛒</Link>
        </div>
      </header>

      {/* Centered hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">{heading}</h1>
        {sub && <p className="mt-4 text-lg md:text-xl opacity-60 max-w-2xl mx-auto">{sub}</p>}
        <a href="#products" className={cn("inline-block mt-8 px-8 py-3 rounded-full font-semibold text-base transition-transform hover:scale-105", theme.accent)}>
          Смотреть товары
        </a>
      </section>

      {/* Hero image tile */}
      {store.bannerImage && (
        <div className="max-w-5xl mx-auto px-4 pb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={store.bannerImage} alt={store.name} className="w-full h-64 md:h-96 object-cover rounded-3xl" />
        </div>
      )}

      {/* Products — big airy tiles */}
      <div id="products" className="max-w-5xl mx-auto px-4 py-10 space-y-16">
        {store.categories.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{cat.name}</h2>
            {cat.products.length === 0 ? (
              <p className="opacity-40 text-sm text-center">Нет товаров</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cat.products.map((p) => (
                  <ProductCard key={p.id} product={p} theme={theme} slug={store.slug} storeName={store.name} variant="card" />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* About */}
      {store.aboutText && (
        <section id="about" className="max-w-3xl mx-auto px-4 py-14 text-center scroll-mt-24">
          <h2 className="text-3xl font-bold mb-4">О нас</h2>
          <p className="opacity-70 whitespace-pre-line leading-relaxed">{store.aboutText}</p>
        </section>
      )}

      {/* Delivery */}
      {store.deliveryInfo && (
        <section className="max-w-3xl mx-auto px-4 py-8 text-center">
          <h2 className="text-xl font-bold mb-2">🚚 Доставка</h2>
          <p className="opacity-70 whitespace-pre-line leading-relaxed">{store.deliveryInfo}</p>
        </section>
      )}

      <Contacts store={store} theme={theme} />
      <PoweredBy />
      <CartFab />
    </div>
  );
}
