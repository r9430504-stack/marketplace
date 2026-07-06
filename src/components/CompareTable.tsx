import type { Phone } from "@/lib/phones";

const ROWS: { label: string; get: (p: Phone) => string | undefined }[] = [
  { label: "Release", get: (p) => p.releaseDate },
  { label: "Display", get: (p) => p.specs.display },
  { label: "Display type", get: (p) => p.specs.displayType },
  { label: "Resolution", get: (p) => p.specs.resolution },
  { label: "Refresh rate", get: (p) => p.specs.refreshRate },
  { label: "Chipset", get: (p) => p.specs.chipset },
  { label: "CPU", get: (p) => p.specs.cpu },
  { label: "RAM", get: (p) => p.specs.ram },
  { label: "Storage", get: (p) => p.specs.storage },
  { label: "Main camera", get: (p) => p.specs.mainCamera },
  { label: "Front camera", get: (p) => p.specs.frontCamera },
  { label: "Battery", get: (p) => p.specs.battery },
  { label: "Charging", get: (p) => p.specs.charging },
  { label: "OS", get: (p) => p.specs.os },
  { label: "Water resistance", get: (p) => p.specs.waterResistance },
  { label: "Dimensions", get: (p) => p.specs.dimensions },
  { label: "Weight", get: (p) => p.specs.weight },
  { label: "Build", get: (p) => p.specs.build },
  { label: "Colors", get: (p) => p.specs.colors },
  { label: "Launch price", get: (p) => p.specs.launchPrice },
];

export default function CompareTable({ a, b }: { a: Phone; b: Phone }) {
  const rows = ROWS.map((r) => ({ label: r.label, av: r.get(a), bv: r.get(b) })).filter(
    (r) => r.av || r.bv
  );

  return (
    <div className="overflow-x-auto rounded-2xl glass">
      <table className="w-full text-sm border-collapse min-w-[520px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left font-semibold text-gray-500 dark:text-gray-400 px-4 py-3 w-40">
              Specification
            </th>
            <th className="text-left font-bold text-gray-900 dark:text-gray-100 px-4 py-3">{a.name}</th>
            <th className="text-left font-bold text-gray-900 dark:text-gray-100 px-4 py-3">{b.name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const differ = (r.av ?? "") !== (r.bv ?? "");
            return (
              <tr
                key={r.label}
                className={`border-b border-gray-100 dark:border-gray-800 ${
                  i % 2 ? "bg-gray-50/50 dark:bg-white/[0.02]" : ""
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 align-top">
                  {r.label}
                </td>
                <td className={`px-4 py-3 align-top ${differ ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-600 dark:text-gray-300"}`}>
                  {r.av ?? "—"}
                </td>
                <td className={`px-4 py-3 align-top ${differ ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-600 dark:text-gray-300"}`}>
                  {r.bv ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
