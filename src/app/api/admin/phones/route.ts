import { auth, isOwnerEmail } from "@/auth";
import { getCustomPhones, getCustomPhone, upsertCustomPhone, deleteCustomPhone } from "@/lib/db";
import { getPhoneBySlug, type Phone, type SeriesId, type Specs } from "@/lib/phones";

export const runtime = "nodejs";

async function ownerOnly(): Promise<boolean> {
  try {
    const session = await auth();
    return isOwnerEmail(session?.user?.email);
  } catch {
    return false;
  }
}

const str = (v: unknown, max = 400): string => (typeof v === "string" ? v.trim().slice(0, max) : "");
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

// GET /api/admin/phones — owner: list custom models.
export async function GET() {
  if (!(await ownerOnly())) return Response.json({ error: "forbidden" }, { status: 403 });
  const phones = await getCustomPhones();
  return Response.json({ phones });
}

// POST /api/admin/phones — owner: create/update a custom model.
export async function POST(req: Request) {
  if (!(await ownerOnly())) return Response.json({ error: "forbidden" }, { status: 403 });
  const b = await req.json().catch(() => ({} as Record<string, unknown>));

  const name = str(b.name, 80);
  // Any line name is allowed — a built-in one or a new custom line.
  const series = str(b.series, 40) as SeriesId;
  // One "Release date" field does both jobs: it's the human-readable label and
  // the source of the year (for the year range, sorting and filters). Pull the
  // first 4-digit year out of whatever was typed ("January 2025", "2025", …).
  const releaseDate = str(b.releaseDate, 40);
  const yearMatch = releaseDate.match(/\b(19|20)\d\d\b/);
  const year = yearMatch ? Number(yearMatch[0]) : NaN;
  if (name.length < 2) return Response.json({ error: "name" }, { status: 400 });
  if (series.length < 2) return Response.json({ error: "series" }, { status: 400 });
  if (!Number.isFinite(year) || year < 2005 || year > 2100) return Response.json({ error: "year" }, { status: 400 });

  // Editing an existing custom model keeps its slug; otherwise derive a new one.
  const editSlug = typeof b.editSlug === "string" && /^[a-z0-9-]{1,64}$/.test(b.editSlug) ? b.editSlug : "";
  let slug: string;
  if (editSlug && (await getCustomPhone(editSlug))) {
    slug = editSlug;
  } else {
    slug = slugify(name);
    if (!slug) return Response.json({ error: "slug" }, { status: 400 });
    // Don't shadow a built-in model.
    if (getPhoneBySlug(slug)) return Response.json({ error: "exists" }, { status: 409 });
  }

  const specIn = (b.specs ?? {}) as Record<string, unknown>;
  const specs: Specs = {
    display: str(specIn.display, 120) || "—",
    displayType: str(specIn.displayType, 120) || undefined,
    resolution: str(specIn.resolution, 120) || undefined,
    refreshRate: str(specIn.refreshRate, 60) || undefined,
    chipset: str(specIn.chipset, 120) || "—",
    ram: str(specIn.ram, 60) || "—",
    storage: str(specIn.storage, 120) || "—",
    mainCamera: str(specIn.mainCamera, 200) || "—",
    frontCamera: str(specIn.frontCamera, 120) || undefined,
    battery: str(specIn.battery, 80) || "—",
    charging: str(specIn.charging, 80) || undefined,
    os: str(specIn.os, 120) || "—",
    dimensions: str(specIn.dimensions, 120) || undefined,
    weight: str(specIn.weight, 60) || undefined,
    build: str(specIn.build, 120) || undefined,
    waterResistance: str(specIn.waterResistance, 60) || undefined,
    colors: str(specIn.colors, 200) || undefined,
    launchPrice: str(specIn.launchPrice, 60) || undefined,
  };

  const keyFeatures = Array.isArray(b.keyFeatures)
    ? b.keyFeatures.map((x: unknown) => str(x, 60)).filter(Boolean).slice(0, 8)
    : str(b.keyFeatures, 400)
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .slice(0, 8);

  // Image is either a normal URL or an uploaded file as a data: URL (capped
  // to keep the row small — the client already downscales before sending).
  const image = typeof b.image === "string" ? b.image.trim().slice(0, 2_000_000) : "";
  const validImage =
    /^https?:\/\//.test(image) || /^data:image\/(png|jpe?g|webp|gif|avif);base64,/.test(image);
  const phone: Phone = {
    slug,
    name,
    series,
    releaseYear: Math.round(year),
    releaseDate: releaseDate || String(Math.round(year)),
    tagline: str(b.tagline, 200) || name,
    history: str(b.history, 4000) || "",
    keyFeatures,
    specs,
    image: validImage ? image : undefined,
    custom: true,
  };

  try {
    await upsertCustomPhone(phone);
    return Response.json({ ok: true, slug });
  } catch {
    return Response.json({ error: "server" }, { status: 500 });
  }
}

// DELETE /api/admin/phones?slug=... — owner: remove a custom model.
export async function DELETE(req: Request) {
  if (!(await ownerOnly())) return Response.json({ error: "forbidden" }, { status: 403 });
  const slug = new URL(req.url).searchParams.get("slug") || "";
  if (!/^[a-z0-9-]{1,64}$/.test(slug)) return Response.json({ error: "bad_request" }, { status: 400 });
  try {
    await deleteCustomPhone(slug);
  } catch {}
  return Response.json({ ok: true });
}
