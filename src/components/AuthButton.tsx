"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/i18n";

export default function AuthButton() {
  const { data, status } = useSession();
  const locale = localeFromPathname(usePathname() || "/");
  const t =
    locale === "ru"
      ? { in: "Войти", out: "Выйти" }
      : { in: "Sign in", out: "Sign out" };

  if (status === "loading") {
    return <span className="h-8 w-8" aria-hidden />;
  }

  if (data?.user) {
    return (
      <button
        onClick={() => signOut()}
        title={data.user.email ?? t.out}
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#1428a0] dark:hover:text-blue-400 font-medium"
      >
        {data.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.user.image} alt="" className="h-7 w-7 rounded-full" />
        ) : (
          <span className="h-7 w-7 rounded-full bg-[#1428a0] text-white grid place-items-center text-xs font-bold">
            {(data.user.name ?? data.user.email ?? "?").slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="hidden sm:inline">{t.out}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:border-[#1428a0] dark:hover:border-blue-400 transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 16 3 9.1 7.6 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 45c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 36 26.7 37 24 37c-5.3 0-9.7-2.6-11.3-6.9l-6.5 5C9.1 41.4 16 45 24 45z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.8 35.6 45 30.3 45 24c0-1.2-.1-2.3-.4-3.5z" />
      </svg>
      <span>{t.in}</span>
    </button>
  );
}
