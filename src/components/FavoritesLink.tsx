"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/lib/saved";
import { localeFromPathname } from "@/lib/i18n";

/** Header link to the favorites page, with a live count badge. */
export default function FavoritesLink() {
  const { favorites } = useFavorites();
  const locale = localeFromPathname(usePathname() || "/");
  const href = locale === "ru" ? "/ru/favorites" : "/favorites";
  const label = locale === "ru" ? "Избранное" : "Favorites";
  return (
    <Link
      href={href}
      className="relative inline-flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-[#1428a0] dark:hover:text-blue-400 font-medium"
      aria-label={label}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="text-[#1428a0] dark:text-blue-400">
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
      {favorites.length > 0 && (
        <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#1428a0] dark:bg-blue-500 text-white text-[11px] font-bold leading-none">
          {favorites.length}
        </span>
      )}
    </Link>
  );
}
