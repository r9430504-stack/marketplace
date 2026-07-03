import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { SITE_NAME } from "@/lib/site";

export default function SiteHeader() {
  return (
    <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-gray-100">
          <span className="text-orange-600 dark:text-orange-400">◆</span>
          {SITE_NAME}
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/phones" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium">
            Каталог
          </Link>
          <Link href="/history" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium">
            История
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
