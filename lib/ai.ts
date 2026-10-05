// All provider-specific code lives here.
import { GoogleGenAI } from "@google/genai";
import { ModelOutputSchema, modelJsonSchema } from "./schema";
import { SYSTEM_PROMPT, buildPrompt } from "./prompts";
import type { Analysis } from "@/types/steelman";

export class AppError extends Error {
  constructor(message: string, public status = 500) { super(message); }
}

function extractJson(text: string): unknown {
  try { return JSON.parse(text); } catch {}
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(text.slice(a, b + 1)); } catch {} }
  return null;
}

export async function runSteelman(claim: string, quick = false): Promise<Analysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!apiKey || !model) throw new AppError("The server is missing GEMINI_API_KEY or AI_MODEL. See the README.", 500);

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(claim, quick);
  const schema = modelJsonSchema();
  const thinking = { thinkingLevel: quick ? "MINIMAL" : "HIGH" };

  // Try the richest configuration first, then degrade gracefully if the model rejects it.
  const attempts: Array<{ contents: string; config: Record<string, unknown> }> = [
    { contents: prompt, config: { systemInstruction: SYSTEM_PROMPT, responseMimeType: "application/json", responseJsonSchema: schema, thinkingConfig: thinking, temperature: 0.4 } },
    { contents: prompt, config: { systemInstruction: SYSTEM_PROMPT, responseMimeType: "application/json", responseJsonSchema: schema, temperature: 0.4 } },
    { contents: `${SYSTEM_PROMPT}\n\n${prompt}\n\nJSON Schema:\n${JSON.stringify(schema)}`, config: { temperature: 0.4 } },
  ];

  let text = "";
  let lastErr: unknown;
  for (const a of attempts) {
    try {
      const res = await ai.models.generateContent({ model, contents: a.contents, config: a.config as never });
      text = res.text ?? "";
      if (text) break;
    } catch (e) {
      lastErr = e;
      const msg = String((e as Error)?.message ?? e);
      if (/429|quota|RESOURCE_EXHAUSTED/i.test(msg)) throw new AppError("Rate limit reached. Wait a minute and try again.", 429);
      if (/timeout|DEADLINE|fetch failed|ENOTFOUND/i.test(msg)) throw new AppError("The AI service did not respond in time. Try again.", 504);
      if (/API key|401|403|PERMISSION/i.test(msg)) throw new AppError("The AI service rejected the API key. Check GEMINI_API_KEY.", 502);
      // otherwise (e.g. 400 unsupported option) try the next, simpler configuration
    }
  }
  if (!text) { console.error("AI call failed:", lastErr); throw new AppError("The AI service returned no result. Check AI_MODEL and try again.", 502); }

  const json = extractJson(text);
  const parsed = ModelOutputSchema.safeParse(json);
  if (!parsed.success) throw new AppError("The AI returned an invalid analysis. Please try again.", 502);

  // Server-side total: never trust a model-supplied sum.
  const stages = parsed.data.stages.map((s) => ({
    ...s,
    score: { ...s.score, total: s.score.logicalRigor.score + s.score.relevance.score + s.score.resistanceToRebuttal.score },
  }));
  return { ...parsed.data, claim, stages };
}
