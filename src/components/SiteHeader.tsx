import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { getAllPhones, seriesMeta } from "@/lib/phones";
import LanguageSwitch from "./LanguageSwitch";
import HeaderNav from "./HeaderNav";
import ThemeToggle from "./ThemeToggle";
import FavoritesLink from "./FavoritesLink";
import AuthButton from "./AuthButton";
import AdminLink from "./AdminLink";
import BrandMark from "./BrandMark";
import Search from "./Search";

export default function SiteHeader() {
  // Lightweight in-memory index for instant search (no DB hit per page).
  const searchIndex = getAllPhones().map((p) => ({
    slug: p.slug,
    name: p.name,
    line: seriesMeta(p.series).label,
    year: p.releaseYear,
  }));

  return (
    <nav className="glass border-x-0 border-t-0 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <BrandMark size={30} className="shrink-0" />
          <span className="leading-tight">
            <span className="block font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">{SITE_NAME}</span>
            <span className="hidden sm:block text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Not the official Samsung site
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          <div className="hidden md:flex items-center gap-4">
            <HeaderNav />
          </div>
          <Search phones={searchIndex} />
          <FavoritesLink />
          <LanguageSwitch />
          <ThemeToggle />
          <AdminLink />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
