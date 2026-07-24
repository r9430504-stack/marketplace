import type { SeriesId } from "./phones";

/**
 * Longer, unique intro copy for each Galaxy line — used on the /series/[id]
 * landing pages so each line has its own indexable, non-duplicate page.
 */
export const SERIES_INTRO: Record<SeriesId, string> = {
  "Galaxy S":
    "The Galaxy S line is Samsung's flagship series and, since 2010, the annual benchmark for Android phones. Each generation pushes displays, cameras and chipsets forward, and the top-tier Ultra models sit at the very peak of the lineup.",
  "Galaxy Note":
    "The Galaxy Note series defined the “phablet” — large-screen phones paired with the S Pen stylus. From 2011 to 2020 it was Samsung's productivity flagship, and its ideas live on in today's S Ultra models.",
  "Galaxy Z Fold":
    "The Galaxy Z Fold is Samsung's book-style foldable: a phone that opens into a tablet-sized screen. It turned foldables from a concept into a mature, everyday productivity device.",
  "Galaxy Z Flip":
    "The Galaxy Z Flip revived the clamshell format for the foldable era — a full-size phone that folds down to fit in a pocket, with a handy cover screen for quick glances.",
  "Galaxy Z TriFold":
    "The Galaxy Z TriFold is Samsung's tri-fold flagship — two hinges fold the device into three panels, so a pocketable phone opens out into a roughly 10-inch tablet. It sits above the Z Fold as the most ambitious Galaxy foldable yet.",
  "Galaxy A":
    "The Galaxy A series is Samsung's mid-range, bringing flagship-inspired design, big screens and capable cameras to a friendlier price. It's among the best-selling Android lines in the world.",
  "Galaxy M":
    "The Galaxy M line is an online-first, value-focused series built around huge batteries and a low price, aimed largely at emerging markets and younger buyers.",
  "Galaxy J":
    "The Galaxy J series was Samsung's mainstream budget line of the mid-2010s — affordable, widely available phones that brought the Galaxy name to millions of first-time smartphone owners.",
  "Galaxy F":
    "The Galaxy F series is an online-focused line for emerging markets, closely related to the M range, emphasising large batteries and aggressive pricing.",
  "Galaxy Xcover":
    "The Galaxy Xcover line is Samsung's rugged series — MIL-STD-810 durability, replaceable batteries and programmable keys for work in tough, industrial conditions.",
  "Galaxy Mega":
    "The Galaxy Mega was an early “super-sized” line, offering screens that were enormous for their time at a more accessible price than the Note.",
  "Galaxy Grand":
    "The Galaxy Grand was a mass-market, mid-size line of the early-to-mid 2010s, balancing a large display with an affordable price.",
  "Galaxy Ace":
    "The Galaxy Ace was one of Samsung's most iconic budget lines of the early 2010s — compact, affordable phones that introduced huge numbers of people to Android.",
  "Galaxy Alpha":
    "The Galaxy Alpha was a pivotal one-off: the first Galaxy with a premium metal frame, previewing the design language that would define the Galaxy S6 and everything after.",
  "Galaxy Round":
    "The Galaxy Round holds a place in history as the world's first smartphone with a curved display, an experimental 2013 device that hinted at Samsung's future edge screens.",
  "Galaxy Beam":
    "The Galaxy Beam was a genuine curiosity — a smartphone with a built-in pico projector that could throw a big-screen image onto any wall.",
};
