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

  // Dismiss on the first interaction — but DON'T block it. The overlay is
  // pointer-events-none, so a click/scroll/tap both operates the site and
  // clears the invitation. So the user can use the site right away.
  useEffect(() => {
    if (!show) return;
    const close = () => {
      setShow(false);
      try {
        localStorage.setItem("welcome-seen", "1");
      } catch {}
    };
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart",
    ];
    const opts: AddEventListenerOptions = { passive: true, capture: true, once: true };
    events.forEach((e) => window.addEventListener(e, close, opts));
    return () => events.forEach((e) => window.removeEventListener(e, close, opts));
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      aria-hidden
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="gemini-glow absolute inset-0" />
      <p
        className="relative gemini-text text-3xl sm:text-5xl font-bold tracking-tight px-6 text-center"
        style={{ animation: "fadeIn .6s ease" }}
      >
        {title}
      </p>
    </div>
  );
}
