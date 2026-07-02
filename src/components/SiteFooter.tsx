import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400">◆</span>
            {SITE_NAME}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs">
            Независимый архив истории смартфонов Samsung Galaxy. Характеристики приведены по официальным данным производителя.
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Разделы</p>
          <ul className="space-y-1 text-gray-500 dark:text-gray-400">
            <li><Link href="/phones" className="hover:text-blue-600 dark:hover:text-blue-400">Каталог моделей</Link></li>
            <li><Link href="/history" className="hover:text-blue-600 dark:hover:text-blue-400">Хронология</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">О проекте</p>
          <p className="text-gray-500 dark:text-gray-400">
            Samsung и Galaxy — товарные знаки Samsung Electronics. Сайт не связан с компанией и носит справочный характер.
          </p>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 py-4 text-center text-xs text-gray-400 dark:text-gray-600">
        © {new Date().getFullYear()} {SITE_NAME}
      </div>
    </footer>
  );
}
