import { NextRequest, NextResponse } from "next/server";
import { sanitize, stripTags } from "@/lib/validate";

const BASE_PROMPT = `You are a supportive but accurate Cambridge UpSkill Writing examiner. These are adult learners at CEFR A1–B1 level preparing for a caregiver qualification. Give a fair, encouraging, and genuinely useful assessment.

ASSESSMENT PHILOSOPHY:
• These students are NOT native speakers. Minor grammar errors and spelling slips are EXPECTED and ACCEPTABLE.
• Reward communication effectiveness — if the meaning is clear and all task points are addressed, that deserves credit.
• A correct simple sentence scores better than a complex sentence full of mistakes.
• Assess the level achieved, not perfection.

UNIVERSAL WRITING CRITERIA:
• Task Completion: Address EVERY point in the prompt — most tasks have 3 required points. Each must have at least one sentence.
• Word Count: At least 50 words. Under 50 words = automatic penalty. Do not reward padding or repetition.
• Sentence Quality: Simple and correct beats complex and broken.
• Linking Words: Reward and, but, because, also, first, second, then, however, so.
• Structure: Greeting → reason for writing → the required points → closing line → sign-off.
• Spelling & Grammar: Penalise repeated errors; single slips are minor.

SCORING GUIDE:
• 5/5 — Excellent. Clear, well-structured, all points fully covered. B1 quality.
• 4/5 — Good. Minor slips, communication is effective. A2–B1 quality.
• 3/5 — Adequate. Meaning clear but noticeable errors or missing details. A2 quality.
• 2/5 — Weak. Meaning sometimes unclear. Significant errors or missing points. A1 quality.
• 1/5 — Very weak. Very limited, hard to follow.
• 0/5 — No response or completely incomprehensible.

GRADING THRESHOLDS:
• B1: Total ≥ 17/20 — all points addressed, mostly correct grammar, varied vocabulary, clear structure
• A2: Total 11–16/20 — most points addressed, simple understandable sentences, minor errors that don't block meaning
• A1: Total < 11/20 — missing points, significant errors, very limited vocabulary
• Below A1: No response, or completely irrelevant/incomprehensible

PASS/FAIL:
• PASS — Grade A2 or above (Total ≥ 11/20)
• FAIL — Grade A1 or Below A1 (Total < 11/20)`;

function getPartGuidance(partType: string): string {
  if (partType === "personal_email") {
    return `PART TYPE — PERSONAL EMAIL (Part 1):
The student is writing to a friend, family member, or colleague about an everyday situation (invitation, request, update, thank-you).
• Tone: Warm and friendly. Penalise overly stiff or corporate language.
• Greeting: "Hi [Name]," or "Dear [Name]," — both are fine. Penalise missing greeting.
• Sign-off: "See you soon!", "Best wishes", "Take care," + name — all acceptable. Penalise missing sign-off.
• Register: Contractions (I'm, can't, it's) are normal and should NOT be penalised.
• Common mistakes to flag: forgetting the greeting or sign-off, writing one long paragraph, repeating the same point twice, using texting abbreviations (u, ur, gr8) or emojis.
• Model answer style: Natural, conversational, friendly — NOT formal business English.`;
  }
  return `PART TYPE — FORMAL REPLY (Part 2):
The student is writing a formal text — a reply to a job advertisement, a complaint, or a request to a business.
• Tone: Professional and polite. Penalise overly casual or informal language (slang, emojis, contractions like I'm are still acceptable at this level).
• Greeting: "Dear [Name]," / "Dear Hiring Manager," / "Dear Sir/Madam," — penalise missing greeting or using "Hi".
• Sign-off: "Yours sincerely," / "Kind regards," + name — penalise missing sign-off.
• Register: Full sentences, no abbreviations. Formal phrases ("I am writing to...", "I look forward to...") should be rewarded.
• Common mistakes to flag: missing greeting or sign-off, too casual tone, missing required points, one long paragraph.
• Model answer style: Clear, professional, structured — 50–65 words with all required points covered.`;
}

const RESPONSE_FORMAT = `
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
- [specific strength — quote from their writing if possible]
- [another genuine strength]

ERRORS TO FIX:
- [exact wrong phrase] → [correct version — keep it simple and memorable]
- [exact wrong phrase] → [correct version]

⭐ PERFECT MODEL ANSWER:
[Write a 50–65 word email with greeting, all required points in simple clear sentences, linking words, closing line, and sign-off. Match the tone to the part type — friendly for Part 1, formal for Part 2. This should be a template the student can memorise and adapt.]

TEACHER TIP:
[One specific, actionable drill tailored to this part type.]`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const situation = stripTags(sanitize(body.situation, 500));
    const task = stripTags(sanitize(body.task, 500));
    const answer = stripTags(sanitize(body.answer, 2000)); // ~400 words max
    const wordLimit = Math.min(Math.max(Number(body.wordLimit) || 50, 10), 200);
    const partType = body.partType === "formal_reply" ? "formal_reply" : "personal_email";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set." }, { status: 500 });
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    const fullPrompt = `${BASE_PROMPT}

${getPartGuidance(partType)}
${RESPONSE_FORMAT}

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
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
            thinkingConfig: { thinkingBudget: 0 },
          },
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
