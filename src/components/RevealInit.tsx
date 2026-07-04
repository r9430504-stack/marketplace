"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Smoothly reveals elements with the .reveal class as you scroll
 * (sliding in from the right). One shared IntersectionObserver;
 * re-initialised on page change. Respects prefers-reduced-motion.
 */
export default function RevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
            el.style.transitionDelay = `${Math.min(Math.max(i, 0), 6) * 45}ms`;
            el.classList.add("in");
            io.unobserve(el);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
      );
      els.forEach((el) => io.observe(el));
      cleanup = () => io.disconnect();
    }, 40);

    return () => {
      window.clearTimeout(t);
      cleanup();
    };
  }, [pathname]);

  return null;
}
