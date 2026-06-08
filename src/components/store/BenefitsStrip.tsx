import { cn } from "@/lib/utils";
import { ThemeConfig } from "@/types";

const BENEFITS = [
  { icon: "🚚", title: "Быстрая доставка", desc: "Доставим в кратчайшие сроки" },
  { icon: "🛡️", title: "Гарантия качества", desc: "На всю продукцию" },
  { icon: "🎧", title: "Поддержка", desc: "Всегда на связи с вами" },
  { icon: "💳", title: "Удобная оплата", desc: "Наличные и перевод" },
];

interface Props {
  theme: ThemeConfig;
  variant?: "strip" | "grid";
  deliveryInfo?: string | null;
}

export default function BenefitsStrip({ theme, variant = "strip", deliveryInfo }: Props) {
  const items = BENEFITS.map((b, i) =>
    i === 0 && deliveryInfo ? { ...b, desc: deliveryInfo.split("\n")[0].slice(0, 60) } : b
  );

  if (variant === "grid") {
    return (
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">Почему мы?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((b) => (
            <div key={b.title} className={cn("rounded-2xl p-6 text-center", theme.card)}>
              <div className="text-4xl mb-3">{b.icon}</div>
              <h3 className="font-bold text-base mb-1">{b.title}</h3>
              <p className="text-sm opacity-60 leading-snug">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className={cn("border-b", theme.border)}>
      <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <span className="text-2xl shrink-0">{b.icon}</span>
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight">{b.title}</p>
              <p className="text-xs opacity-60 truncate">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
