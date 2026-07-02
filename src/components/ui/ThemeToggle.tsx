"use client";
import { useSyncExternalStore } from "react";

// Тема хранится как класс .dark на <html> (его ставит инлайн-скрипт в layout
// до отрисовки). Читаем это внешнее состояние через useSyncExternalStore —
// без setState в эффекте и без рассинхронизации при гидратации.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      title={dark ? "Светлая тема" : "Тёмная тема"}
      aria-label="Переключить тему"
      className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 ${className}`}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
