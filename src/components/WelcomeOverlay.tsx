"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { localeFromPathname } from "@/lib/i18n";

const TITLE = {
  en: "Galaxy AI Consultant",
  ru: "Galaxy AI консультант",
};

export default function WelcomeOverlay() {
  const title = TITLE[localeFromPathname(usePathname() || "/")];
  const [show, setShow] = useState(false);

  // Show the welcome invitation only once, then remember it so it doesn't
  // reappear on every reload.
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
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      role="button"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div className="gemini-glow absolute inset-0 pointer-events-none" aria-hidden />
      <p
        className="relative gemini-text text-3xl sm:text-5xl font-bold tracking-tight px-6 text-center"
        style={{ animation: "fadeIn .6s ease" }}
      >
        {title}
      </p>
    </div>
  );
}
