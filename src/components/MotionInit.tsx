"use client";

import { useEffect } from "react";

/**
 * Small site-wide motion driver:
 *  1. Renders a thin scroll-progress bar at the very top and scales it to the
 *     page scroll position (transform only — cheap, GPU-friendly).
 *  2. Toggles `data-scrolled` on <html> so the sticky header can lift with a
 *     soft shadow once you leave the top.
 *  3. Adds `.theme-ready` after first paint so the light/dark cross-fade never
 *     animates on the initial (no-flash) theme application.
 */
export default function MotionInit() {
  useEffect(() => {
    const root = document.documentElement;
    // Enable smooth theme transitions only from now on (not on first paint).
    root.classList.add("theme-ready");

    const bar = document.getElementById("scroll-progress");
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = root.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (bar) bar.style.transform = `scaleX(${p})`;
      root.toggleAttribute("data-scrolled", window.scrollY > 4);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scroll-progress-track" aria-hidden>
      <div id="scroll-progress" className="scroll-progress-bar" />
    </div>
  );
}
