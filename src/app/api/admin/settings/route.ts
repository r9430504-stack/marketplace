import { auth, isOwnerEmail } from "@/auth";
import { getSiteSettings, setSiteSettings } from "@/lib/db";
import { cleanText } from "@/lib/moderation";

export const runtime = "nodejs";

// Editable text keys the owner may change (whitelist).
const KEYS = ["home_title_en", "home_title_ru", "home_subtitle_en", "home_subtitle_ru"] as const;
const MAX: Record<string, number> = {
  home_title_en: 160,
  home_title_ru: 160,
  home_subtitle_en: 600,
  home_subtitle_ru: 600,
};

async function ownerOnly(): Promise<boolean> {
  try {
    const session = await auth();
    return isOwnerEmail(session?.user?.email);
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await ownerOnly())) return Response.json({ error: "forbidden" }, { status: 403 });
  const all = await getSiteSettings();
  const settings: Record<string, string> = {};
  for (const k of KEYS) settings[k] = all[k] ?? "";
  return Response.json({ settings });
}

export async function POST(req: Request) {
  if (!(await ownerOnly())) return Response.json({ error: "forbidden" }, { status: 403 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const entries: Record<string, string> = {};
  for (const k of KEYS) {
    if (k in body) entries[k] = cleanText(body[k], MAX[k]);
  }
  try {
    await setSiteSettings(entries);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "server" }, { status: 500 });
  }
}
