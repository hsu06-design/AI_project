import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

type RecommendationRequest = {
  destination?: string;
  country?: string;
  travelDate?: string;
  season?: string;
  weather?: string;
  desiredStyle?: string;
  language?: string;
};

const languageNames: Record<string, string> = {
  ko: "Korean",
  en: "English",
  my: "Burmese",
  vi: "Vietnamese",
  ja: "Japanese",
  zh: "Simplified Chinese",
};

export async function POST(request: Request) {
  const runtimeEnv = env as unknown as { GEMINI_API_KEY?: string };
  const apiKey = runtimeEnv.GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({ error: "Gemini API key is unavailable." }, { status: 503 });
  }

  const body = (await request.json()) as RecommendationRequest;
  const outputLanguage = languageNames[body.language ?? "ko"] ?? languageNames.ko;
  const prompt = `
You are a thoughtful fashion stylist who respects local culture.
Recommend exactly one complete outfit for the user.

Destination or occasion: ${body.destination || "not selected"}
Country: ${body.country || "not selected"}
Date: ${body.travelDate || "not selected"}
Season: ${body.season || "not selected"}
Expected weather: ${body.weather || "not selected"}
Desired style: ${body.desiredStyle || "not selected"}

Write in ${outputLanguage}. Keep it concise and practical.
Include: outfit name, top, bottom, shoes, optional outerwear/accessories,
one cultural or festival etiquette note, and one short reason.
Do not recommend sacred or ceremonial clothing as a costume.
`.trim();

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!response.ok) {
    return Response.json({ error: "Gemini could not create a recommendation." }, { status: 502 });
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const recommendation = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!recommendation) {
    return Response.json({ error: "Gemini returned an empty recommendation." }, { status: 502 });
  }

  return Response.json({ recommendation });
}
