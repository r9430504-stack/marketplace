"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, localeFromPathname, withLocale } from "@/lib/i18n";

// Deep pages that already have a Russian version (home is handled separately).
const RU_READY = new Set<string>(["/phones", "/forum"]);

export default function HeaderNav() {
  const path = usePathname() || "/";
  const loc = localeFromPathname(path);
  const T = t(loc).nav;

  const cls =
    "nav-link text-gray-600 dark:text-gray-300 hover:text-[#1428a0] dark:hover:text-blue-400 font-medium transition-colors";

  const link = (enPath: string, label: string) => {
    const href = loc === "ru" && RU_READY.has(enPath) ? withLocale(enPath, "ru") : enPath;
    return (
      <Link href={href} className={cls}>
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
