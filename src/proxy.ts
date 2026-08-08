import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "galaxyarchive.org";

/**
 * Canonical-host redirect (Next "proxy" convention — the renamed middleware).
 *
 * Railway also serves the app on its auto-generated *.up.railway.app domain,
 * which used to expose the exact same site as galaxyarchive.org. Two identical
 * domains = duplicate content, and Google suppressed both. Any request that
 * arrives on a *.up.railway.app host is permanently redirected to the canonical
 * domain so all ranking signals consolidate on galaxyarchive.org.
 *
 * Requests already on the canonical host (and local dev) fall straight through.
 */
export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase();

  if (host.endsWith(".up.railway.app")) {
    const url = req.nextUrl.clone();
    url.protocol = "https";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals and static assets — only page/route requests matter.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|models/).*)"],
};
