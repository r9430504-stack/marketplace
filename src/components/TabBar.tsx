"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, localeFromPathname, withLocale } from "@/lib/i18n";
import { IconHome, IconGrid, IconCompare, IconChat, IconStar } from "./icons";

// Deep pages that already have a Russian version.
const RU_READY = new Set<string>(["/phones", "/forum", "/compare", "/best", "/history"]);

type Tab = {
  base: string; // canonical EN path used for the active check
  href: string; // locale-aware link target
  label: string;
  Icon: (p: { className?: string; size?: number }) => React.ReactElement;
};

/**
 * iOS-style bottom tab bar for phones. Primary destinations sit one thumb-tap
 * away, the current section is highlighted, and it respects the home-indicator
 * safe area. Hidden on md+ where the header nav takes over.
 */
export default function TabBar() {
  const path = usePathname() || "/";
  const loc = localeFromPathname(path);
  const T = t(loc).nav;
  const home = loc === "ru" ? "/ru" : "/";
  // Strip the /ru prefix so the active check works in both languages.
  const norm = path.replace(/^\/ru(?=\/|$)/, "") || "/";

  const href = (p: string) => (loc === "ru" && RU_READY.has(p) ? withLocale(p, "ru") : p);

  const tabs: Tab[] = [
    { base: "/", href: home, label: loc === "ru" ? "Главная" : "Home", Icon: IconHome },
    { base: "/phones", href: href("/phones"), label: T.catalog, Icon: IconGrid },
    { base: "/compare", href: href("/compare"), label: T.compare, Icon: IconCompare },
    { base: "/forum", href: href("/forum"), label: T.forum, Icon: IconChat },
    { base: "/best", href: href("/best"), label: T.guides, Icon: IconStar },
  ];

  const isActive = (base: string) =>
    base === "/" ? norm === "/" : norm === base || norm.startsWith(base + "/");

  return (
    <nav
      aria-label={loc === "ru" ? "Навигация" : "Navigation"}
      className="tabbar md:hidden fixed bottom-0 inset-x-0 z-40 glass border-x-0 border-b-0 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = isActive(tab.base);
          return (
            <Link
              key={tab.base}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 pt-2 pb-1.5 text-[10px] font-medium leading-none transition-colors active:scale-95 ${
                active
                  ? "text-[#1428a0] dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <tab.Icon size={23} className={active ? "scale-105" : ""} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
