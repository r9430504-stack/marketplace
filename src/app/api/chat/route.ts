import { getCatalogText } from "@/lib/consult";

export const runtime = "nodejs";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

// Very small best-effort in-memory rate limit (per instance): N requests/min/IP.
const hits = new Map<string, number[]>();
function limited(ip: string, max = 12, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > max;
}

type Msg = { role: "user" | "assistant"; content: string };

function systemPrompt(locale: string) {
  return `You are the Galaxy Archive consultant — a friendly, concise expert who ONLY helps people choose and understand Samsung Galaxy phones.

Rules:
- Use ONLY the catalog below. Never invent models, specs or prices. If something isn't in the catalog, say you don't have that model yet.
- Recommend specific models by name and include their link exactly as given (e.g. /phones/galaxy-s24-ultra).
- Keep answers short: 2–5 sentences. Be practical.
- If the question is not about Samsung Galaxy phones, politely steer back.
- Reply in the user's language (${locale === "ru" ? "Russian" : "the language they wrote in, defaulting to English"}).
- When you settle on ONE best model for the user, finish your message with a final separate line in EXACTLY this format: "GOTO: /phones/<slug>" using that model's link from the catalog. Add this line only when you are confident in a single pick, and never more than one GOTO per message.

Catalog (name (release date, line): key specs — link):
${getCatalogText()}`;
}

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json(
      { error: "not_configured", reply: null },
      { status: 503 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "anon";
  if (limited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { messages?: Msg[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const locale = body.locale === "ru" ? "ru" : "en";
  const messages = (body.messages ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));

  if (messages.length === 0) {
    return Response.json({ error: "empty" }, { status: 400 });
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt(locale) }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
        }),
      }
    );
    if (!res.ok) {
      return Response.json({ error: "upstream", status: res.status }, { status: 502 });
    }
    const data = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ?? "";
    return Response.json({ reply: reply.trim() || "…" });
  } catch {
    return Response.json({ error: "network" }, { status: 502 });
  }
}
