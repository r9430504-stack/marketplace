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

/** Rough estimated street/second-hand price today, in USD.
 *
 * Depreciation is calibrated to real mid-2026 used-market averages (Swappa,
 * BankMyCell, Back Market) across Galaxy flagships and foldables of different
 * ages:
 *
 *   age 1 (S25 Ultra)   ≈ 50% of launch
 *   age 2 (S24 Ultra)   ≈ 40%
 *   age 3 (S23 Ultra / Z Fold5) ≈ 31%
 *   age 4 (S22 Ultra)   ≈ 25%
 *   age 6 (S20)         ≈ 15%
 *
 * i.e. a steep ~50% drop the first year, then ≈21%/yr after. The current-year
 * model (age 0) still sits near retail. Kept clearly labelled as approximate —
 * exact prices depend on storage, condition and carrier. Returns 0 with no
 * launch price. */
export function estimateCurrentUsd(
  launchUsd: number,
  year: number,
  now: number = new Date().getFullYear()
): number {
  if (!launchUsd || launchUsd <= 0) return 0;
  const age = Math.max(0, now - year);
  const factor = age <= 0 ? 1 : 0.5 * Math.pow(0.79, age - 1);
  const floor = Math.max(30, launchUsd * 0.045);
  const cur = Math.max(launchUsd * factor, floor);
  return cur >= 200 ? Math.round(cur / 10) * 10 : Math.round(cur / 5) * 5;
}

/** Format a USD amount as "$1,299" (empty string for 0). */
export function fmtUsd(usd: number): string {
  return usd > 0 ? `$${usd.toLocaleString("en-US")}` : "";
}
