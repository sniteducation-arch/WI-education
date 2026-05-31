import { NextRequest, NextResponse } from "next/server";
import { sanitize, stripTags } from "@/lib/validate";

const EXAMINER_PROMPT = `You are a Cambridge Upskill Caregiver Writing examiner.
Evaluate the student's writing and respond in this exact format:

GRADE: [A1 / A2 / B1 / Below A1]
RESULT: [PASS / FAIL]

SCORES:
Task Completion: [X/5]
Grammar:         [X/5]
Vocabulary:      [X/5]
Clarity:         [X/5]
Total:           [X/20]

WHAT THEY DID WELL:
- [point]
- [point]

ERRORS TO FIX:
- [wrong] → [correct]
- [wrong] → [correct]

⭐ PERFECT MODEL ANSWER:
[Write a natural, professional 45-60 word B1 level response
using linking words, proper greeting and sign-off, covering
ALL points in the task. Make it a template students can memorise.]

TEACHER TIP:
[One specific thing to drill with this student.]`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const situation = stripTags(sanitize(body.situation, 500));
    const task = stripTags(sanitize(body.task, 500));
    const answer = stripTags(sanitize(body.answer, 2000)); // ~400 words max
    const wordLimit = Math.min(Math.max(Number(body.wordLimit) || 50, 10), 200);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set." }, { status: 500 });
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";

    const fullPrompt = `${EXAMINER_PROMPT}

---
TASK:
Situation: ${situation}
Instruction: ${task}
Target word count: ~${wordLimit} words

STUDENT ANSWER: ${answer || "(No answer written)"}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Gemini API error:", err);
      return NextResponse.json({ error: "Gemini API error." }, { status: 502 });
    }

    const data = await res.json();
    const evaluation = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return NextResponse.json({ evaluation });
  } catch (err) {
    console.error("Evaluate route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
