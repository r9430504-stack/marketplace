"use client";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";

interface BannerData {
  name: string;
  tagline: string;
  bannerImage: string;
  bannerText: string;
  bannerTextColor: string;
}

interface Props {
  value: BannerData;
  onChange: (data: Partial<BannerData>) => void;
}

const PRESET_COLORS = [
  { color: "#ffffff", label: "Белый" },
  { color: "#000000", label: "Чёрный" },
  { color: "#1e3a8a", label: "Синий" },
  { color: "#dc2626", label: "Красный" },
  { color: "#facc15", label: "Жёлтый" },
  { color: "#16a34a", label: "Зелёный" },
];

export default function StepBanner({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Оформление магазина</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Store appearance</p>
      </div>

      <Input
        label="Название магазина / Store name"
        placeholder="Например: SmartHome Pro"
        value={value.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />

      <Input
        label="Слоган / Tagline"
        placeholder="Например: Умный дом для умных людей"
        value={value.tagline}
        onChange={(e) => onChange({ tagline: e.target.value })}
      />

      <ImageUpload
        label="Главный баннер (обложка) / Hero banner"
        value={value.bannerImage}
        onChange={(url) => onChange({ bannerImage: url })}
      />

      <Input
        label="Текст на баннере / Banner text"
        placeholder="Например: Добро пожаловать в SmartHome Pro!"
        value={value.bannerText}
        onChange={(e) => onChange({ bannerText: e.target.value })}
      />

      {/* Цвет текста на баннере */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Цвет текста на баннере / Banner text color
        </span>
        <p className="text-xs text-gray-400 dark:text-gray-500 -mt-1">
          Если фон баннера светлый — выберите тёмный цвет, чтобы текст был виден
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.color}
              type="button"
              title={c.label}
              onClick={() => onChange({ bannerTextColor: c.color })}
              className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                value.bannerTextColor === c.color
                  ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              style={{ backgroundColor: c.color }}
            />
          ))}
          {/* Свой цвет */}
          <label className="flex items-center gap-2 ml-1 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
            <input
              type="color"
              value={value.bannerTextColor}
              onChange={(e) => onChange({ bannerTextColor: e.target.value })}
              className="w-9 h-9 rounded cursor-pointer bg-transparent border border-gray-300 dark:border-gray-600 p-0.5"
            />
            свой цвет
          </label>
        </div>
      </div>
    </div>
  );
}
