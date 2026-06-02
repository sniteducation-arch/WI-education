import { NextRequest, NextResponse } from "next/server";

const EXAMINER_PROMPT = `You are a strict Cambridge UpSkill Caregiver Speaking examiner.

CRITICAL RULES — follow these before anything else:
1. If the audio contains SILENCE, background noise only, or NO clear spoken words in English — immediately return GRADE: Below A1, RESULT: FAIL, all scores 0/5, and state "No speech detected. The student must speak clearly into the microphone."
2. If the response is fewer than 5 words of actual English speech — return GRADE: Below A1, RESULT: FAIL.
3. Do NOT give marks for silence, humming, or non-English sounds.
4. Be honest and strict — only award high marks for genuinely good spoken English.

Evaluate the student's spoken audio response for CEFR A1–B1 level and respond in this exact format:

GRADE: [A1 / A2 / B1 / Below A1]
RESULT: [PASS / FAIL]

SCORES:
Fluency:          [X/5]
Grammar:          [X/5 or N/A if not applicable]
Vocabulary:       [X/5 or N/A if not applicable]
Pronunciation:    [X/5]
Task Completion:  [X/5]
Total:            [calculated from applicable scores only, scaled to /25]

WHAT THEY DID WELL:
- [point]
- [point]

ERRORS TO FIX:
- [wrong] → [correct]
- [wrong] → [correct]

⭐ PERFECT MODEL ANSWER:
[Write a natural, professional B1 level spoken response covering ALL points in the task. 3–5 sentences.]

TEACHER TIP:
[One specific actionable thing to drill with this student.]`;

function getPartGuidance(partType: string): string {
  switch (partType) {
    case "read_aloud":
      return "EVALUATION FOCUS — READ ALOUD: Score Fluency on pacing and pausing at punctuation. Score Pronunciation on accuracy of each word. Grammar is NOT assessed in read-aloud — write exactly 'N/A' in the Grammar field. Vocabulary is NOT assessed in read-aloud (the words are given) — write exactly 'N/A' in the Vocabulary field. Score Task Completion on whether they read all sentences without skipping. Penalise heavily for skipped words, mispronounced medical terms, or rushing through punctuation.";
    case "long_turn_topic":
      return "EVALUATION FOCUS — LONG TURN (TOPIC): Score Task Completion on whether all 3 guiding points were addressed. Score Fluency on ability to speak continuously for about 1 minute without excessive pausing. Penalise for covering fewer than 2 guiding points.";
    case "long_turn_graphic":
      return "EVALUATION FOCUS — LONG TURN (GRAPHIC): The student was shown a chart/diagram. Score Task Completion on whether they described the main data, compared categories, and stated a conclusion. Score Vocabulary on use of data language (e.g. 'the largest proportion', 'compared to', 'overall'). Penalise for not mentioning specific figures or failing to draw a conclusion.";
    case "communication":
      return "EVALUATION FOCUS — COMMUNICATION ACTIVITY: The student answered 3 rapid questions. Score Task Completion on whether all 3 questions were answered. Score Fluency on speed and naturalness of responses. Reward relevant, specific answers. Penalise for answering only 1–2 questions or very vague responses.";
    case "interview":
    default:
      return "EVALUATION FOCUS — INTERVIEW: Score all criteria normally. Reward natural, personal, detailed answers. Penalise for one-word answers or not answering all questions asked.";
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const instruction = String(formData.get("instruction") ?? "").slice(0, 300);
    const prompt = String(formData.get("prompt") ?? "").slice(0, 500);
    const partType = String(formData.get("partType") ?? "interview");
    const partLabel = String(formData.get("partLabel") ?? "").slice(0, 60);
    const graphicAlt = String(formData.get("graphicAlt") ?? "").slice(0, 400);
    const durationSeconds = Number(formData.get("durationSeconds") ?? 0);

    if (!audioFile) {
      return NextResponse.json({ error: "No audio received." }, { status: 400 });
    }
    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio file too large." }, { status: 413 });
    }
    if (durationSeconds < 3) {
      return NextResponse.json({
        evaluation: `GRADE: Below A1\nRESULT: FAIL\n\nSCORES:\nFluency:          0/5\nGrammar:          0/5\nVocabulary:       0/5\nPronunciation:    0/5\nTask Completion:  0/5\nTotal:            0/25\n\nWHAT THEY DID WELL:\n- Nothing recorded.\n\nERRORS TO FIX:\n- No speech detected → Please speak clearly and for at least 5 seconds.\n\n⭐ PERFECT MODEL ANSWER:\n[Please attempt the task again and speak your answer aloud.]\n\nTEACHER TIP:\nPress record and speak immediately. Do not leave silence at the start.`,
      });
    }
    // Reject suspiciously small files for their duration (likely silent — 32kbps = 4KB/sec)
    const minExpectedBytes = durationSeconds * 1500;
    if (audioFile.size < minExpectedBytes) {
      return NextResponse.json({
        evaluation: `GRADE: Below A1\nRESULT: FAIL\n\nSCORES:\nFluency:          0/5\nGrammar:          0/5\nVocabulary:       0/5\nPronunciation:    0/5\nTask Completion:  0/5\nTotal:            0/25\n\nWHAT THEY DID WELL:\n- Nothing recorded.\n\nERRORS TO FIX:\n- Silent or very quiet audio → Please speak louder and directly into the microphone.\n\n⭐ PERFECT MODEL ANSWER:\n[Please attempt the task again and speak clearly.]\n\nTEACHER TIP:\nCheck that your microphone is working. Speak loudly and clearly when recording.`,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY not set." }, { status: 500 });
    }

    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

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
              text: `${EXAMINER_PROMPT}\n\n---\nSPEAKING TASK:\nPart: ${partLabel || partType}\nInstruction: ${instruction}\nPrompt: ${prompt}${graphicAlt ? `\n\nGRAPHIC SHOWN TO STUDENT: ${graphicAlt}` : ""}\n\n${getPartGuidance(partType)}`,
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
