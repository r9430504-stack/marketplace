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

    // Reveal all currently-pending elements right now (used only when there is
    // no IntersectionObserver, so nothing ever stays stuck at opacity 0).
    const revealAllNow = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.in)")
        .forEach((el) => el.classList.add("in"));
    };

    // Decide how to reveal a single element: cards already in/near the viewport
    // appear straight away; cards further down are handed to the IO so they
    // still slide in from the right as you scroll to them.
    const handle = (el: HTMLElement) => {
      if (el.classList.contains("in")) return;
      if (!io) {
        el.classList.add("in");
        return;
      }
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight * 1.05) el.classList.add("in");
      else io.observe(el);
    };

    let mo: MutationObserver | null = null;
    const t = window.setTimeout(() => {
      // First pass: scroll-reveal the initial cards (or show all if no IO).
      if (io) {
        document
          .querySelectorAll<HTMLElement>(".reveal:not(.in)")
          .forEach((el) => io.observe(el));
      } else {
        revealAllNow();
      }
      markCompleteImages();

      // From now on, only content ADDED after first paint (e.g. the catalog
      // filter swapping the whole card grid) is handled here — so filtered
      // results never stay invisible, while the initial scroll reveal above is
      // left untouched.
      const pending = new Set<HTMLElement>();
      let raf = 0;
      const flush = () => {
        raf = 0;
        pending.forEach(handle);
        pending.clear();
        markCompleteImages();
      };
      mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.matches(".reveal:not(.in)")) pending.add(node);
            node
              .querySelectorAll<HTMLElement>(".reveal:not(.in)")
              .forEach((el) => pending.add(el));
          });
        }
        if (!pending.size || raf) return;
        raf = window.requestAnimationFrame(flush);
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
