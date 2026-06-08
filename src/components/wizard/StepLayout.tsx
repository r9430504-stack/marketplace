"use client";
import { LAYOUTS, Layout } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  value: Layout;
  onChange: (layout: Layout) => void;
}

export default function StepLayout({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Как сделать ваш магазин?</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Choose your store layout</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Это структура страницы — расположение шапки, меню и товаров. Цвета выберем дальше.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {LAYOUTS.map((l) => (
          <button
            key={l.id}
            onClick={() => onChange(l.id)}
            className={cn(
              "text-left rounded-2xl p-4 border-2 transition-all hover:scale-[1.01] flex gap-3",
              value === l.id
                ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900 bg-blue-50/50 dark:bg-blue-950/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}
          >
            <span className="text-3xl shrink-0">{l.emoji}</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {l.nameRu} <span className="text-xs font-normal text-gray-400 dark:text-gray-500">/ {l.nameEn}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-snug">{l.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
