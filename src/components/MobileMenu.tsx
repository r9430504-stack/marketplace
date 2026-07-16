"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, localeFromPathname, withLocale } from "@/lib/i18n";

const RU_READY = new Set<string>(["/phones"]);

// Hamburger menu that holds the nav links on small screens (where they don't
// fit in the header row).
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const path = usePathname() || "/";
  const loc = localeFromPathname(path);
  const T = t(loc).nav;
  const items: [string, string][] = [
    ["/phones", T.catalog],
    ["/compare", T.compare],
    ["/best", T.guides],
    ["/history", T.history],
  ];
  const href = (p: string) => (loc === "ru" && RU_READY.has(p) ? withLocale(p, "ru") : p);

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className="grid h-8 w-8 place-items-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-10 z-20 w-44 rounded-2xl glass shadow-2xl overflow-hidden py-1">
            {items.map(([p, label]) => (
              <Link
                key={p}
                href={href(p)}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
