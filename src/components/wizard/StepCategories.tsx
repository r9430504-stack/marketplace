"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Props {
  value: string[];
  onChange: (cats: string[]) => void;
}

export default function StepCategories({ value, onChange }: Props) {
  const [newCat, setNewCat] = useState("");

  function add() {
    if (!newCat.trim()) return;
    onChange([...value, newCat.trim()]);
    setNewCat("");
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Категории товаров</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Product categories</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Например: Умные камеры, Домофоны, Умные лампочки
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Название категории..."
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="flex-1"
        />
        <Button onClick={add} disabled={!newCat.trim()}>
          + Добавить
        </Button>
      </div>

      <div className="space-y-2">
        {value.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            Пока нет категорий — добавьте первую!
          </p>
        )}
        {value.map((cat, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{cat}</span>
            </div>
            <button
              onClick={() => remove(i)}
              className="text-red-400 hover:text-red-600 text-sm transition-colors"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
