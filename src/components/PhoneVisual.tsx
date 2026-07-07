import { seriesMeta, type Phone } from "@/lib/phones";

/**
 * Model visual. If a real photo (phone.image) is set, we show it.
 * Otherwise we draw a stylized (generic, copyright-free) phone placeholder
 * in the line's signature gradient: body, camera module, glare and nameplate.
 */
export default function PhoneVisual({
  phone,
  className = "",
  thumb = false,
  eager = false,
}: {
  phone: Phone;
  className?: string;
  /** Use the lightweight ~480px WebP preview (for grids/cards/lists). */
  thumb?: boolean;
  /** Load immediately instead of lazily (for above-the-fold images). */
  eager?: boolean;
}) {
  const s = seriesMeta(phone.series);

  if (phone.image) {
    const src = thumb ? `/models/thumbs/${phone.slug}.webp` : phone.image;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${phone.name} — ${phone.releaseDate}`}
        className={`img-fade w-full h-full object-contain bg-white ${className}`}
        width={thumb ? 480 : 900}
        height={thumb ? 600 : 1125}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    );
  }

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br ${s.from} ${s.to} ${className}`}
      aria-label={phone.name}
    >
      {/* Soft background glow */}
      <div className="absolute -top-1/4 -right-1/4 w-2/3 h-2/3 rounded-full bg-white/10 blur-2xl" />

      {/* Series label */}
      <span className="absolute top-2.5 left-3 z-10 text-white/85 text-[10px] font-semibold uppercase tracking-wider">
        {s.label}
      </span>

      {/* Phone body */}
      <div className="relative h-[82%] aspect-[9/19] max-h-[300px] rounded-[1.5rem] bg-gradient-to-b from-white/20 to-black/25 ring-1 ring-white/30 shadow-2xl overflow-hidden">
        {/* Screen glare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15" />
        <div className="absolute -left-1/3 top-0 h-full w-1/3 rotate-12 bg-white/10" />

        {/* Camera module */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 rounded-lg bg-black/35 p-1 ring-1 ring-white/15">
          <span className="h-2.5 w-2.5 rounded-full bg-black/50 ring-1 ring-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/50 ring-1 ring-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-black/50 ring-1 ring-white/25" />
        </div>

        {/* Nameplate */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-2 text-center">
          <p className="text-white font-bold text-[11px] leading-tight drop-shadow">{phone.name}</p>
          <p className="text-white/75 text-[9px] mt-0.5">{phone.releaseYear}</p>
        </div>
      </div>
    </div>
  );
}
