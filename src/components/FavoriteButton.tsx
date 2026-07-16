"use client";

import { useFavorites } from "@/lib/saved";

/** Heart toggle. Works inside a card <Link> — stops the click from navigating. */
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
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      title={active ? "In favorites" : "Add to favorites"}
      className={`grid place-items-center rounded-full transition-transform active:scale-90 ${
        size === "lg" ? "h-10 w-10 text-2xl" : "h-8 w-8 text-lg"
      } ${active ? "text-rose-500" : "text-gray-400 hover:text-rose-400"} ${className}`}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
