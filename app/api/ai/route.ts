import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.AI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = body?.message;

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        {
          error: "Message is required",
        },
        {
          status: 400,
        },
      );
    }

    const completion = await groq.chat.completions.create({
      model: process.env.AI_MODEL!,
      messages: [
        {
          role: "user",
          content: message.trim(),
        },
      ],
      max_completion_tokens: 100,
    });

    return NextResponse.json({
      response: completion.choices[0]?.message?.content ?? "",
    });
  } catch (error) {
    console.error("AI API error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate AI response",
      },
      {
        status: 500,
      },
    );
  }
}
