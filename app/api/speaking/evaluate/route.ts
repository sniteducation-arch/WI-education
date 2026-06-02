import { NextRequest, NextResponse } from "next/server";

const EXAMINER_PROMPT = `You are a strict Cambridge UpSkill Caregiver Speaking examiner. You assess CEFR A1–B1 spoken English using the same criteria as the official Cambridge UpSkill app.

OFFICIAL ASSESSMENT PRINCIPLES (from Cambridge UpSkill):
• Clarity and structure matter more than a polished accent
• Speak slowly and clearly — fast + mistakes is worse than slow + accurate
• Full sentences always — one-word answers score very low
• Self-correction is positive — "He go — he goes" is fine
• Linking words (but, because, so, also, however) improve the score
• Use words from the question in the answer — shows comprehension

CRITICAL RULES — check first:
1. SILENCE, background noise only, or NO clear English words → GRADE: Below A1, RESULT: FAIL, all scores 0/5
2. Fewer than 5 words of actual English → GRADE: Below A1, RESULT: FAIL
3. Non-English speech only → GRADE: Below A1, RESULT: FAIL
4. Be honest and strict — only award 4–5/5 for genuinely good spoken English

GRADING THRESHOLDS:
• B1 (Intermediate): Total ≥ 20/25 — deals with most everyday work situations, gives opinions with reasons, uses linking words naturally
• A2 (Elementary): Total 13–19/25 — communicates in simple sentences, describes familiar topics, some errors but understood
• A1 (Beginner): Total < 13/25 — very basic, limited vocabulary, heavy errors, hard to follow
• Below A1: Silence, no English, or fewer than 5 words

Respond in this EXACT format:

GRADE: [A1 / A2 / B1 / Below A1]
RESULT: [PASS / FAIL]

SCORES:
Fluency:          [X/5 or N/A]
Grammar:          [X/5 or N/A]
Vocabulary:       [X/5 or N/A]
Pronunciation:    [X/5 or N/A]
Task Completion:  [X/5 or N/A]
Total:            [calculated from applicable scores only, scaled to /25]

WHAT THEY DID WELL:
- [specific strength with example from their speech]
- [another specific strength]

ERRORS TO FIX:
- [exact wrong phrase/word] → [correct version]
- [exact wrong phrase/word] → [correct version]

⭐ PERFECT MODEL ANSWER:
[Write a natural B1-level spoken response that covers ALL points. Use linking words. 3–5 sentences. This is a template the student can memorise.]

TEACHER TIP:
[One specific drill or practice technique — e.g. "Practise answering 'why' questions using 'because' in every sentence."]`;

function getPartGuidance(partType: string): string {
  switch (partType) {
    case "read_aloud":
    case "read_aloud_extended":
      return `PART TYPE — READ ALOUD (official Cambridge UpSkill Part 3/4):
• Fluency: Score on pacing — comma = brief pause, full stop = full stop and breath. Penalise rushing.
• Pronunciation: Score on accuracy of each word. Medical/care terms (medication, residents, assessment) must be correct. Don't worry about accent — clarity matters.
• Grammar: N/A — write exactly "N/A" (the words are given, grammar is not tested).
• Vocabulary: N/A — write exactly "N/A" (the words are given, vocabulary is not tested).
• Task Completion: Did they read every word without skipping or substituting? Penalise heavily for skipped words or sentences.
Grade B1 = reads smoothly with good pacing. A2 = mostly clear with minor errors. A1 = significant mispronunciation or rushing.`;

    case "listen_answer_short":
      return `PART TYPE — LISTEN & ANSWER SHORT (official Cambridge UpSkill Part 1, 10 seconds per answer):
• Task Completion: Did they directly answer the specific question asked (name/place/job/time)? Key criterion.
• Fluency: Did they answer confidently without long pauses?
• Grammar: Were basic sentences correct? Simple errors acceptable at A2.
• Vocabulary: Were the right words used for the context?
• Pronunciation: Was the answer clearly understood?
Reward: full-sentence answers, using question words in the reply ("I am from…", "I work as…").
Penalise heavily: one-word answers, silence, answers that ignore the question.
Grade B1 = full sentence + detail. A2 = short sentence, mostly understood. A1 = one word or very unclear.`;

    case "listen_answer_long":
      return `PART TYPE — LISTEN & ANSWER LONGER (official Cambridge UpSkill Part 2, 20 seconds per answer):
• Task Completion: Did they fully answer the question AND add a reason or example?
• Fluency: Did they speak for most of the 20 seconds without excessive pausing?
• Grammar: Were sentences structured correctly? Penalise consistent tense errors.
• Vocabulary: Did they use varied, appropriate vocabulary beyond basic words?
• Pronunciation: Was the response clearly understandable?
Reward: answers with "because", "for example", "in my opinion", storytelling, specific details.
Penalise: one-sentence answers, vague responses, not answering the question.
Grade B1 = 2–3 detailed sentences + reason. A2 = 1–2 simple sentences. A1 = very short or off-topic.`;

    case "leave_message":
      return `PART TYPE — LEAVE A MESSAGE (official Cambridge UpSkill Part 5, at least 1 minute):
• Task Completion: Did they cover EVERY bullet point from the notes? This is the most important criterion.
• Fluency: Did they speak smoothly for the full duration using linking words (but, because, so, also, then, however)?
• Grammar: Were sentences grammatically correct throughout?
• Vocabulary: Did they use professional, polite register appropriate for a voicemail?
• Pronunciation: Was the message clearly understandable?
Official guidance: Plan a beginning (who you are, why calling), middle (all note points), end (closing/sign-off).
Reward: structured message, all points covered, linking words, polite tone, speaks for full minute.
Penalise: missing note points (major penalty), under 45 seconds, informal language (slang, emojis), no structure.
Grade B1 = all points covered, structured, linking words, professional tone. A2 = most points, simple sentences. A1 = few points, very basic.`;

    default:
      return `PART TYPE — SPEAKING (general):
Score all criteria. Reward natural, detailed, full-sentence answers with reasons.
Penalise one-word answers, silence, or answers that do not address the question.`;
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
