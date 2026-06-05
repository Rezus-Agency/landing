/**
 * POST /api/icp/transcribe
 *
 * Body : multipart/form-data avec champ "file" (audio Blob).
 * Forward à OpenAI gpt-4o-transcribe avec language=fr et prompt vocab métier.
 * Retourne { text: string }.
 *
 * Pourquoi gpt-4o-transcribe : c'est le moteur de ChatGPT depuis 2025,
 * WER ~4% sur français vs 5,3% pour Whisper Large v3, pas d'hallucinations,
 * gère bien le code-switching FR/EN et le jargon technique B2B. $0.006/min.
 */
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const VOCAB_PROMPT =
  "Transcription d'un fondateur B2B francophone qui parle de stratégie commerciale, " +
  "définition d'ICP, segmentation, prospection, marché cible. " +
  "Termes courants : ICP, B2B, SaaS, SIRH, DRH, CTO, DAF, CRM, outbound, inbound, " +
  "segment, persona, lead, pipeline, churn, ARR, MRR, scale-up, mid-market, " +
  "Rezus Agency, anti-positioning.";

export async function POST(req: Request) {
  // Garde d'auth (en plus du middleware).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "OPENAI_API_KEY non configurée côté serveur.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let inFile: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (f instanceof File) inFile = f;
  } catch {
    return new Response(JSON.stringify({ error: "FormData invalide." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!inFile) {
    return new Response(JSON.stringify({ error: "Fichier audio manquant." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (inFile.size > 25 * 1024 * 1024) {
    return new Response(
      JSON.stringify({ error: "Fichier trop lourd (max 25 Mo, limite OpenAI)." }),
      { status: 413, headers: { "Content-Type": "application/json" } },
    );
  }

  const upstream = new FormData();
  const ext =
    inFile.type.includes("mp4") || inFile.type.includes("m4a")
      ? "mp4"
      : inFile.type.includes("ogg")
        ? "ogg"
        : "webm";
  upstream.append("file", inFile, `voice.${ext}`);
  upstream.append("model", "gpt-4o-transcribe");
  upstream.append("language", "fr");
  upstream.append("prompt", VOCAB_PROMPT);
  // response_format: "json" est par défaut sur gpt-4o-transcribe.

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: upstream,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Network error: ${(err as Error).message}` }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!upstreamRes.ok) {
    const raw = await upstreamRes.text();
    let detail = raw;
    try {
      const parsed = JSON.parse(raw) as { error?: { message?: string } };
      detail = parsed.error?.message || raw;
    } catch {
      // raw text fallback
    }
    return new Response(
      JSON.stringify({ error: `OpenAI ${upstreamRes.status}: ${detail}` }),
      {
        status: upstreamRes.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const data = (await upstreamRes.json()) as { text?: string };
  const text = (data.text || "").trim();
  return new Response(JSON.stringify({ text }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
