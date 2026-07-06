import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-16 glass-soft border-x-0 border-b-0">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-[#1428a0] dark:text-blue-400">◆</span>
            {SITE_NAME}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs">
            An independent, unofficial archive of Samsung Galaxy smartphone history. Specifications are compiled from open sources.
          </p>
          <div className="text-gray-500 dark:text-gray-400 mt-3">
            <p className="font-medium text-gray-700 dark:text-gray-200">Contact</p>
            <ul className="mt-1 space-y-0.5">
              <li>
                <a href="mailto:r9430504@gmail.com" className="text-[#1428a0] hover:underline">
                  r9430504@gmail.com
                </a>
              </li>
              <li>
                <a href="mailto:r9430504@icloud.com" className="text-[#1428a0] hover:underline">
                  r9430504@icloud.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Sections</p>
          <ul className="space-y-1 text-gray-500 dark:text-gray-400">
            <li><Link href="/phones" className="hover:text-[#1428a0] dark:hover:text-blue-400">Model catalog</Link></li>
            <li><Link href="/history" className="hover:text-[#1428a0] dark:hover:text-blue-400">Timeline</Link></li>
            <li><Link href="/privacy" className="hover:text-[#1428a0] dark:hover:text-blue-400">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#1428a0] dark:hover:text-blue-400">Terms of Use</Link></li>
            <li><Link href="/disclaimer" className="hover:text-[#1428a0] dark:hover:text-blue-400">Legal information</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">About</p>
          <p className="text-gray-500 dark:text-gray-400">
            <strong className="text-gray-700 dark:text-gray-200">This is not the official Samsung site.</strong>{" "}
            This project is not connected with, affiliated with, or endorsed by Samsung Electronics.
            “Samsung” and “Galaxy” are trademarks of Samsung Electronics and are used purely
            for reference purposes. The site is informational in nature.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} {SITE_NAME} · Unofficial reference resource · <Link href="/disclaimer" className="hover:text-[#1428a0] dark:hover:text-blue-400 underline">Legal information</Link>
      </div>
    </footer>
  );
}
