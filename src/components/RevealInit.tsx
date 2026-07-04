"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Gentle motion, all JS-optional (see the <noscript> fallback):
 *  1. On first paint, elements with .reveal slide in from the right as they
 *     approach the viewport (scroll reveal).
 *  2. Content added AFTER first paint — e.g. the catalog filter, which swaps
 *     the whole card grid — is revealed IMMEDIATELY, so filtered results never
 *     stay invisible waiting for a scroll that the user doesn't expect to need.
 *  3. Images with .img-fade fade in softly once loaded instead of popping.
 *
 * Respects prefers-reduced-motion.
 */
export default function RevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsIO = "IntersectionObserver" in window;

    // --- Images: mark already-decoded ones + catch every future load globally ---
    const onLoadCapture = (e: Event) => {
      const t = e.target;
      if (t instanceof HTMLImageElement && t.classList.contains("img-fade")) {
        t.classList.add("loaded");
      }
    };
    document.addEventListener("load", onLoadCapture, true);
    document.addEventListener("error", onLoadCapture, true);
    const markCompleteImages = () => {
      document
        .querySelectorAll<HTMLImageElement>("img.img-fade:not(.loaded)")
        .forEach((img) => {
          if (img.complete && img.naturalWidth > 0) img.classList.add("loaded");
        });
    };

    // --- Scroll reveal (first paint only) ---
    let idx = 0;
    const io =
      supportsIO && !reduce
        ? new IntersectionObserver(
            (entries, obs) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target as HTMLElement;
                el.style.transitionDelay = `${Math.min(idx++ % 8, 6) * 40}ms`;
                el.classList.add("in");
                obs.unobserve(el);
              });
            },
            // start ~18% below the fold so cards settle before you reach them
            { rootMargin: "0px 0px 18% 0px", threshold: 0.01 }
          )
        : null;

    // Reveal everything on screen right now (no scroll required).
    const revealNow = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.in)")
        .forEach((el) => el.classList.add("in"));
    };

    let mo: MutationObserver | null = null;
    const t = window.setTimeout(() => {
      // First pass: scroll-reveal the initial cards (or show all if no IO).
      if (io) {
        document
          .querySelectorAll<HTMLElement>(".reveal:not(.in)")
          .forEach((el) => io.observe(el));
      } else {
        revealNow();
      }
      markCompleteImages();

      // From now on, anything added to the DOM (filter results, etc.) is
      // revealed immediately — it still animates via the CSS transition.
      let raf = 0;
      mo = new MutationObserver(() => {
        if (raf) return;
        raf = window.requestAnimationFrame(() => {
          raf = 0;
          revealNow();
          markCompleteImages();
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }, 60);

    return () => {
      window.clearTimeout(t);
      mo?.disconnect();
      io?.disconnect();
      document.removeEventListener("load", onLoadCapture, true);
      document.removeEventListener("error", onLoadCapture, true);
    };
  }, [pathname]);

  return null;
}
