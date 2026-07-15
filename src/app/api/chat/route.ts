import { getCatalogText, getConsultPhones } from "@/lib/consult";
import { answerLocal } from "@/lib/consultEngine";

export const runtime = "nodejs";

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

// Result of a provider call: either a reply, or an error with a human-readable
// detail we surface to the widget for debugging.
type CallResult =
  | { reply: string }
  | { error: string; detail: string; status?: number };

/** Pick the chat provider from whichever API key is configured.
 * Order: explicit CHAT_PROVIDER wins, otherwise Groq → OpenRouter → Gemini. */
type Provider =
  | { name: "gemini"; key: string; model: string }
  | { name: "openai"; label: string; key: string; model: string; url: string; extraHeaders?: Record<string, string> };

function pickProvider(): Provider | null {
  const groq = process.env.GROQ_API_KEY;
  const openrouter = process.env.OPENROUTER_API_KEY;
  const gemini = process.env.GEMINI_API_KEY;
  const forced = (process.env.CHAT_PROVIDER || "").toLowerCase();

  const groqProvider = (): Provider | null =>
    groq
      ? {
          name: "openai",
          label: "groq",
          key: groq,
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          url: "https://api.groq.com/openai/v1/chat/completions",
        }
      : null;

  const openrouterProvider = (): Provider | null =>
    openrouter
      ? {
          name: "openai",
          label: "openrouter",
          key: openrouter,
          model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
          url: "https://openrouter.ai/api/v1/chat/completions",
          extraHeaders: {
            "HTTP-Referer": "https://galaxyarchive.org",
            "X-Title": "Galaxy Archive",
          },
        }
      : null;

  const geminiProvider = (): Provider | null =>
    gemini
      ? { name: "gemini", key: gemini, model: process.env.GEMINI_MODEL || "gemini-2.0-flash" }
      : null;

  if (forced === "groq") return groqProvider();
  if (forced === "openrouter") return openrouterProvider();
  if (forced === "gemini") return geminiProvider();

  return groqProvider() || openrouterProvider() || geminiProvider();
}

async function callOpenAICompatible(
  p: Extract<Provider, { name: "openai" }>,
  locale: string,
  messages: Msg[]
): Promise<CallResult> {
  const res = await fetch(p.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${p.key}`,
      ...(p.extraHeaders ?? {}),
    },
    body: JSON.stringify({
      model: p.model,
      temperature: 0.4,
      max_tokens: 600,
      messages: [{ role: "system", content: systemPrompt(locale) }, ...messages],
    }),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const j = await res.json();
      detail = j?.error?.message || JSON.stringify(j).slice(0, 300);
    } catch {
      detail = (await res.text().catch(() => "")).slice(0, 300);
    }
    return { error: "upstream", status: res.status, detail: `[${p.label}] ${detail}` };
  }
  const data = await res.json();
  const reply = (data?.choices?.[0]?.message?.content ?? "").trim();
  if (!reply) {
    return { error: "empty_reply", detail: `[${p.label}] ${data?.choices?.[0]?.finish_reason || "empty response"}` };
  }
  return { reply };
}

async function callGemini(
  p: Extract<Provider, { name: "gemini" }>,
  locale: string,
  messages: Msg[]
): Promise<CallResult> {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${p.model}:generateContent?key=${p.key}`,
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
    let detail = "";
    try {
      const errJson = await res.json();
      detail = errJson?.error?.message || JSON.stringify(errJson).slice(0, 300);
    } catch {
      detail = (await res.text().catch(() => "")).slice(0, 300);
    }
    return { error: "upstream", status: res.status, detail: `[gemini] ${detail}` };
  }
  const data = await res.json();
  const reply = (
    data?.candidates?.[0]?.content?.parts?.map((x: { text?: string }) => x.text).join("") ?? ""
  ).trim();
  if (!reply) {
    const reason =
      data?.candidates?.[0]?.finishReason ||
      data?.promptFeedback?.blockReason ||
      "empty response";
    return { error: "empty_reply", detail: `[gemini] ${reason}` };
  }
  return { reply };
}

export async function POST(req: Request) {
  const provider = pickProvider();

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
  const messages: Msg[] = (body.messages ?? [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));

  if (messages.length === 0) {
    return Response.json({ error: "empty" }, { status: 400 });
  }

  // Recent user messages drive our own engine (last one leads; earlier ones
  // add context so short follow-ups like "а подешевле?" still work).
  const userTexts = messages.filter((m) => m.role === "user").map((m) => m.content);
  const localReply = () => answerLocal(userTexts, locale, getConsultPhones());

  // No cloud provider configured → always answer with our own engine.
  if (!provider) {
    return Response.json({ reply: localReply() });
  }

  // A provider is configured → use it as the "nice narrator", but never let a
  // provider failure break the consultant: fall back to our own engine.
  try {
    const result =
      provider.name === "gemini"
        ? await callGemini(provider, locale, messages)
        : await callOpenAICompatible(provider, locale, messages);

    if ("reply" in result) {
      return Response.json({ reply: result.reply });
    }
    return Response.json({ reply: localReply(), degraded: result.detail });
  } catch {
    return Response.json({ reply: localReply(), degraded: "network" });
  }
}
