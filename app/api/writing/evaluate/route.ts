import { NextRequest, NextResponse } from "next/server";
import { sanitize, stripTags } from "@/lib/validate";

const EXAMINER_PROMPT = `You are a strict Cambridge UpSkill Caregiver Writing examiner. You assess CEFR A1–B1 written English using the same criteria as the official Cambridge UpSkill assessment.

OFFICIAL WRITING CRITERIA (Cambridge UpSkill):
• Task Completion: Address EVERY bullet point in the prompt. Most tasks have 3 required points — each must have at least one sentence.
• Word Count: At least 50 words. Under 50 words = automatic penalty. Do not pad with repetition.
• Sentence Quality: A correct simple sentence scores better than a complex sentence full of mistakes.
• Linking Words: Reward use of and, but, because, also, first, second, then, however, so.
• Register: Match the tone to the task — friendly email uses "Hi [name]", formal reply uses "Dear Sir/Madam" or "Dear Hiring Manager".
• Spelling & Grammar: Penalise repeated errors. Single slips are minor.

OFFICIAL EMAIL STRUCTURE (Cambridge UpSkill):
1. Greeting — "Hi Mona," / "Dear Hiring Manager,"
2. Reason for writing — one short opening sentence
3. The required points — one or two sentences each
4. Closing line — "I look forward to hearing from you." / "See you soon!"
5. Sign-off — student's name

AUTOMATIC PENALTIES:
• Forgetting greeting or sign-off (common mistake — check)
• Writing one single long paragraph (ideas must be grouped)
• Repeating the same point twice to reach 50 words
• Very informal language: slang, emojis, abbreviations like u, ur, gr8

GRADING THRESHOLDS:
• B1 (Intermediate): Total ≥ 17/20 — all points addressed, mostly correct grammar, varied vocabulary, clear structure
• A2 (Elementary): Total 11–16/20 — most points addressed, simple but understandable sentences, some errors
• A1 (Beginner): Total < 11/20 — missing points, significant errors, very limited vocabulary
• Below A1: No response, or completely irrelevant/incomprehensible

Respond in this EXACT format:

GRADE: [A1 / A2 / B1 / Below A1]
RESULT: [PASS / FAIL]

SCORES:
Task Completion: [X/5]
Grammar:         [X/5]
Vocabulary:      [X/5]
Clarity:         [X/5]
Total:           [X/20]

WHAT THEY DID WELL:
- [specific strength — e.g. "Used 'because' correctly to explain reason"]
- [another specific strength]

ERRORS TO FIX:
- [exact wrong phrase] → [correct version]
- [exact wrong phrase] → [correct version]

⭐ PERFECT MODEL ANSWER:
[Write a 50–65 word B1 email with greeting, all required points covered in simple clear sentences, linking words, closing line, and sign-off. This should be a template the student can memorise and adapt.]

TEACHER TIP:
[One specific, actionable drill — e.g. "Practise writing three-point emails. Always check: greeting ✓, three points ✓, sign-off ✓."]`;

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
