import { seriesMeta, type Phone } from "@/lib/phones";

/**
 * Стилизованная визуальная заглушка телефона: силуэт в фирменном градиенте
 * линейки с названием модели. Используется, пока к модели не добавлено
 * реальное фото (поле phone.image). Если фото задано — показываем его.
 */
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
        alt={phone.name}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br ${s.from} ${s.to} ${className}`}
      aria-label={phone.name}
    >
      {/* Силуэт телефона */}
      <div className="relative w-[46%] max-w-[130px] aspect-[9/19] rounded-[1.4rem] bg-black/25 ring-2 ring-white/30 shadow-2xl flex flex-col items-center justify-between py-3 backdrop-blur-sm">
        <span className="w-8 h-1 rounded-full bg-white/40" />
        <div className="px-2 text-center">
          <p className="text-white/95 font-bold text-[11px] leading-tight drop-shadow">
            {phone.name}
          </p>
          <p className="text-white/70 text-[9px] mt-0.5">{phone.releaseYear}</p>
        </div>
        <span className="w-6 h-6 rounded-full border-2 border-white/40" />
      </div>
      <span className="absolute top-2 left-3 text-white/80 text-[10px] font-semibold uppercase tracking-wider">
        {s.label}
      </span>
    </div>
  );
}
