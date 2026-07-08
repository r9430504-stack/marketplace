import type { Specs } from "@/lib/phones";
import type { Locale } from "@/lib/i18n";

const ROWS: { key: keyof Specs; label: string }[] = [
  { key: "display", label: "Display" },
  { key: "resolution", label: "Resolution" },
  { key: "displayType", label: "Panel type" },
  { key: "refreshRate", label: "Refresh rate" },
  { key: "chipset", label: "Chipset" },
  { key: "cpu", label: "CPU" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Storage" },
  { key: "mainCamera", label: "Main camera" },
  { key: "frontCamera", label: "Front camera" },
  { key: "battery", label: "Battery" },
  { key: "charging", label: "Charging" },
  { key: "os", label: "OS" },
  { key: "dimensions", label: "Dimensions" },
  { key: "weight", label: "Weight" },
  { key: "build", label: "Build" },
  { key: "waterResistance", label: "Protection" },
  { key: "colors", label: "Colors" },
  { key: "launchPrice", label: "Launch price" },
];

const RU_LABELS: Record<keyof Specs, string> = {
  display: "Экран",
  resolution: "Разрешение",
  displayType: "Тип матрицы",
  refreshRate: "Частота обновления",
  chipset: "Процессор",
  cpu: "CPU",
  ram: "Оперативная память",
  storage: "Накопитель",
  mainCamera: "Основная камера",
  frontCamera: "Фронтальная камера",
  battery: "Аккумулятор",
  charging: "Зарядка",
  os: "ОС",
  dimensions: "Размеры",
  weight: "Вес",
  build: "Корпус",
  waterResistance: "Защита",
  colors: "Цвета",
  launchPrice: "Цена на старте",
};

export default function SpecTable({ specs, locale = "en" }: { specs: Specs; locale?: Locale }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <table className="w-full text-sm">
        <tbody>
          {ROWS.map(({ key, label }) => {
            const value = specs[key];
            if (!value) return null;
            return (
              <tr
                key={key}
                className="border-b border-white/40 last:border-0 even:bg-white/25"
              >
                <th className="text-left align-top font-medium text-gray-500 dark:text-gray-400 py-3 px-4 w-2/5">
                  {locale === "ru" ? RU_LABELS[key] : label}
                </th>
                <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
