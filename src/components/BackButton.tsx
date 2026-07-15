"use client";

import { useRouter } from "next/navigation";

/**
 * A clear "← Back" control. Goes back in browser history when there is any,
 * otherwise falls back to a sensible page (so it still works when someone
 * opened the page from a direct/shared link).
 */
export default function BackButton({
  fallback = "/phones",
  label = "Back",
}: {
  fallback?: string;
  label?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallback);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-black hover:text-black dark:hover:border-gray-400 dark:hover:text-white transition-colors"
      aria-label={label}
    >
      <span aria-hidden className="text-base leading-none">←</span>
      {label}
    </button>
  );
}
