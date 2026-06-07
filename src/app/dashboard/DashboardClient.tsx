"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";
import { SessionPayload } from "@/lib/session";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
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

export default function DashboardClient({ store: initialStore, session }: Props) {
  const router = useRouter();
  const [store, setStore] = useState(initialStore);
  const [activeTab, setActiveTab] = useState<"products" | "settings">("products");
  const [selectedCat, setSelectedCat] = useState<string>(store.categories[0]?.id ?? "");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", currency: "RUB", description: "", image: "" });
  const [newCatName, setNewCatName] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  async function addProduct() {
    if (!newProduct.name || !newProduct.price || !selectedCat) return;
    setSavingProduct(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        currency: newProduct.currency,
        images: newProduct.image ? [newProduct.image] : [],
        categoryId: selectedCat,
      }),
    });
    if (res.ok) {
      setNewProduct({ name: "", price: "", currency: "RUB", description: "", image: "" });
      router.refresh();
    }
    setSavingProduct(false);
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-blue-600 font-bold text-lg">StoreBuilder</Link>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-gray-800">{store.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              store.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {store.status === "PUBLISHED" ? "Опубликован" : "Черновик"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {store.status === "PUBLISHED" && (
              <Link href={`/store/${store.slug}`} target="_blank" className="text-sm text-blue-600 hover:underline">
                Просмотр →
              </Link>
            )}
            <Button variant="ghost" onClick={logout} className="text-sm">
              Выйти
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{store._count.products}</p>
            <p className="text-sm text-gray-500">Товаров</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-2xl font-bold text-green-600">{store.categories.length}</p>
            <p className="text-sm text-gray-500">Категорий</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
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
          {(["products", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab === "products" ? "Товары" : "Настройки"}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Categories sidebar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
              <p className="font-semibold text-sm text-gray-700 mb-3">Категории</p>
              {store.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedCat === cat.id ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50"
                  }`}
                >
                  {cat.name}
                  <span className="ml-1 text-xs opacity-50">({cat.products.length})</span>
                </button>
              ))}
              <div className="pt-2 border-t flex gap-1">
                <input
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1"
                  placeholder="Новая категория..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCategory()}
                />
                <button onClick={addCategory} className="text-blue-600 text-xs font-bold px-1">+</button>
              </div>
            </div>

            {/* Products area */}
            <div className="md:col-span-2 space-y-4">
              {/* Add product form */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
                <p className="font-semibold text-sm text-gray-700">Добавить товар</p>
                <Input placeholder="Название товара" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Цена" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                  <select
                    value={newProduct.currency}
                    onChange={(e) => setNewProduct({ ...newProduct, currency: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="RUB">₽ RUB</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="KZT">₸ KZT</option>
                  </select>
                </div>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                  rows={2}
                  placeholder="Описание..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
                <ImageUpload value={newProduct.image} onChange={(url) => setNewProduct({ ...newProduct, image: url })} label="Фото товара" />
                <Button onClick={addProduct} loading={savingProduct} disabled={!newProduct.name || !newProduct.price} className="w-full justify-center">
                  Добавить товар
                </Button>
              </div>

              {/* Product list */}
              <div className="space-y-2">
                {activeCatProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl shrink-0">📦</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.price.toLocaleString()} {product.currency}</p>
                    </div>
                    <button onClick={() => deleteProduct(product.id)} className="text-red-400 hover:text-red-600 text-xs shrink-0">
                      Удалить
                    </button>
                  </div>
                ))}
                {activeCatProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Нет товаров в этой категории
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="font-semibold text-gray-700 mb-4">Настройки магазина</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>🔗 Ссылка на магазин:{" "}
                <Link href={`/store/${store.slug}`} target="_blank" className="text-blue-600 hover:underline">
                  /store/{store.slug}
                </Link>
              </p>
              <p>🎨 Тема: {store.theme}</p>
              <p className="pt-4">
                <Link href="/create" className="text-blue-600 hover:underline">
                  Пересоздать магазин (новый мастер) →
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
