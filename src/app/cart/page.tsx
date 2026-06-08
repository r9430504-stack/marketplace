"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CartItem, getCart, setQty, removeFromCart, clearCart } from "@/lib/cart";
import ThemeToggle from "@/components/ui/ThemeToggle";

const currencySymbols: Record<string, string> = {
  RUB: "₽", USD: "$", EUR: "€", KZT: "₸",
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const update = () => setItems(getCart());
    update();
    setReady(true);
    window.addEventListener("cart-change", update);
    return () => window.removeEventListener("cart-change", update);
  }, []);

  // группируем по магазину
  const byStore: Record<string, { name: string; items: CartItem[] }> = {};
  for (const it of items) {
    if (!byStore[it.storeSlug]) byStore[it.storeSlug] = { name: it.storeName, items: [] };
    byStore[it.storeSlug].items.push(it);
  }

  function money(v: number, cur: string) {
    return `${v.toLocaleString("ru-RU")} ${currencySymbols[cur] ?? cur}`;
  }

  function storeTotals(list: CartItem[]) {
    const totals: Record<string, number> = {};
    for (const i of list) totals[i.currency] = (totals[i.currency] ?? 0) + i.price * i.qty;
    return totals;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-blue-600 dark:text-blue-400 font-bold text-lg">🏗️ StoreBuilder</Link>
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-gray-800 dark:text-gray-100">🛒 Корзина</h1>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {!ready ? null : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <span className="text-6xl">🛒</span>
            <p className="mt-4 text-lg">Корзина пуста</p>
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block">
              ← Вернуться к магазинам
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(byStore).map(([slug, group]) => {
              const totals = storeTotals(group.items);
              return (
                <div key={slug} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b dark:border-gray-800 flex items-center justify-between">
                    <Link href={`/store/${slug}`} className="font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                      🏪 {group.name}
                    </Link>
                  </div>

                  <div className="divide-y dark:divide-gray-800">
                    {group.items.map((it) => (
                      <div key={it.id} className="flex items-center gap-3 p-4">
                        {it.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={it.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl shrink-0">📦</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{it.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{money(it.price, it.currency)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setQty(it.id, it.qty - 1)}
                            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-gray-900 dark:text-gray-100">{it.qty}</span>
                          <button
                            onClick={() => setQty(it.id, it.qty + 1)}
                            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(it.id)}
                            className="ml-1 text-red-400 hover:text-red-600 text-xs"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-3 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 flex items-center justify-between flex-wrap gap-2">
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Итого: </span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {Object.entries(totals).map(([c, v]) => money(v, c)).join(" + ")}
                      </span>
                    </div>
                    <Link
                      href={`/store/${slug}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                    >
                      Оформить заказ →
                    </Link>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-red-500"
            >
              Очистить корзину
            </button>

            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              💡 Оплата на сайте пока не подключена — нажмите «Оформить заказ», чтобы перейти в магазин и связаться с продавцом по контактам.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
