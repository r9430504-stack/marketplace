"use client";

import Link from "next/link";
import { useRef } from "react";

type Item = { slug: string; name: string; image: string };

/**
 * The hero product cluster: phones float gently and the whole group tilts
 * toward the cursor (subtle 3D parallax). Motion only — no colour or layout
 * change. Respects prefers-reduced-motion via CSS (.floaty / .hero-parallax).
 */
export default function HeroShowcase({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="[perspective:1200px]"
    >
      <div className="hero-parallax grid grid-cols-2 gap-4">
        {items.map((p, i) => (
          <Link
            key={p.slug}
            href={`/phones/${p.slug}`}
            className={`group relative rounded-2xl overflow-hidden glass hover:shadow-xl transition-shadow duration-300 aspect-[4/5] ${
              i % 2 === 1 ? "translate-y-6" : ""
            }`}
          >
            <div
              className="floaty h-full w-full"
              style={{ animationDelay: `${i * 0.55}s` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/models/thumbs/${p.slug}.webp`}
                alt={p.name}
                className="img-fade h-full w-full object-contain bg-white"
                width={480}
                height={600}
                loading="eager"
                decoding="async"
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            </div>
            <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/55 to-transparent p-3 text-white text-sm font-semibold">
              {p.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
