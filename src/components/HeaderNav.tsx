"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, localeFromPathname, withLocale } from "@/lib/i18n";

// Deep pages that already have a Russian version (home is handled separately).
const RU_READY = new Set<string>(["/phones", "/forum", "/compare", "/best", "/history"]);

export default function HeaderNav() {
  const path = usePathname() || "/";
  const loc = localeFromPathname(path);
  const T = t(loc).nav;
  // Strip /ru so the active check works in both languages.
  const norm = path.replace(/^\/ru(?=\/|$)/, "") || "/";

  const link = (enPath: string, label: string) => {
    const href = loc === "ru" && RU_READY.has(enPath) ? withLocale(enPath, "ru") : enPath;
    const active = norm === enPath || norm.startsWith(enPath + "/");
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`nav-link font-medium transition-colors ${
          active
            ? "text-[#1428a0] dark:text-blue-400"
            : "text-gray-600 dark:text-gray-300 hover:text-[#1428a0] dark:hover:text-blue-400"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      {link("/phones", T.catalog)}
      {link("/forum", T.forum)}
      {link("/compare", T.compare)}
      <span className="hidden sm:contents">{link("/best", T.guides)}</span>
      {link("/history", T.history)}
    </>
  );
}
