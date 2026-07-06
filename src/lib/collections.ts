import { getAllPhones, type Phone } from "./phones";

export type Collection = {
  slug: string;
  title: string;
  /** Meta description */
  description: string;
  /** Intro paragraph shown on the page */
  intro: string;
  /** Selects and orders the phones in this collection. */
  select: (phones: Phone[]) => Phone[];
};

/** Parse the leading battery capacity in mAh from a spec string. */
function batteryMah(p: Phone): number {
  const m = p.specs.battery.match(/(\d[\d\s,]*)\s*mAh/i);
  return m ? parseInt(m[1].replace(/[\s,]/g, ""), 10) : 0;
}

const hasSPen = (p: Phone) =>
  p.series === "Galaxy Note" ||
  (p.series === "Galaxy S" && /ultra/i.test(p.name) && p.releaseYear >= 2022);

export const COLLECTIONS: Collection[] = [
  {
    slug: "foldable-samsung-phones",
    title: "Every Samsung foldable phone",
    description:
      "All Samsung Galaxy foldables in one place — the book-style Z Fold and the clamshell Z Flip, from the first Galaxy Fold to the latest generation.",
    intro:
      "Samsung's foldables come in two shapes: the book-style Z Fold that opens into a tablet, and the clamshell Z Flip that folds a full-size phone down to pocket size. Here is every foldable Galaxy, newest first.",
    select: (phones) =>
      phones.filter((p) => p.series === "Galaxy Z Fold" || p.series === "Galaxy Z Flip"),
  },
  {
    slug: "samsung-galaxy-ultra-phones",
    title: "Every Galaxy Ultra phone",
    description:
      "All Samsung Galaxy Ultra models — the very top of the flagship lineup, with the biggest screens, best cameras and the S Pen.",
    intro:
      "“Ultra” marks the peak of the Galaxy range: the largest displays, the most advanced cameras and, on the S line, a built-in S Pen. Here is every Galaxy Ultra.",
    select: (phones) => phones.filter((p) => /ultra/i.test(p.name)),
  },
  {
    slug: "samsung-phones-with-s-pen",
    title: "Samsung Galaxy phones with an S Pen",
    description:
      "Every Samsung Galaxy that works with the S Pen stylus — the Note series and the S Ultra flagships.",
    intro:
      "The S Pen turns a Galaxy into a note-taking, drawing and productivity tool. It started with the Note line and now lives on in the S Ultra flagships. These are the Galaxy phones built around it.",
    select: (phones) => phones.filter(hasSPen),
  },
  {
    slug: "samsung-galaxy-big-battery-phones",
    title: "Samsung Galaxy phones with the biggest batteries",
    description:
      "Samsung Galaxy phones with a 5000 mAh battery or larger — the best Galaxy models for all-day and two-day endurance.",
    intro:
      "If battery life is what matters most, these Galaxy phones carry the largest cells — 5000 mAh and up. Ranked from the biggest battery down.",
    select: (phones) =>
      phones
        .filter((p) => batteryMah(p) >= 5000)
        .sort((a, b) => batteryMah(b) - batteryMah(a)),
  },
  {
    slug: "affordable-samsung-galaxy-phones",
    title: "Affordable Samsung Galaxy phones",
    description:
      "Budget and mid-range Samsung Galaxy phones — the A, M, F and J lines that bring the Galaxy experience to a friendlier price.",
    intro:
      "Not everyone needs a flagship. Samsung's A, M, F and J lines deliver big screens, solid cameras and long battery life for far less. Here are the affordable Galaxy phones, newest first.",
    select: (phones) =>
      phones.filter((p) =>
        ["Galaxy A", "Galaxy M", "Galaxy F", "Galaxy J"].includes(p.series)
      ),
  },
  {
    slug: "samsung-galaxy-firsts",
    title: "Samsung Galaxy firsts and landmark models",
    description:
      "The Samsung Galaxy phones that did something first — the first curved screen, the first foldable, the first metal frame and other landmark devices.",
    intro:
      "Some Galaxy phones changed the course of the whole range. These are the landmark models — the firsts and the experiments — that pushed Samsung's design and technology forward.",
    select: (phones) => {
      const order = [
        "galaxy-s",
        "galaxy-note-2",
        "galaxy-beam",
        "galaxy-round",
        "galaxy-alpha",
        "galaxy-s6-edge",
        "galaxy-fold",
        "galaxy-z-flip",
        "galaxy-note-edge",
        "galaxy-s21-ultra",
      ];
      const bySlug = new Map(phones.map((p) => [p.slug, p]));
      return order.map((s) => bySlug.get(s)).filter((p): p is Phone => Boolean(p));
    },
  },
];

export function getCollections(): Collection[] {
  return COLLECTIONS;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function collectionPhones(c: Collection): Phone[] {
  return c.select(getAllPhones());
}
