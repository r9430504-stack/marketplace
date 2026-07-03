import type { ReactNode } from "react";
import { seriesMeta, type Phone } from "@/lib/phones";

/**
 * Визуал модели. Если задано реальное фото (phone.image) — показываем его.
 * Иначе рисуем НЕ фото, а генеративный SVG-силуэт конкретного смартфона:
 * форма корпуса, раскладка камер, тип экрана и форм-фактор зависят от
 * года выпуска, серии и характеристик — поэтому модели выглядят по-разному
 * и максимально узнаваемо. Цвет фона кодирует линейку.
 */

type Design = {
  variant: "classic" | "strip" | "module" | "contour" | "island" | "flip" | "fold";
  cams: number;
  pen: boolean;
  fingerprint: boolean;
  boxy: boolean;
  year: number;
};

function countCameras(str: string): number {
  const mult = str.match(/(\d)×/);
  if (mult) return Math.min(Number(mult[1]), 4);
  const parts = str.split("+").filter((p) => /\d/.test(p));
  return Math.min(Math.max(parts.length, 1), 4);
}

function designFor(phone: Phone): Design {
  const y = phone.releaseYear;
  const series = phone.series;
  const cams = countCameras(phone.specs.mainCamera);
  const ultra = /Ultra/.test(phone.name);
  const note = /Note/.test(phone.name);
  const flagship = series === "Galaxy S" || series === "Galaxy Note";

  let variant: Design["variant"];
  if (series === "Galaxy Z Fold" || series === "Galaxy Fold") variant = "fold";
  else if (series === "Galaxy Z Flip") variant = "flip";
  else if (y <= 2016) variant = "classic";
  else if (y <= 2019) variant = "strip";
  else variant = flagship ? (ultra ? "island" : "contour") : "module";

  return {
    variant,
    cams,
    pen: note || ultra,
    fingerprint: variant === "strip",
    boxy: note || ultra,
    year: y,
  };
}

function Lens({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#08080a" stroke="rgba(255,255,255,0.30)" strokeWidth={0.8} />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.3} fill="rgba(150,180,255,0.4)" />
    </>
  );
}

function vLenses(cx: number, top: number, gap: number, n: number, r: number): ReactNode {
  return Array.from({ length: n }).map((_, i) => <Lens key={i} cx={cx} cy={top + i * gap} r={r} />);
}

function cameras(d: Design): ReactNode {
  switch (d.variant) {
    case "classic":
      return (
        <>
          <Lens cx={60} cy={27} r={6.5} />
          <circle cx={60} cy={41} r={2.4} fill="#fde68a" opacity={0.85} />
        </>
      );
    case "strip": {
      const n = d.cams;
      const start = 60 - ((n - 1) * 9) / 2;
      return (
        <>
          {Array.from({ length: n }).map((_, i) => (
            <Lens key={i} cx={start + i * 9} cy={26} r={3.8} />
          ))}
          <circle cx={start + n * 9 - 2} cy={26} r={1.6} fill="#fde68a" opacity={0.85} />
          {d.fingerprint && (
            <circle cx={60} cy={54} r={6} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.4} />
          )}
        </>
      );
    }
    case "module": {
      const n = d.cams;
      const h = 12 + n * 9;
      return (
        <>
          <rect x={41} y={16} width={17} height={h} rx={5} fill="#0d0d0f" stroke="rgba(255,255,255,0.14)" strokeWidth={0.8} />
          {vLenses(49.5, 24, 9, n, 3.5)}
          <circle cx={49.5} cy={24 + n * 9} r={1.4} fill="#fde68a" opacity={0.85} />
        </>
      );
    }
    case "contour": {
      const n = Math.min(d.cams, 3);
      return (
        <>
          <rect x={40} y={15} width={15} height={8 + n * 11} rx={7} fill="rgba(255,255,255,0.05)" />
          {vLenses(47.5, 24, 11, n, 4.4)}
        </>
      );
    }
    case "island": {
      const n = Math.min(d.cams, 4);
      return (
        <>
          {vLenses(47, 23, 12, n, 5.2)}
          <circle cx={62} cy={26} r={1.6} fill="#fde68a" opacity={0.8} />
          <circle cx={62} cy={33} r={1.2} fill="rgba(255,255,255,0.35)" />
        </>
      );
    }
    case "flip":
      return (
        <>
          {/* внешний экран-обложка */}
          <rect x={40} y={14} width={26} height={18} rx={3} fill="#0b0b0d" stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} />
          <Lens cx={74} cy={20} r={3.4} />
          <Lens cx={74} cy={30} r={3.4} />
          {/* линия складки */}
          <line x1={35} y1={100} x2={85} y2={100} stroke="rgba(255,255,255,0.14)" strokeWidth={1.2} />
        </>
      );
    default:
      return null;
  }
}

