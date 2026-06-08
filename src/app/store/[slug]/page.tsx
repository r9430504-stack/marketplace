import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTheme, getLayout } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CartFab from "@/components/store/CartFab";
import ProductCard from "@/components/store/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await prisma.store.findUnique({ where: { slug } });
  return { title: store?.name ?? "Магазин", description: store?.tagline };
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const storeRaw = await prisma.store.findUnique({
    where: { slug },
    include: {
      categories: {
        include: { products: { orderBy: { createdAt: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!storeRaw) notFound();
  const store = storeRaw;

  const theme = getTheme(store.theme);
  const layout = getLayout(store.layout);
  const textColor = store.bannerTextColor || "#ffffff";
  const totalProducts = store.categories.reduce((n, c) => n + c.products.length, 0);

  /* ───────────── HERO ───────────── */
  const heroText = (extra?: React.ReactNode) => (
    <div className="relative z-10 px-4" style={{ color: textColor }}>
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">{store.name}</h1>
      {store.tagline && <p className="mt-3 text-lg md:text-xl opacity-95 drop-shadow font-medium">{store.tagline}</p>}
      {store.bannerText && <p className="mt-1 text-sm md:text-base opacity-85 drop-shadow">{store.bannerText}</p>}
      {extra}
    </div>
  );
  const countBadge = (
    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-sm font-medium">
      🛍️ {totalProducts} товаров · {store.categories.length} категорий
    </div>
  );
  const bgImg = store.bannerImage ? (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={store.bannerImage} alt={store.name} className="absolute inset-0 w-full h-full object-cover" />
    </>
  ) : null;

  function Hero() {
    switch (layout.hero) {
      case "fullscreen":
        return (
          <div className={cn("relative h-[85vh] flex items-center justify-center text-center bg-gradient-to-br overflow-hidden", theme.preview)}>
            {bgImg}
            <div className="absolute inset-0 bg-black/30" />
            {heroText(<div className="mt-8 text-3xl animate-bounce" style={{ color: textColor }}>↓</div>)}
          </div>
        );
      case "centered":
        return (
          <div className={cn("relative h-72 flex items-center justify-center text-center bg-gradient-to-br overflow-hidden", theme.preview)}>
            {bgImg && <div className="absolute inset-0 bg-black/20" />}
            {bgImg}
            {heroText()}
          </div>
        );
      case "minimal":
        return (
          <div className={cn("border-b px-4 py-10 md:py-14", theme.border)}>
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{store.name}</h1>
              {store.tagline && <p className="mt-2 text-base opacity-60">{store.tagline}</p>}
            </div>
          </div>
        );
      case "split":
        return (
          <div className="grid md:grid-cols-2">
            <div className={cn("relative min-h-[16rem] md:min-h-[22rem] bg-gradient-to-br", theme.preview)}>{bgImg}</div>
            <div className={cn("flex items-center justify-center text-center md:text-left p-8", theme.bg)}>
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{store.name}</h1>
                {store.tagline && <p className="mt-3 text-lg opacity-70">{store.tagline}</p>}
                {store.bannerText && <p className="mt-1 text-sm opacity-60">{store.bannerText}</p>}
                <div className="mt-4 text-sm opacity-50">🛍️ {totalProducts} товаров</div>
              </div>
            </div>
          </div>
        );
      case "strip":
        return (
          <div className={cn("relative h-44 md:h-52 flex items-center justify-center text-center bg-gradient-to-br overflow-hidden", theme.preview)}>
            {bgImg}
            {bgImg && <div className="absolute inset-0 bg-black/30" />}
            {heroText()}
          </div>
        );
      case "overlay":
        return (
          <div className={cn("relative h-80 md:h-96 flex items-end bg-gradient-to-br overflow-hidden", theme.preview)}>
            {bgImg}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 px-6 pb-8 max-w-5xl mx-auto w-full" style={{ color: textColor }}>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">{store.name}</h1>
              {store.tagline && <p className="mt-2 text-lg md:text-xl opacity-95 drop-shadow">{store.tagline}</p>}
            </div>
          </div>
        );
      case "big":
      default:
        return (
          <div className={cn("relative h-72 md:h-96 flex items-center justify-center text-center bg-gradient-to-br overflow-hidden", theme.preview)}>
            {bgImg}
            {bgImg && <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />}
            {heroText(countBadge)}
          </div>
        );
    }
  }

  /* ───────────── NAV ───────────── */
  function TopBar() {
    return (
      <div className={cn("sticky top-0 z-20 border-b backdrop-blur-md", theme.bg, theme.border)}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <span className="font-bold text-lg truncate">{store.name}</span>
          <nav className="flex items-center gap-1 sm:gap-3 text-sm font-medium overflow-x-auto">
            <a href="#products" className={cn("px-3 py-1.5 rounded-full whitespace-nowrap", theme.accent)}>Товары</a>
            {store.aboutText && <a href="#about" className="px-3 py-1.5 rounded-full whitespace-nowrap hover:opacity-70">О нас</a>}
            <a href="#contacts" className="px-3 py-1.5 rounded-full whitespace-nowrap hover:opacity-70">Контакты</a>
          </nav>
        </div>
      </div>
    );
  }
  function Pills() {
    if (store.categories.length <= 1) return null;
    return (
      <div className={cn("sticky top-0 z-20 border-b py-3 px-4 overflow-x-auto backdrop-blur-md", theme.bg, theme.border)}>
        <div className="flex gap-2 max-w-5xl mx-auto">
          {store.categories.map((cat) => (
            <a key={cat.id} href={`#cat-${cat.id}`} className={cn("px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-transform hover:scale-105 shadow-sm", theme.accent)}>
              {cat.name}
            </a>
          ))}
        </div>
      </div>
    );
  }

  /* ───────────── GRID per category ───────────── */
  function CategoryProducts({ products }: { products: typeof store.categories[number]["products"] }) {
    if (products.length === 0) return <p className="opacity-40 text-sm">Нет товаров в этой категории</p>;
    const common = { theme, slug: store.slug, storeName: store.name };
    switch (layout.grid) {
      case "cards2":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {products.map((p) => <ProductCard key={p.id} product={p} {...common} variant="card" />)}
          </div>
        );
      case "compact":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((p) => <ProductCard key={p.id} product={p} {...common} variant="compact" />)}
          </div>
        );
      case "list":
        return (
          <div className="flex flex-col gap-3">
            {products.map((p) => <ProductCard key={p.id} product={p} {...common} variant="list" />)}
          </div>
        );
      case "showcase":
        return (
          <div className="flex flex-col gap-6">
            {products.map((p, i) => <ProductCard key={p.id} product={p} {...common} variant="showcase" index={i} />)}
          </div>
        );
      case "row":
        return (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
            {products.map((p) => (
              <div key={p.id} className="w-52 sm:w-60 shrink-0 snap-start">
                <ProductCard product={p} {...common} variant="card" />
              </div>
            ))}
          </div>
        );
      case "cards3":
      default:
        return (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {products.map((p) => <ProductCard key={p.id} product={p} {...common} variant="card" />)}
          </div>
        );
    }
  }

  const Sections = (
    <div id="products" className="space-y-14">
      {store.categories.map((cat) => (
        <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">{cat.name}</h2>
            <span className="text-sm opacity-50 font-medium">{cat.products.length}</span>
            <div className={cn("flex-1 h-px border-t", theme.border)} />
          </div>
          <CategoryProducts products={cat.products} />
        </section>
      ))}
    </div>
  );

  const isSidebar = layout.nav === "sidebar";

  return (
    <div className={cn("min-h-screen", theme.bg, theme.text)}>
      <Hero />
      {layout.nav === "topbar" && <TopBar />}
      {layout.nav === "pills" && <Pills />}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {isSidebar ? (
          <div className="grid md:grid-cols-[200px_1fr] gap-8">
            <aside className="hidden md:block">
              <div className={cn("sticky top-4 rounded-2xl p-4", theme.card)}>
                <p className="font-bold text-sm mb-3">Категории</p>
                <nav className="flex flex-col gap-1">
                  {store.categories.map((cat) => (
                    <a key={cat.id} href={`#cat-${cat.id}`} className="text-sm py-1.5 px-2 rounded-lg hover:opacity-70 transition-opacity">
                      {cat.name} <span className="opacity-40 text-xs">({cat.products.length})</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
            <div>{Sections}</div>
          </div>
        ) : (
          Sections
        )}

        {/* О нас */}
        {store.aboutText && (
          <section id="about" className={cn("mt-14 pt-10 border-t scroll-mt-20", theme.border)}>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">О нас</h2>
            <p className="opacity-80 whitespace-pre-line leading-relaxed max-w-2xl">{store.aboutText}</p>
          </section>
        )}

        {/* Доставка */}
        {store.deliveryInfo && (
          <section className={cn("mt-12 pt-8 border-t", theme.border)}>
            <h2 className="text-xl font-bold mb-2">🚚 Доставка</h2>
            <p className="opacity-80 whitespace-pre-line leading-relaxed max-w-2xl">{store.deliveryInfo}</p>
          </section>
        )}

        {/* Контакты */}
        {(store.contactPhone || store.contactEmail || store.contactAddress || store.contactWhatsapp || store.contactInstagram) && (
          <section id="contacts" className={cn("mt-12 pt-8 border-t scroll-mt-20", theme.border)}>
            <h2 className="text-xl font-bold mb-4">Контакты</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              {store.contactPhone && <a href={`tel:${store.contactPhone}`} className="flex items-center gap-2 hover:opacity-80">📞 {store.contactPhone}</a>}
              {store.contactEmail && <a href={`mailto:${store.contactEmail}`} className="flex items-center gap-2 hover:opacity-80">✉️ {store.contactEmail}</a>}
              {store.contactAddress && <span className="flex items-center gap-2">📍 {store.contactAddress}</span>}
              {store.contactWhatsapp && (
                <a href={`https://wa.me/${store.contactWhatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80">💬 WhatsApp</a>
              )}
              {store.contactInstagram && <span className="flex items-center gap-2">📸 {store.contactInstagram}</span>}
            </div>
          </section>
        )}
      </div>

      <div className="text-center py-4 opacity-40 text-xs">
        Создан на <Link href="/" className="hover:underline">StoreBuilder</Link>
      </div>

      <CartFab />
    </div>
  );
}
