import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { THEMES } from "@/types";

export default async function HomePage() {
  const [stores, session] = await Promise.all([
    prisma.store.findMany({
      where: { status: "PUBLISHED" },
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    }),
    getSession(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            🏗️ StoreBuilder
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="text-sm text-gray-500">Привет, {session.name}</span>
                {session.role === "SELLER" && (
                  <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
                    Мой магазин
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Войти / Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Создать магазин
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Создай свой магазин
          <br />
          <span className="text-blue-600">за 5 минут</span>
        </h1>
        <p className="text-xl text-gray-500 mt-4 max-w-xl mx-auto">
          Выбери стиль, добавь товары и получи готовый сайт-магазин.
          <br />
          <span className="text-sm">Create your store in minutes — no code needed.</span>
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            🚀 Начать бесплатно
          </Link>
          <Link
            href="#stores"
            className="bg-white text-gray-700 px-8 py-3 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            Смотреть магазины
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "🎨", title: "5 стилей оформления", sub: "5 design themes" },
          { icon: "📦", title: "Любые категории товаров", sub: "Any product categories" },
          { icon: "🔗", title: "Готовая ссылка на магазин", sub: "Instant store URL" },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
            <span className="text-3xl">{f.icon}</span>
            <p className="font-semibold text-gray-800 mt-2">{f.title}</p>
            <p className="text-xs text-gray-400">{f.sub}</p>
          </div>
        ))}
      </section>

      {/* Published stores */}
      <section id="stores" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Магазины на платформе
          <span className="text-sm font-normal text-gray-400 ml-2">Stores on the platform</span>
        </h2>

        {stores.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl">🏪</span>
            <p className="mt-4 text-lg">Пока нет магазинов. Будь первым!</p>
            <p className="text-sm">No stores yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => {
              const theme = THEMES.find((t) => t.id === store.theme) ?? THEMES[0];
              return (
                <Link
                  key={store.id}
                  href={`/store/${store.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <div className={`h-28 bg-gradient-to-br ${theme.preview} relative`}>
                    {store.bannerImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={store.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white font-bold text-lg drop-shadow">{store.name}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    {store.tagline && <p className="text-sm text-gray-500 line-clamp-1">{store.tagline}</p>}
                    <p className="text-xs text-gray-400 mt-1">{store._count.products} товаров</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