function Normal({ d, id }: { d: Design; id: string }) {
  const rx = d.boxy ? 8 : 16;
  const x = 34, y = 6, w = 52, h = 188;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#body-${id})`} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      {/* блик */}
      <rect x={x} y={y} width={w * 0.5} height={h} rx={rx} fill="rgba(255,255,255,0.04)" />
      {/* боковые кнопки */}
      <rect x={x + w - 0.6} y={64} width={2.4} height={10} rx={1} fill="rgba(0,0,0,0.5)" />
      <rect x={x + w - 0.6} y={80} width={2.4} height={20} rx={1} fill="rgba(0,0,0,0.5)" />
      {cameras(d)}
      {d.pen && <rect x={44} y={183} width={32} height={2.6} rx={1.3} fill="rgba(255,255,255,0.4)" />}
    </g>
  );
}

function Fold({ id, year }: { id: string; year: number }) {
  return (
    <g>
      <rect x={18} y={18} width={164} height={124} rx={7} fill={`url(#body-${id})`} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      {/* шарнир по центру */}
      <line x1={100} y1={20} x2={100} y2={140} stroke="rgba(0,0,0,0.45)" strokeWidth={1.6} />
      <line x1={100} y1={20} x2={100} y2={140} stroke="rgba(255,255,255,0.07)" strokeWidth={0.6} />
      {/* блик на левой створке */}
      <rect x={22} y={22} width={74} height={116} rx={5} fill="rgba(255,255,255,0.04)" />
      {/* фронтальная камера внутреннего экрана */}
      {year <= 2019 ? (
        <rect x={158} y={24} width={16} height={9} rx={4} fill="#08080a" stroke="rgba(255,255,255,0.25)" strokeWidth={0.7} />
      ) : (
        <circle cx={150} cy={30} r={2.6} fill="#08080a" stroke="rgba(255,255,255,0.28)" strokeWidth={0.7} />
      )}
    </g>
  );
}

export default function PhoneVisual({
  phone,
  className = "",
}: {
  phone: Phone;
  className?: string;
}) {
  const s = seriesMeta(phone.series);

  if (phone.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={phone.image}
        alt={`${phone.name} — ${phone.releaseDate}`}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  const d = designFor(phone);
  const id = phone.slug;
  const fold = d.variant === "fold";

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br ${s.from} ${s.to} ${className}`}
      aria-label={phone.name}
    >
      <div className="absolute -top-1/4 -right-1/4 w-2/3 h-2/3 rounded-full bg-white/10 blur-2xl" />
      <span className="absolute top-2.5 left-3 z-10 text-white/85 text-[10px] font-semibold uppercase tracking-wider">
        {s.label}
      </span>

      <svg
        viewBox={fold ? "0 0 200 160" : "0 0 120 200"}
        className="relative h-[86%] w-[86%]"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.5))" }}
        role="img"
        aria-label={`Схематичное изображение ${phone.name}`}
      >
        <defs>
          <linearGradient id={`body-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b3c42" />
            <stop offset="0.5" stopColor="#202124" />
            <stop offset="1" stopColor="#101012" />
          </linearGradient>
        </defs>
        {fold ? <Fold id={id} year={d.year} /> : <Normal d={d} id={id} />}
      </svg>
    </div>
  );
}
