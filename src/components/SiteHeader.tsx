import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function SiteHeader() {
  return (
    <nav className="glass border-x-0 border-t-0 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#1428a0] dark:text-blue-400 text-lg">◆</span>
          <span className="leading-tight">
            <span className="block font-bold text-lg text-gray-900 dark:text-gray-100">{SITE_NAME}</span>
            <span className="block text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Not the official Samsung site
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/phones" className="text-gray-600 dark:text-gray-300 hover:text-[#1428a0] dark:hover:text-blue-400 font-medium">
            Catalog
          </Link>
          <Link href="/compare" className="text-gray-600 dark:text-gray-300 hover:text-[#1428a0] dark:hover:text-blue-400 font-medium">
            Compare
          </Link>
          <Link href="/history" className="text-gray-600 dark:text-gray-300 hover:text-[#1428a0] dark:hover:text-blue-400 font-medium">
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
