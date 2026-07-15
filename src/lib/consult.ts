import { getAllPhones, batteryMah, hasRuTranslation, type Phone, type SeriesId } from "./phones";
import { estimateCurrentUsd } from "./pricing";

export type ConsultPhone = {
  slug: string;
  name: string;
  series: SeriesId;
  year: number;
  releaseDate: string;
  tier: "flagship" | "mid" | "budget";
  batteryMah: number;
  cameraMp: number;
  frontMp: number;
  chargingW: number;
  storageGb: number;
  priceUsd: number;
  currentUsd: number;
  fiveG: boolean;
  displayIn: number;
  spen: boolean;
  foldable: boolean;
  water: boolean;
  hasRu: boolean;
};

const FLAGSHIP: SeriesId[] = ["Galaxy S", "Galaxy Note", "Galaxy Z Fold", "Galaxy Z Flip"];

function tierOf(p: Phone): ConsultPhone["tier"] {
  if (FLAGSHIP.includes(p.series)) return /\bfe\b/i.test(p.name) ? "mid" : "flagship";
  // A/M/F/J: mid = A5x/A7x/A8x, M5x/M3x; else budget
  const m = p.name.match(/\b[AM](\d)\d?\b/i);
  if (m && parseInt(m[1], 10) >= 3) return "mid";
  return "budget";
}

function firstNum(re: RegExp, s?: string): number {
  const m = s?.match(re);
  return m ? parseFloat(m[1].replace(/,/g, "")) : 0;
}

/** Largest storage capacity in GB, understanding "256 / 512 GB / 1 TB". */
function maxStorageGb(s?: string): number {
  if (!s) return 0;
  let max = 0;
  for (const m of s.matchAll(/(\d[\d.,]*)\s*(TB|GB)/gi)) {
    const n = parseFloat(m[1].replace(/,/g, "")) * (/tb/i.test(m[2]) ? 1024 : 1);
    if (n > max) max = n;
  }
  return max;
}

export function getConsultPhones(): ConsultPhone[] {
  return getAllPhones()
    .filter((p) => p.image)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      series: p.series,
      year: p.releaseYear,
      releaseDate: p.releaseDate,
      tier: tierOf(p),
      batteryMah: batteryMah(p),
      // The main sensor is the leading number, e.g. "108 + 12 + 12" → 108
      // (older "…, N MP" matching grabbed the smallest/last sensor instead).
      cameraMp: firstNum(/(\d[\d,]*)/, p.specs.mainCamera),
      frontMp: firstNum(/(\d[\d,]*)/, p.specs.frontCamera),
      chargingW: firstNum(/(\d[\d.,]*)\s*W/i, p.specs.charging),
      storageGb: maxStorageGb(p.specs.storage),
      priceUsd: firstNum(/\$\s*(\d[\d,]*)/, p.specs.launchPrice),
      currentUsd: estimateCurrentUsd(firstNum(/\$\s*(\d[\d,]*)/, p.specs.launchPrice), p.releaseYear),
      fiveG:
        /5g/i.test(p.name) ||
        /5g/i.test(p.specs.chipset) ||
        (FLAGSHIP.includes(p.series) && p.releaseYear >= 2020),
      displayIn: firstNum(/(\d+(?:\.\d+)?)/, p.specs.display),
      spen:
        p.series === "Galaxy Note" ||
        (p.series === "Galaxy S" && /ultra/i.test(p.name) && p.releaseYear >= 2022),
      foldable: p.series === "Galaxy Z Fold" || p.series === "Galaxy Z Flip",
      water: Boolean(p.specs.waterResistance && /IP\d/i.test(p.specs.waterResistance)),
      hasRu: hasRuTranslation(p.slug),
    }));
}

/** A compact plain-text catalog of every model, used to ground the AI chat. */
export function getCatalogText(): string {
  return getAllPhones()
    .map((p) => {
      const s = p.specs;
      const bits = [
        s.display,
        s.chipset,
        s.ram,
        s.mainCamera,
        s.battery,
        s.waterResistance,
      ]
        .filter(Boolean)
        .join(", ");
      return `- ${p.name} (${p.releaseDate}, ${p.series}): ${bits} — /phones/${p.slug}`;
    })
    .join("\n");
}

export type Use = "camera" | "gaming" | "battery" | "spen" | "compact" | "foldable";

/** Rank phones for the chosen tier + use-cases; returns the top matches. */
export function recommend(
  phones: ConsultPhone[],
  tier: ConsultPhone["tier"] | "any",
  uses: Use[],
  limit = 3
): ConsultPhone[] {
  let pool = tier === "any" ? phones : phones.filter((p) => p.tier === tier);
  if (uses.includes("foldable")) pool = pool.filter((p) => p.foldable);
  if (uses.includes("spen")) pool = pool.filter((p) => p.spen);
  if (pool.length === 0) pool = tier === "any" ? phones : phones.filter((p) => p.tier === tier);
  if (pool.length === 0) pool = phones;

  const score = (p: ConsultPhone) => {
    let s = (p.year - 2010) * 3; // recency baseline
    if (uses.includes("battery")) s += p.batteryMah / 400;
    if (uses.includes("camera")) s += p.cameraMp / 8;
    if (uses.includes("gaming")) s += (p.tier === "flagship" ? 25 : p.tier === "mid" ? 8 : 0);
    if (uses.includes("compact")) s += p.displayIn ? (7 - p.displayIn) * 8 : 0;
    if (uses.includes("foldable")) s += p.foldable ? 20 : 0;
    if (uses.includes("spen")) s += p.spen ? 20 : 0;
    return s;
  };

  return [...pool].sort((a, b) => score(b) - score(a)).slice(0, limit);
}
