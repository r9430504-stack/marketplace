"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up from 0 to `value` once, when it first scrolls into view.
 * Falls back to the final value instantly under prefers-reduced-motion.
 */
export default function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setN(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || done.current) return;
          done.current = true;
          const dur = 950;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  );
}
