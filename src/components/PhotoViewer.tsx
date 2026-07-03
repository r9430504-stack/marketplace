"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Оборачивает визуал модели. Если есть реальные фото — по клику открывает
 * полноэкранный просмотрщик (лайтбокс) с листанием всех снимков. Если фото
 * нет — просто показывает переданный плейсхолдер, без клика.
 */
export default function PhotoViewer({
  images,
  name,
  children,
}: {
  images: string[];
  name: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const touchX = useRef<number | null>(null);
  const has = images.length > 0;
  const many = images.length > 1;

  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(
    () => setIdx((i) => (i + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  if (!has) return <>{children}</>;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIdx(0);
          setOpen(true);
        }}
        className="group relative block h-full w-full cursor-zoom-in"
        aria-label={`Открыть фото: ${name}`}
      >
        {children}
        <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white opacity-90 backdrop-blur transition-opacity group-hover:opacity-100">
          🔍 {many ? `${images.length} фото` : "Смотреть"}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-black/92 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Фотографии: ${name}`}
        >
          {/* Верхняя панель */}
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-sm font-medium">
              {name}
              {many && (
                <span className="ml-2 text-white/60">
                  {idx + 1} / {images.length}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl hover:bg-white/20"
            >
              ✕
            </button>
          </div>

          {/* Изображение */}
          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden px-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (many && Math.abs(dx) > 40) (dx < 0 ? next : prev)();
              touchX.current = null;
            }}
          >
            {many && (
              <button
                type="button"
                onClick={prev}
                aria-label="Предыдущее фото"
                className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
              >
                ‹
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[idx]}
              alt={`${name} — фото ${idx + 1}`}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
            {many && (
              <button
                type="button"
                onClick={next}
                aria-label="Следующее фото"
                className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
              >
                ›
              </button>
            )}
          </div>

          {/* Миниатюры */}
          {many && (
            <div
              className="flex justify-center gap-2 overflow-x-auto px-4 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Фото ${i + 1}`}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === idx ? "border-orange-500" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
