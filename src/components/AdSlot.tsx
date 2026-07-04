"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  /** AdSense ad-unit ID (data-ad-slot). */
  slot?: string;
  /** Unit format. "auto" is responsive. */
  format?: string;
  className?: string;
  /** Label above the unit (AdSense requires ads to be marked). */
  label?: string;
};

/**
 * A Google AdSense ad unit.
 * If NEXT_PUBLIC_ADSENSE_CLIENT is not set, shows a placeholder so the
 * layout doesn't shift and the ad space is visible during development.
 */
export default function AdSlot({ slot, format = "auto", className = "", label = "Advertisement" }: Props) {
  const enabled = Boolean(ADSENSE_CLIENT && slot);

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // The AdSense script hasn't loaded yet — the unit renders on the next load.
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
        <div className="flex items-center justify-center h-24 rounded-xl border border-dashed border-white/70 text-xs text-gray-500 bg-white/35 backdrop-blur-md">
          AdSense ad space
        </div>
      )}
    </div>
  );
}
