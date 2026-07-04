"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wraps the model visual. If real photos exist, clicking opens a full-screen
 * viewer (lightbox) that cycles through all shots. If there are no photos,
 * it just shows the given placeholder, with no click.
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
        aria-label={`Open photos: ${name}`}
      >
        {children}
        <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white opacity-90 backdrop-blur transition-opacity group-hover:opacity-100">
          🔍 {many ? `${images.length} photos` : "View"}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-black/92 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Photos: ${name}`}
        >
          {/* Top bar */}
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
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl hover:bg-white/20"
            >
              ✕
            </button>
          </div>

          {/* Image */}
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
                aria-label="Previous photo"
                className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
              >
                ‹
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[idx]}
              alt={`${name} — photo ${idx + 1}`}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
            {many && (
              <button
                type="button"
                onClick={next}
                aria-label="Next photo"
                className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
              >
                ›
              </button>
            )}
          </div>

          {/* Thumbnails */}
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
                  aria-label={`Photo ${i + 1}`}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === idx ? "border-blue-500" : "border-transparent opacity-60 hover:opacity-100"
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
