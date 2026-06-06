import { NextRequest, NextResponse } from "next/server";
import { sanitize } from "@/lib/validate";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "No text provided." }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY not set." }, { status: 500 });

    const clean = sanitize(text, 2000);

    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: clean,
        voice: "nova",
        speed: 0.9,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI TTS error:", err);
      return NextResponse.json({ error: "TTS generation failed." }, { status: 502 });
    }

    const audioBuffer = await res.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("TTS route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
