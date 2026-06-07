"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";

export type ProductDraft = {
  name: string;
  description: string;
  price: string;
  currency: string;
  images: string[];
  categoryIndex: number;
};

interface Props {
  categories: string[];
  products: ProductDraft[];
  onChange: (products: ProductDraft[]) => void;
}

const empty = (categoryIndex: number): ProductDraft => ({
  name: "",
  description: "",
  price: "",
  currency: "RUB",
  images: [],
  categoryIndex,
});

export default function StepProducts({ categories, products, onChange }: Props) {
  const [activeCat, setActiveCat] = useState(0);
  const [form, setForm] = useState<ProductDraft>(empty(activeCat));
  const [editing, setEditing] = useState<number | null>(null);

  const catProducts = products.filter((p) => p.categoryIndex === activeCat);

  function save() {
    if (!form.name || !form.price) return;
    if (editing !== null) {
      const updated = [...products];
      const globalIdx = products.findIndex((p, i) => {
        const catIdx = products.filter((pp) => pp.categoryIndex === activeCat).indexOf(p);
        return p.categoryIndex === activeCat && catIdx === editing;
      });
      updated[globalIdx] = form;
      onChange(updated);
      setEditing(null);
    } else {
      onChange([...products, { ...form, categoryIndex: activeCat }]);
    }
    setForm(empty(activeCat));
  }

  function removeProduct(catLocalIdx: number) {
    let count = 0;
    const updated = products.filter((p) => {
      if (p.categoryIndex !== activeCat) return true;
      if (count === catLocalIdx) { count++; return false; }
      count++;
      return true;
    });
    onChange(updated);
  }

  function switchCat(i: number) {
    setActiveCat(i);
    setForm(empty(i));
    setEditing(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Добавление товаров</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Add products by category</p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => switchCat(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCat === i
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {cat}
            <span className="ml-1 opacity-70">
              ({products.filter((p) => p.categoryIndex === i).length})
            </span>
          </button>
        ))}
      </div>

      {/* Existing products */}
      {catProducts.length > 0 && (
        <div className="space-y-2">
          {catProducts.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border dark:border-gray-700">
              <div className="flex items-center gap-3">
                {p.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                )}
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{p.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.price} {p.currency}</p>
                </div>
              </div>
              <button onClick={() => removeProduct(i)} className="text-red-400 hover:text-red-600 text-xs">
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add product form */}
      <div className="border-2 border-dashed border-blue-200 dark:border-blue-900 rounded-2xl p-4 space-y-3 bg-blue-50/30 dark:bg-blue-950/20">
        <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
          + Новый товар в «{categories[activeCat]}»
        </p>
        <Input
          label="Название товара"
          placeholder="Например: Умная камера 4K"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Цена"
            type="number"
            placeholder="1990"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Валюта</label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
            >
              <option value="RUB">₽ Рубль</option>
              <option value="USD">$ Доллар</option>
              <option value="EUR">€ Евро</option>
              <option value="KZT">₸ Тенге</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Описание</label>
          <textarea
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm resize-none"
            rows={2}
            placeholder="Краткое описание товара..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <ImageUpload
          label="Фото товара"
          value={form.images[0]}
          onChange={(url) => setForm({ ...form, images: [url] })}
        />
        <Button onClick={save} disabled={!form.name || !form.price} className="w-full justify-center">
          Добавить товар
        </Button>
      </div>
    </div>
  );
}
