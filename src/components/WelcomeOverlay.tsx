"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/i18n";

const TXT = {
  en: {
    title: "Meet your Galaxy AI consultant",
    sub: "Ask it anything — it will pick the right phone for you and take you straight to it.",
    hint: "Tap anywhere to continue",
  },
  ru: {
    title: "Знакомьтесь — ИИ-консультант Galaxy",
    sub: "Спросите его — он сам подберёт телефон под вас и откроет его страницу.",
    hint: "Нажмите в любом месте, чтобы продолжить",
  },
};

export default function WelcomeOverlay() {
  const t = TXT[localeFromPathname(usePathname() || "/")];
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("welcome-seen") === "1") return;
    } catch {
      return;
    }
    const id = window.setTimeout(() => setShow(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  if (!show) return null;

  const close = () => {
    setShow(false);
    try {
      localStorage.setItem("welcome-seen", "1");
    } catch {}
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-50 flex items-end justify-center pb-28 sm:pb-32 cursor-pointer"
      role="button"
      aria-label={t.hint}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div className="gemini-frame absolute inset-0 pointer-events-none" aria-hidden />
      <div className="relative text-center px-6 max-w-md" style={{ animation: "fadeIn .5s ease" }}>
        <p className="text-2xl sm:text-3xl font-bold gemini-text">{t.title}</p>
        <p className="text-white/85 mt-3 leading-relaxed">{t.sub}</p>
        <p className="text-white/55 text-sm mt-6">{t.hint}</p>
        <div className="mt-3 text-white/80 text-3xl animate-bounce">↘</div>
      </div>
    </div>
  );
}
