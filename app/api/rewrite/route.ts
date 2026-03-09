import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const { text, tone, context } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === "your_openai_api_key_here"
    ) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key is missing or invalid. Check your .env.local file (copy OPENAI_API_KEY from Essay Web App .env if needed).",
        },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are a clear, natural writing assistant. Your job is to rewrite the user's rough or unclear text into natural expression that fits their chosen tone and context.

Rules:
- Produce exactly 3 distinct rewrite options, each on a new line.
- Each option should be a complete, usable version of their message—not a fragment.
- Vary the options: one might be slightly shorter, one more detailed, one with a different angle, so the user has real choice.
- Preserve the user's intent and key information; only improve clarity and tone.
- Do not add preamble, labels, or numbering. Output only the 3 lines of text, one per option.`;

    const userPrompt = `Tone: ${tone || "Professional"}\nContext: ${context || "Email"}\n\nRewrite this into 3 natural options:\n\n${text.trim()}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    const options = content
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    if (options.length === 0) {
      throw new Error("No valid options parsed");
    }

    return NextResponse.json({
      options: options.map((text, i) => ({
        id: `opt-${i}-${Date.now()}`,
        text,
        label: ["Option 1", "Option 2", "Option 3"][i],
      })),
    });
  } catch (error: unknown) {
    const raw = getErrorMessage(error);
    console.error("Rewrite error:", raw, error);
    const message = getFriendlyErrorMessage(error, "rewrite");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string")
    return (error as { message: string }).message;
  if (error && typeof error === "object" && "error" in error) {
    const err = (error as { error: unknown }).error;
    if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string")
      return (err as { message: string }).message;
  }
  return String(error);
}

function getFriendlyErrorMessage(error: unknown, action: "rewrite" | "refine"): string {
  const fallback = "Failed to refine expression. Please try again.";
  const msg = getErrorMessage(error).toLowerCase();
  if (msg.includes("api key") || msg.includes("invalid_api_key") || msg.includes("incorrect api key") || msg.includes("401"))
    return "OpenAI API key is missing or invalid. Check .env.local and get a key at platform.openai.com.";
  if (msg.includes("rate") || msg.includes("429") || msg.includes("quota"))
    return "Too many requests or quota exceeded. Wait a moment or check your OpenAI account.";
  if (msg.includes("network") || msg.includes("fetch") || msg.includes("econnrefused"))
    return "Network error. Check your connection and try again.";
  if (error instanceof Error && error.message) return error.message;
  if (msg && msg !== "undefined" && msg !== "null") return getErrorMessage(error);
  return fallback;
}
