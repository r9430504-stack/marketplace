import { batteryMah, type Phone } from "@/lib/phones";

// ─────────────────────────────────────────────────────────────────────────────
// Automatic "best specs" ranking.
//
// Each phone's key specs are parsed into raw numbers, every metric is
// normalised to 0..1 across the whole catalogue (min–max), and the metrics are
// combined into one weighted score. Because normalisation is relative to the
// current data, the ranking updates itself: add a model with a bigger battery
// or a better camera and it climbs automatically — no manual list to maintain.
// ─────────────────────────────────────────────────────────────────────────────

/** Largest megapixel number in the main-camera string (0 if none). Capped to
 *  ignore odd tokens; the main sensor is virtually always the biggest number. */
export function mainCameraMp(p: Phone): number {
  const nums = (p.specs.mainCamera.match(/\d+/g) ?? []).map(Number).filter((n) => n <= 250);
  return nums.length ? Math.max(...nums) : 0;
}

/** Highest RAM figure in GB (handles "8/12 GB", "12 GB", etc.). */
export function ramGb(p: Phone): number {
  const withUnit = [...p.specs.ram.matchAll(/(\d+)\s*GB/gi)].map((m) => Number(m[1]));
  if (withUnit.length) return Math.max(...withUnit);
  const bare = (p.specs.ram.match(/\d+/g) ?? []).map(Number);
  return bare.length ? Math.max(...bare) : 0;
}

/** Highest storage figure in GB (TB converted to GB). */
export function storageGb(p: Phone): number {
  const vals = [...p.specs.storage.matchAll(/(\d+(?:\.\d+)?)\s*(TB|GB)/gi)].map((m) =>
    m[2].toUpperCase() === "TB" ? Number(m[1]) * 1024 : Number(m[1])
  );
  return vals.length ? Math.max(...vals) : 0;
}

/** Refresh rate in Hz, read from the dedicated field or the display string. */
export function refreshHz(p: Phone): number {
  const src = `${p.specs.refreshRate ?? ""} ${p.specs.display}`;
  const m = src.match(/(\d+)\s*Hz/i);
  return m ? Number(m[1]) : 0;
}

/** Display diagonal in inches (0 if not found). The catalog uses the prime
 *  glyph ″ (U+2033) as well as a plain quote, so accept both. */
export function displayIn(p: Phone): number {
  const m = p.specs.display.match(/(\d+(?:\.\d+)?)\s*(?:inch|″|")/i);
  return m ? Number(m[1]) : 0;
}

type Metric = { get: (p: Phone) => number; weight: number };

// Weights sum to 1. Camera and memory carry the most; a mild recency term acts
// as a proxy for chipset generation and breaks ties toward newer hardware.
const METRICS: Metric[] = [
  { get: mainCameraMp, weight: 0.22 },
  { get: ramGb, weight: 0.16 },
  { get: (p) => batteryMah(p), weight: 0.15 },
  { get: (p) => p.releaseYear, weight: 0.15 },
  { get: refreshHz, weight: 0.12 },
  { get: storageGb, weight: 0.12 },
  { get: displayIn, weight: 0.08 },
];

export type RankedPhone = { phone: Phone; score: number };

/**
 * Rank phones by overall spec quality, best first. `score` is 0..100.
 * A phone missing a spec simply scores low on that metric.
 */
export function rankBySpecs(phones: Phone[]): RankedPhone[] {
  if (phones.length === 0) return [];

  // Per-metric min/max for normalisation.
  const bounds = METRICS.map((m) => {
    const vals = phones.map((p) => m.get(p));
    return { min: Math.min(...vals), max: Math.max(...vals) };
  });

  return phones
    .map((phone) => {
      let score = 0;
      METRICS.forEach((m, i) => {
        const { min, max } = bounds[i];
        const raw = m.get(phone);
        const norm = max > min ? (raw - min) / (max - min) : 0.5;
        score += norm * m.weight;
      });
      return { phone, score: Math.round(score * 1000) / 10 }; // 0..100, 1 decimal
    })
    .sort((a, b) => b.score - a.score || b.phone.releaseYear - a.phone.releaseYear);
}

/** Convenience: the top N phones by spec score. */
export function topBySpecs(phones: Phone[], n: number): Phone[] {
  return rankBySpecs(phones)
    .slice(0, n)
    .map((r) => r.phone);
}
