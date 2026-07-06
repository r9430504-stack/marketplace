// Base site URL. Can be overridden via the NEXT_PUBLIC_SITE_URL variable in
// Railway; defaults to the site's own custom domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://galaxyarchive.org"
).replace(/\/$/, "");

export const SITE_NAME = "Galaxy Archive";
export const SITE_TITLE = "Galaxy Archive — the history of Samsung Galaxy phones";
export const SITE_DESCRIPTION =
  "An unofficial archive of Samsung Galaxy smartphone history: the S, Note, foldable Z Fold and Z Flip flagships, plus the A, M and other lines. Specifications, release dates and model search. This site is not affiliated with Samsung.";

// Google AdSense: a client ID like "ca-pub-XXXXXXXXXXXXXXXX" (public, not a secret).
// Defaults to this project's ID; can be overridden with NEXT_PUBLIC_ADSENSE_CLIENT.
// If empty, ad-block placeholders are shown on the pages.
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-5985897167482706";

// Default AdSense ad-unit (data-ad-slot). Overridable via NEXT_PUBLIC_ADSENSE_SLOT.
export const ADSENSE_SLOT =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT || "6245052133";
