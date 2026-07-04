import type { Specs } from "@/lib/phones";

const ROWS: { key: keyof Specs; label: string }[] = [
  { key: "display", label: "Экран" },
  { key: "resolution", label: "Разрешение" },
  { key: "displayType", label: "Тип матрицы" },
  { key: "refreshRate", label: "Частота обновления" },
  { key: "chipset", label: "Процессор" },
  { key: "cpu", label: "CPU" },
  { key: "ram", label: "Оперативная память" },
  { key: "storage", label: "Накопитель" },
  { key: "mainCamera", label: "Основная камера" },
  { key: "frontCamera", label: "Фронтальная камера" },
  { key: "battery", label: "Аккумулятор" },
  { key: "charging", label: "Зарядка" },
  { key: "os", label: "ОС" },
  { key: "dimensions", label: "Габариты" },
  { key: "weight", label: "Вес" },
  { key: "build", label: "Материалы" },
  { key: "waterResistance", label: "Защита" },
  { key: "colors", label: "Цвета" },
  { key: "launchPrice", label: "Цена на старте" },
];

export default function SpecTable({ specs }: { specs: Specs }) {
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
                  {label}
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
