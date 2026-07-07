import type { Phone } from "./phones";

// Small numeric parsers shared by the comparison views.
function num(re: RegExp, s?: string): number {
  const m = s?.match(re);
  return m ? parseFloat(m[1].replace(/,/g, "")) : 0;
}
export const mah = (p: Phone) => num(/(\d[\d,]*)\s*mAh/i, p.specs.battery);
export const grams = (p: Phone) => num(/(\d+(?:\.\d+)?)\s*g/, p.specs.weight);
export const maxRam = (p: Phone) =>
  Math.max(0, ...[...p.specs.ram.matchAll(/(\d+)\s*GB/gi)].map((m) => parseInt(m[1], 10)));

/** Readable, data-driven "what's different" bullets between two phones. */
export function keyDifferences(a: Phone, b: Phone): string[] {
  const out: string[] = [];
  if (a.specs.chipset !== b.specs.chipset)
    out.push(`Processor: the ${b.name} runs the ${b.specs.chipset}, while the ${a.name} uses the ${a.specs.chipset}.`);
  const ra = maxRam(a), rb = maxRam(b);
  if (ra && rb && ra !== rb)
    out.push(`Memory: the ${(rb > ra ? b : a).name} offers more RAM — up to ${Math.max(ra, rb)} GB vs ${Math.min(ra, rb)} GB.`);
  const ba = mah(a), bb = mah(b);
  if (ba && bb && ba !== bb)
    out.push(`Battery: the ${(bb > ba ? b : a).name} has the larger battery, ${Math.max(ba, bb).toLocaleString()} mAh vs ${Math.min(ba, bb).toLocaleString()} mAh.`);
  if (a.specs.display !== b.specs.display)
    out.push(`Display: ${a.name} — ${a.specs.display}; ${b.name} — ${b.specs.display}.`);
  if (a.specs.mainCamera !== b.specs.mainCamera)
    out.push(`Main camera: ${a.name} — ${a.specs.mainCamera}; ${b.name} — ${b.specs.mainCamera}.`);
  if (a.specs.charging && b.specs.charging && a.specs.charging !== b.specs.charging)
    out.push(`Charging: ${a.name} — ${a.specs.charging}; ${b.name} — ${b.specs.charging}.`);
  const ga = grams(a), gb = grams(b);
  if (ga && gb && ga !== gb)
    out.push(`Weight: the ${(gb < ga ? b : a).name} is lighter at ${Math.min(ga, gb)} g (vs ${Math.max(ga, gb)} g).`);
  if (a.specs.os !== b.specs.os)
    out.push(`Software: ${a.name} shipped with ${a.specs.os}; ${b.name} with ${b.specs.os}.`);
  if (a.specs.launchPrice && b.specs.launchPrice && a.specs.launchPrice !== b.specs.launchPrice)
    out.push(`Launch price: ${a.name} — ${a.specs.launchPrice}; ${b.name} — ${b.specs.launchPrice}.`);
  return out;
}
