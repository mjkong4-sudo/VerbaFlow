import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file?.size || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload an image file (PNG, JPEG, or WebP)." },
        { status: 400 }
      );
    }

    if (
      !process.env.OPENAI_API_KEY ||
      process.env.OPENAI_API_KEY === "your_openai_api_key_here"
    ) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type || "image/png";

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a text extraction assistant. The user will send an image. Extract ALL text from the image exactly as it appears, preserving line breaks and paragraph structure. Do not add any commentary, headings, or corrections. If the image contains no text, respond with a single empty line. Output only the extracted text.`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 1024,
    });

    const text = completion.choices[0].message.content?.trim() ?? "";
    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Extract-text error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to extract text from image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
