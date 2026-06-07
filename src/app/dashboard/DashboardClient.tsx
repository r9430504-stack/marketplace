"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { SessionPayload } from "@/lib/session";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  currency: string;
  images: string[];
  inStock: boolean;
};

type Category = {
  id: string;
  name: string;
  order: number;
  products: Product[];
};

type Store = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  status: "DRAFT" | "PUBLISHED";
  theme: string;
  categories: Category[];
  _count: { products: number };
};

interface Props {
  store: Store;
  session: SessionPayload;
}

const currencySymbols: Record<string, string> = {
  RUB: "₽", USD: "$", EUR: "€", KZT: "₸",
};

const emptyForm = { name: "", price: "", oldPrice: "", currency: "RUB", description: "", image: "", inStock: true };

export default function DashboardClient({ store: initialStore }: Props) {
  const router = useRouter();
  const [store, setStore] = useState(initialStore);
  const [activeTab, setActiveTab] = useState<"products" | "stats" | "settings">("products");
  const [selectedCat, setSelectedCat] = useState<string>(store.categories[0]?.id ?? "");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const allProducts = store.categories.flatMap((c) => c.products);

  // Статистика по ценам (сгруппирована по валютам)
  const byCurrency: Record<string, { sum: number; count: number; min: number; max: number }> = {};
  for (const p of allProducts) {
    const c = p.currency || "RUB";
    if (!byCurrency[c]) byCurrency[c] = { sum: 0, count: 0, min: p.price, max: p.price };
    byCurrency[c].sum += p.price;
    byCurrency[c].count += 1;
    byCurrency[c].min = Math.min(byCurrency[c].min, p.price);
    byCurrency[c].max = Math.max(byCurrency[c].max, p.price);
  }
  const inStockCount = allProducts.filter((p) => p.inStock).length;

  function fmt(n: number, cur: string) {
    return `${Math.round(n).toLocaleString("ru-RU")} ${currencySymbols[cur] ?? cur}`;
  }

  async function saveProduct() {
    if (!form.name || !form.price || !selectedCat) return;
    setSavingProduct(true);
    const body = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      currency: form.currency,
      images: form.image ? [form.image] : [],
      inStock: form.inStock,
      categoryId: selectedCat,
    };
    const res = editingId
      ? await fetch(`/api/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
    if (res.ok) {
      setForm(emptyForm);
      setEditingId(null);
      router.refresh();
    }
    setSavingProduct(false);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      oldPrice: p.oldPrice != null ? String(p.oldPrice) : "",
      currency: p.currency,
      description: p.description ?? "",
      image: p.images[0] ?? "",
      inStock: p.inStock,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (editingId === id) cancelEdit();
    router.refresh();
  }

  async function addCategory() {
    if (!newCatName.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName, order: store.categories.length }),
    });
    if (res.ok) {
      setNewCatName("");
      router.refresh();
    }
  }

  async function togglePublish() {
    setPublishLoading(true);
    const newStatus = store.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await fetch(`/api/stores/${store.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setStore((s) => ({ ...s, status: newStatus }));
    setPublishLoading(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const activeCatProducts = store.categories.find((c) => c.id === selectedCat)?.products ?? [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navbar */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="text-blue-600 dark:text-blue-400 font-bold text-lg shrink-0">StoreBuilder</Link>
            <span className="text-gray-300 dark:text-gray-700 shrink-0">|</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100 truncate">{store.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
              store.status === "PUBLISHED"
                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
            }`}>
              {store.status === "PUBLISHED" ? "Опубликован" : "Черновик"}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {store.status === "PUBLISHED" && (
              <Link href={`/store/${store.slug}`} target="_blank" className="text-sm text-blue-600 dark:text-blue-400 hover:underline hidden sm:inline">
                Просмотр →
              </Link>
            )}
            <ThemeToggle />
            <Button variant="ghost" onClick={logout} className="text-sm">
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Quick stats + publish */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Товаров" value={String(store._count.products)} accent="text-blue-600 dark:text-blue-400" />
          <StatCard label="В наличии" value={`${inStockCount} из ${allProducts.length}`} accent="text-green-600 dark:text-green-400" />
          <StatCard label="Категорий" value={String(store.categories.length)} accent="text-violet-600 dark:text-violet-400" />
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center">
            <Button
              onClick={togglePublish}
              loading={publishLoading}
              variant={store.status === "PUBLISHED" ? "secondary" : "primary"}
              className="w-full justify-center"
            >
              {store.status === "PUBLISHED" ? "Скрыть" : "🚀 Опубликовать"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {([
            ["products", "Товары"],
            ["stats", "Статистика"],
            ["settings", "Настройки"],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border dark:border-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Categories sidebar */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 space-y-2">
              <p className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-3">Категории</p>
              {store.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedCat === cat.id
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {cat.name}
                  <span className="ml-1 text-xs opacity-50">({cat.products.length})</span>
                </button>
              ))}
              <div className="pt-2 border-t dark:border-gray-800 flex gap-1">
                <input
                  className="flex-1 text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1"
                  placeholder="Новая категория..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCategory()}
                />
                <button onClick={addCategory} className="text-blue-600 dark:text-blue-400 text-xs font-bold px-1">+</button>
              </div>
            </div>

            {/* Products area */}
            <div className="md:col-span-2 space-y-4">
              {/* Add / edit product form */}
              <div className={`bg-white dark:bg-gray-900 rounded-2xl border shadow-sm p-4 space-y-3 ${
                editingId ? "border-blue-400 dark:border-blue-600" : "border-gray-100 dark:border-gray-800"
              }`}>
                <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                  {editingId ? "✏️ Редактировать товар" : "Добавить товар"}
                </p>
                <Input placeholder="Название товара" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Цена" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  <Input placeholder="Старая цена" type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="RUB">₽ RUB</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="KZT">₸ KZT</option>
                  </select>
                </div>
                <textarea
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm resize-none"
                  rows={2}
                  placeholder="Описание..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    className="w-4 h-4"
                  />
                  В наличии
                </label>
                <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Фото товара" />
                <div className="flex gap-2">
                  <Button onClick={saveProduct} loading={savingProduct} disabled={!form.name || !form.price} className="flex-1 justify-center">
                    {editingId ? "Сохранить изменения" : "Добавить товар"}
                  </Button>
                  {editingId && (
                    <Button variant="ghost" onClick={cancelEdit}>Отмена</Button>
                  )}
                </div>
              </div>

              {/* Product list */}
              <div className="space-y-2">
                {activeCatProducts.map((product) => (
                  <div key={product.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-3 flex items-center gap-3">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl shrink-0">📦</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
                        {product.name}
                        {!product.inStock && <span className="ml-2 text-xs text-red-500">нет в наличии</span>}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {fmt(product.price, product.currency)}
                        {product.oldPrice != null && product.oldPrice > product.price && (
                          <span className="ml-2 line-through opacity-50">{fmt(product.oldPrice, product.currency)}</span>
                        )}
                      </p>
                    </div>
                    <button onClick={() => startEdit(product)} className="text-blue-500 hover:text-blue-700 text-xs shrink-0">
                      Изменить
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-400 hover:text-red-600 text-xs shrink-0">
                      Удалить
                    </button>
                  </div>
                ))}
                {activeCatProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                    Нет товаров в этой категории
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <p className="font-semibold text-gray-700 dark:text-gray-200 mb-4">💰 Статистика по ценам</p>
              {Object.keys(byCurrency).length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">Добавьте товары, чтобы увидеть статистику.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(byCurrency).map(([cur, s]) => (
                    <div key={cur} className="border dark:border-gray-800 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                        Валюта: {currencySymbols[cur] ?? cur} ({cur}) — {s.count} тов.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <MiniStat label="Стоимость каталога" value={fmt(s.sum, cur)} />
                        <MiniStat label="Средняя цена" value={fmt(s.sum / s.count, cur)} />
                        <MiniStat label="Самый дешёвый" value={fmt(s.min, cur)} />
                        <MiniStat label="Самый дорогой" value={fmt(s.max, cur)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Products per category */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <p className="font-semibold text-gray-700 dark:text-gray-200 mb-4">📊 Товары по категориям</p>
              <div className="space-y-2">
                {store.categories.map((cat) => {
                  const max = Math.max(1, ...store.categories.map((c) => c.products.length));
                  const pct = (cat.products.length / max) * 100;
                  return (
                    <div key={cat.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                        <span className="text-gray-400 dark:text-gray-500">{cat.products.length}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Настройки магазина</p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>🔗 Ссылка на магазин:{" "}
                <Link href={`/store/${store.slug}`} target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                  /store/{store.slug}
                </Link>
              </p>
              <p>🎨 Тема: {store.theme}</p>
              <p className="pt-4">
                <Link href="/create" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Изменить оформление магазина (мастер) →
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
      <p className="text-base font-bold text-gray-900 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
