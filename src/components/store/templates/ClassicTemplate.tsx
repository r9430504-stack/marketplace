import { cn } from "@/lib/utils";
import { ThemeConfig } from "@/types";
import ProductCard from "@/components/store/ProductCard";
import CartFab from "@/components/store/CartFab";
import BenefitsStrip from "@/components/store/BenefitsStrip";
import { StoreData, Contacts, PoweredBy } from "./shared";

export default function ClassicTemplate({ store, theme }: { store: StoreData; theme: ThemeConfig }) {
  const totalProducts = store.categories.reduce((n, c) => n + c.products.length, 0);

  return (
    <div className={cn("min-h-screen", theme.bg, theme.text)}>
      {/* Utility bar */}
      <div className={cn("text-sm", theme.accent)}>
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            {store.contactPhone && <a href={`tel:${store.contactPhone}`} className="hover:opacity-80">📞 {store.contactPhone}</a>}
            {store.contactEmail && <a href={`mailto:${store.contactEmail}`} className="hover:opacity-80 hidden sm:inline">✉️ {store.contactEmail}</a>}
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            {store.contactWhatsapp && (
              <a href={`https://wa.me/${store.contactWhatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">WhatsApp</a>
            )}
            {store.contactInstagram && <span>Instagram</span>}
            <span className="opacity-80">RU</span>
          </div>
        </div>
      </div>

      {/* Header with info columns */}
      <div className={cn(theme.bg, "border-b", theme.border)}>
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="text-2xl font-extrabold tracking-tight">{store.name}</p>
            {store.tagline && <p className="text-sm opacity-60">{store.tagline}</p>}
          </div>
          <div className="flex items-center gap-6 text-sm">
            {store.contactAddress && (
              <div className="hidden md:flex items-start gap-2 max-w-[220px]">
                <span className="text-lg">📍</span>
                <div><p className="font-semibold">Наш адрес</p><p className="opacity-60 text-xs">{store.contactAddress}</p></div>
              </div>
            )}
            {store.contactPhone && (
              <div className="flex items-start gap-2">
                <span className="text-lg">📞</span>
                <div><p className="font-semibold">Телефон</p><p className="opacity-60 text-xs">{store.contactPhone}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Colored nav bar */}
      <div className={cn("sticky top-0 z-20", theme.accent)}>
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-4 overflow-x-auto">
          <span className="font-bold text-sm uppercase tracking-wide flex items-center gap-2 pr-4 border-r border-white/30">☰ Каталог</span>
          <a href="#products" className="text-sm font-medium whitespace-nowrap hover:opacity-80">Товары</a>
          {store.aboutText && <a href="#about" className="text-sm font-medium whitespace-nowrap hover:opacity-80">О нас</a>}
          <a href="#contacts" className="text-sm font-medium whitespace-nowrap hover:opacity-80">Контакты</a>
          <span className="ml-auto text-sm opacity-80">🔍</span>
        </div>
      </div>

      {/* Hero */}
      <div className={cn("relative h-56 md:h-72 flex items-center justify-center text-center bg-gradient-to-br overflow-hidden", theme.preview)}>
        {store.bannerImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={store.bannerImage} alt={store.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
          </>
        )}
        <div className="relative z-10 px-4" style={{ color: store.bannerTextColor || "#ffffff" }}>
          <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg">{store.bannerText || store.name}</h1>
          {store.tagline && <p className="mt-2 opacity-90 drop-shadow">{store.tagline}</p>}
        </div>
      </div>

      {/* Benefits */}
      <BenefitsStrip theme={theme} variant="strip" deliveryInfo={store.deliveryInfo} />

      {/* Category pills */}
      {store.categories.length > 1 && (
        <div className={cn("border-b py-3 px-4 overflow-x-auto", theme.border)}>
          <div className="flex gap-2 max-w-6xl mx-auto">
            {store.categories.map((cat) => (
              <a key={cat.id} href={`#cat-${cat.id}`} className={cn("px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm", theme.accent)}>
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div id="products" className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {store.categories.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">{cat.name}</h2>
              <span className="text-sm opacity-50 font-medium">{cat.products.length}</span>
              <div className={cn("flex-1 h-px border-t", theme.border)} />
            </div>
            {cat.products.length === 0 ? (
              <p className="opacity-40 text-sm">Нет товаров</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.products.map((p) => (
                  <ProductCard key={p.id} product={p} theme={theme} slug={store.slug} storeName={store.name} variant="card" />
                ))}
              </div>
            )}
          </section>
        ))}
        {totalProducts === 0 && <p className="text-center opacity-40 py-10">Товары скоро появятся</p>}
      </div>

      {/* About */}
      {store.aboutText && (
        <section id="about" className={cn("border-t scroll-mt-24", theme.border)}>
          <div className="max-w-5xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold mb-3">О нас</h2>
            <p className="opacity-80 whitespace-pre-line leading-relaxed max-w-2xl">{store.aboutText}</p>
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
