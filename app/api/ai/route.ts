import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.AI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const completion = await groq.chat.completions.create({
    model: process.env.AI_MODEL!,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    max_completion_tokens: 100,
  });

  return NextResponse.json({
    response: completion.choices[0].message.content,
  });
}
