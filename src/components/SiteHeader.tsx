import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function SiteHeader() {
  return (
    <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-blue-700 dark:text-blue-400 text-lg">◆</span>
          <span className="leading-tight">
            <span className="block font-bold text-lg text-gray-900 dark:text-gray-100">{SITE_NAME}</span>
            <span className="block text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Не официальный сайт Samsung
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/phones" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            Каталог
          </Link>
          <Link href="/history" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
            История
          </Link>
        </div>
      </div>
    </nav>
  );
}
