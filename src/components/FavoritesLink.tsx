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
      className="relative inline-flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-rose-500 dark:hover:text-rose-400 font-medium"
      aria-label={label}
    >
      <span className="text-rose-500 text-base leading-none">♥</span>
      <span className="hidden sm:inline">{label}</span>
      {favorites.length > 0 && (
        <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[11px] font-bold leading-none">
          {favorites.length}
        </span>
      )}
    </Link>
  );
}
