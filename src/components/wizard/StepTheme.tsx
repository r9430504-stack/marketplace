"use client";
import { THEMES, Theme } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  value: Theme;
  onChange: (theme: Theme) => void;
}

export default function StepTheme({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Выберите стиль магазина</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Choose your store style</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={cn(
              "rounded-2xl p-4 border-2 transition-all text-left hover:scale-[1.02]",
              value === theme.id
                ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900 shadow-lg"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}
          >
            <div className={cn("h-24 rounded-xl bg-gradient-to-br mb-3", theme.preview)} />
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{theme.nameRu}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{theme.nameEn}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
