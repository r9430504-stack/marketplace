"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative parallax backdrop for the hero: two soft navy glows that drift
 * slower than the page as you scroll, adding depth. Purely decorative
 * (aria-hidden, pointer-events-none) and motion-only — no layout impact.
 * Disabled entirely under prefers-reduced-motion.
 */
export default function HeroBackdrop() {
  const glowA = useRef<HTMLDivElement>(null);
  const glowB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (glowA.current)
          glowA.current.style.transform = `translate3d(0, ${y * 0.22}px, 0)`;
        if (glowB.current)
          glowB.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref={glowA}
        className="absolute -top-24 -right-20 h-[34rem] w-[34rem] rounded-full blur-3xl will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(20,40,160,0.10), transparent 70%)",
        }}
      />
      <div
        ref={glowB}
        className="absolute -bottom-32 -left-24 h-[30rem] w-[30rem] rounded-full blur-3xl will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(20,40,160,0.06), transparent 70%)",
        }}
      />
    </div>
  );
}
