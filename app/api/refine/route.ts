import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    let body: { selectedText?: string; feedback?: string; language?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request. Please try again." },
        { status: 400 }
      );
    }
    const { selectedText, feedback, language } = body;
    const outputLanguage = language || "English";

    if (!selectedText?.trim() || !feedback?.trim()) {
      return NextResponse.json(
        { error: "Selected text and feedback are both required" },
        { status: 400 }
      );
    }

    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === "your_openai_api_key_here"
    ) {
      return NextResponse.json(
        { error: "OpenAI API key is missing or invalid. Check your .env.local file." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a clear, natural writing assistant. The user has chosen a rewritten phrase and wants to refine it further. Apply their feedback and output exactly 1 improved version. Always output in ${outputLanguage}. Output only the refined text, no labels or explanation.`,
        },
        {
          role: "user",
          content: `Output language: ${outputLanguage}\n\nCurrent text:\n${selectedText.trim()}\n\nRefinement request:\n${feedback.trim()}`,
        },
      ],
      max_tokens: 512,
      temperature: 0.5,
    });

    const refined = completion.choices[0].message.content?.trim();
    if (!refined) {
      throw new Error("No content generated");
    }

    return NextResponse.json({
      options: [
        {
          id: `refined-${Date.now()}`,
          text: refined,
          label: "Refined",
        },
      ],
    });
  } catch (error: unknown) {
    const raw = getErrorMessage(error);
    console.error("Refine error:", raw, error);
    const message = getFriendlyErrorMessage(error, "refine");
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
