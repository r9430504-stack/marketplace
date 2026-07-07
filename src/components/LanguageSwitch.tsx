"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeFromPathname, withLocale } from "@/lib/i18n";

// Paths (locale-stripped) that already have a Russian version. Grows as more
// pages are translated; until a page is ready, the RU link points to /ru home.
const RU_READY = new Set<string>(["/"]);

export default function LanguageSwitch() {
  const path = usePathname() || "/";
  const cur = localeFromPathname(path);
  const stripped = path.replace(/^\/ru(?=\/|$)/, "") || "/";

  const enHref = withLocale(stripped, "en");
  const ruHref = RU_READY.has(stripped) ? withLocale(stripped, "ru") : "/ru";

  const item = (active: boolean) =>
    `px-1.5 py-0.5 rounded ${
      active
        ? "font-bold text-gray-900 dark:text-gray-100"
        : "text-gray-400 hover:text-[#1428a0] dark:hover:text-blue-400"
    }`;

  return (
    <div className="flex items-center text-xs" aria-label="Language">
      <Link href={enHref} className={item(cur === "en")} aria-current={cur === "en" ? "true" : undefined}>
        EN
      </Link>
      <span className="text-gray-300">/</span>
      <Link href={ruHref} className={item(cur === "ru")} aria-current={cur === "ru" ? "true" : undefined}>
        RU
      </Link>
    </div>
  );
}
