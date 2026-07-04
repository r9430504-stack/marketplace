"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Two gentle enhancements, both JS-optional (see the <noscript> fallback):
 *  1. Elements with .reveal slide in from the right as they approach the
 *     viewport. Triggered a bit BEFORE they enter so it never snaps at the edge.
 *  2. Images with .img-fade fade in softly once they finish loading, instead
 *     of popping in abruptly. A single capture-phase load listener covers every
 *     image, including ones added later by the catalog filter.
 * Respects prefers-reduced-motion.
 */
export default function RevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Smooth image fade-in (one global listener for all current + future imgs) ---
    const markLoaded = (img: HTMLImageElement) => img.classList.add("loaded");
    const onLoadCapture = (e: Event) => {
      const t = e.target;
      if (t instanceof HTMLImageElement && t.classList.contains("img-fade")) {
        markLoaded(t);
      }
    };
    document.addEventListener("load", onLoadCapture, true);
    document.addEventListener("error", onLoadCapture, true);
    // images already decoded (cache/back-forward) won't fire load — mark them now
    document
      .querySelectorAll<HTMLImageElement>("img.img-fade")
      .forEach((img) => {
        if (img.complete && img.naturalWidth > 0) markLoaded(img);
      });

    // --- Scroll reveal ---
    let cleanup = () => {};
    const t = window.setTimeout(() => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal:not(.in)")
      );
      if (reduce || !("IntersectionObserver" in window)) {
        els.forEach((el) => el.classList.add("in"));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const i = els.indexOf(el);
            el.style.transitionDelay = `${Math.min(Math.max(i, 0), 6) * 40}ms`;
            el.classList.add("in");
            io.unobserve(el);
          });
        },
        // start ~18% below the fold so cards are settling before you reach them
        { rootMargin: "0px 0px 18% 0px", threshold: 0.01 }
      );
      els.forEach((el) => io.observe(el));
      cleanup = () => io.disconnect();
    }, 40);

    return () => {
      window.clearTimeout(t);
      cleanup();
      document.removeEventListener("load", onLoadCapture, true);
      document.removeEventListener("error", onLoadCapture, true);
    };
  }, [pathname]);

  return null;
}
