// ─────────────────────────────────────────────────────────────
//  Pricing helpers.
//  Launch price comes from the catalog (specs.launchPrice) and is real.
//  "Current price" is an ESTIMATE derived from the launch price and the
//  model's age — phones lose value quickly — shown clearly as approximate.
//  For live prices the phone page links out to marketplaces ("Where to buy").
// ─────────────────────────────────────────────────────────────

/** Parse the leading USD amount from a launch-price string like "$1,299". */
export function parseLaunchUsd(launchPrice?: string): number {
  const m = launchPrice?.match(/\$\s*(\d[\d,]*)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}

/** Rough estimated street/second-hand price today, in USD. Depreciates the
 * launch price by the model's age (≈12% the first year, ≈26%/yr after), with a
 * sensible floor. Returns 0 if we don't have a launch price. */
export function estimateCurrentUsd(
  launchUsd: number,
  year: number,
  now: number = new Date().getFullYear()
): number {
  if (!launchUsd || launchUsd <= 0) return 0;
  const age = Math.max(0, now - year);
  const factor = age <= 0 ? 1 : 0.88 * Math.pow(0.74, age - 1);
  const floor = Math.max(35, launchUsd * 0.05);
  const cur = Math.max(launchUsd * factor, floor);
  return cur >= 200 ? Math.round(cur / 10) * 10 : Math.round(cur / 5) * 5;
}

/** Format a USD amount as "$1,299" (empty string for 0). */
export function fmtUsd(usd: number): string {
  return usd > 0 ? `$${usd.toLocaleString("en-US")}` : "";
}
