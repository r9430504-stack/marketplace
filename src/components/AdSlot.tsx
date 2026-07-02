"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  /** ID рекламного блока из AdSense (data-ad-slot). */
  slot?: string;
  /** Формат блока. "auto" — адаптивный. */
  format?: string;
  className?: string;
  /** Подпись над блоком (по требованиям AdSense реклама помечается). */
  label?: string;
};

/**
 * Рекламный блок Google AdSense.
 * Если NEXT_PUBLIC_ADSENSE_CLIENT не задан — показывает плейсхолдер,
 * чтобы вёрстка не «прыгала» и место под рекламу было видно при разработке.
 */
export default function AdSlot({ slot, format = "auto", className = "", label = "Реклама" }: Props) {
  const enabled = Boolean(ADSENSE_CLIENT && slot);

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense-скрипт ещё не загрузился — блок отрисуется при следующей загрузке.
    }
  }, [enabled]);

  return (
    <div className={`my-8 ${className}`}>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1 text-center">
        {label}
      </p>
      {enabled ? (
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex items-center justify-center h-24 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900/40">
          Место для рекламы AdSense
        </div>
      )}
    </div>
  );
}
