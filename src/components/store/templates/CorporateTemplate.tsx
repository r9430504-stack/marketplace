import { cn } from "@/lib/utils";
import { ThemeConfig } from "@/types";
import ProductCard from "@/components/store/ProductCard";
import CartFab from "@/components/store/CartFab";
import BenefitsStrip from "@/components/store/BenefitsStrip";
import { StoreData, Contacts, PoweredBy } from "./shared";

export default function CorporateTemplate({ store, theme }: { store: StoreData; theme: ThemeConfig }) {
  return (
    <div className={cn("min-h-screen", theme.bg, theme.text)}>
      {/* Top nav */}
      <header className={cn("sticky top-0 z-20 border-b backdrop-blur-md", theme.bg, theme.border)}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <span className="text-xl font-extrabold tracking-tight uppercase">{store.name}</span>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#top" className="hover:opacity-70">Главная</a>
            <a href="#products" className="hover:opacity-70">Товары</a>
            {store.aboutText && <a href="#about" className="hover:opacity-70">О нас</a>}
            <a href="#contacts" className="hover:opacity-70">Контакты</a>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            {store.contactPhone && <a href={`tel:${store.contactPhone}`} className="font-semibold hidden sm:inline">{store.contactPhone}</a>}
            <span className="opacity-50">EN</span>
          </div>
        </div>
      </header>

      {/* Full-bleed hero */}
      <div id="top" className={cn("relative h-[60vh] md:h-[72vh] flex items-end justify-center text-center bg-gradient-to-br overflow-hidden", theme.preview)}>
        {store.bannerImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={store.bannerImage} alt={store.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          </>
        )}
        <div className="relative z-10 px-6 pb-16 max-w-4xl" style={{ color: store.bannerTextColor || "#ffffff" }}>
          <h1 className="font-serif text-3xl md:text-5xl font-bold uppercase tracking-wide leading-tight drop-shadow-lg">
            {store.bannerText || store.tagline || store.name}
          </h1>
          {store.tagline && store.bannerText && (
            <p className="mt-4 text-lg opacity-90 drop-shadow">{store.tagline}</p>
          )}
        </div>
      </div>

      {/* Почему мы */}
      <BenefitsStrip theme={theme} variant="grid" deliveryInfo={store.deliveryInfo} />

      {/* Products */}
      <div id="products" className={cn("border-t", theme.border)}>
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
          {store.categories.map((cat) => (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-center mb-8">{cat.name}</h2>
              {cat.products.length === 0 ? (
                <p className="opacity-40 text-sm text-center">Нет товаров</p>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                  {cat.products.map((p) => (
                    <ProductCard key={p.id} product={p} theme={theme} slug={store.slug} storeName={store.name} variant="card" />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* About */}
      {store.aboutText && (
        <section id="about" className={cn("border-t scroll-mt-24", theme.border)}>
          <div className="max-w-3xl mx-auto px-4 py-14 text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">О компании</h2>
            <p className="opacity-80 whitespace-pre-line leading-relaxed">{store.aboutText}</p>
          </div>
        </section>
      )}

      {/* Delivery */}
      {store.deliveryInfo && (
        <section className={cn("border-t", theme.border)}>
          <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-xl font-bold mb-2">🚚 Доставка</h2>
            <p className="opacity-80 whitespace-pre-line leading-relaxed max-w-2xl">{store.deliveryInfo}</p>
          </div>
        </section>
      )}

      <Contacts store={store} theme={theme} />
      <PoweredBy />
      <CartFab />
    </div>
  );
}
