"use client";

import { useState } from "react";
import { useFavorites } from "@/lib/saved";

/** Bookmark (flag) toggle. Works inside a card <Link> — stops navigation. */
export default function FavoriteButton({
  slug,
  size = "md",
  className = "",
}: {
  slug: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const active = has(slug);
  const [pop, setPop] = useState(false);
  const px = size === "lg" ? 22 : 18;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
        setPop(true);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      title={active ? "Saved" : "Save to favorites"}
      className={`grid place-items-center rounded-full transition-transform active:scale-90 ${
        size === "lg" ? "h-10 w-10" : "h-8 w-8"
      } ${active ? "text-[#1428a0] dark:text-blue-400" : "text-gray-400 hover:text-[#1428a0] dark:hover:text-blue-400"} ${className}`}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        aria-hidden
        className={pop ? "animate-fav-pop" : undefined}
        onAnimationEnd={() => setPop(false)}
      >
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
      </svg>
    </button>
  );
}
