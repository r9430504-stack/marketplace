import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl">📱</p>
      <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Модель не найдена
      </h1>
      <p className="mt-3 text-gray-500 dark:text-gray-400">
        Такой страницы нет или телефон ещё не добавлен в архив.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link
          href="/phones"
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Открыть каталог
        </Link>
        <Link
          href="/"
          className="border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-2xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
