import { NextRequest, NextResponse } from "next/server";

const EXAMINER_PROMPT = `You are a Cambridge Upskill Caregiver Speaking examiner.
Listen to the student's spoken audio response and evaluate it for CEFR A1–B1 level.

Respond in this exact format:

GRADE: [A1 / A2 / B1 / Below A1]
RESULT: [PASS / FAIL]

SCORES:
Fluency:          [X/5]
Grammar:          [X/5]
Vocabulary:       [X/5]
Pronunciation:    [X/5]
Task Completion:  [X/5]
Total:            [X/25]

WHAT THEY DID WELL:
- [point]
- [point]

ERRORS TO FIX:
- [wrong] → [correct]
- [wrong] → [correct]

⭐ PERFECT MODEL ANSWER:
[Write a natural, professional B1 level spoken response covering ALL points in the task. 3–5 sentences. This is exactly what the student should aim to say.]

TEACHER TIP:
[One specific thing to drill with this student.]`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const instruction = String(formData.get("instruction") ?? "").slice(0, 300);
    const prompt = String(formData.get("prompt") ?? "").slice(0, 500);

    if (!audioFile) {
      return NextResponse.json({ error: "No audio received." }, { status: 400 });
    }
    // Reject suspiciously large files (max 10 MB)
    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio file too large." }, { status: 413 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set." }, { status: 500 });
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";

    // Convert audio to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Strip codec params — Gemini only wants the base MIME type
    const mimeType = (audioFile.type || "audio/webm").split(";")[0];

    const body = {
      contents: [
        {
          parts: [
            {
              inlineData: { mimeType, data: base64 },
            },
            {
              text: `${EXAMINER_PROMPT}\n\n---\nSPEAKING TASK:\nInstruction: ${instruction}\nPrompt: ${prompt}`,
            },
          ],
        },
      ],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini speaking error:", err);
      return NextResponse.json({ error: "Gemini API error." }, { status: 502 });
    }

    const data = await res.json();
    const evaluation = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return NextResponse.json({ evaluation });
  } catch (err) {
    console.error("Speaking evaluate error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
