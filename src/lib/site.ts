// Base site URL. Can be overridden via the NEXT_PUBLIC_SITE_URL variable in
// Railway; defaults to the site's own custom domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://galaxyarchive.org"
).replace(/\/$/, "");

export const SITE_NAME = "Galaxy Archive";
export const SITE_TITLE = "Galaxy Archive — the history of Samsung Galaxy phones";
export const SITE_DESCRIPTION =
  "An unofficial archive of Samsung Galaxy smartphone history: the S, Note, foldable Z Fold and Z Flip flagships, plus the A, M and other lines. Specifications, release dates and model search. This site is not affiliated with Samsung.";
