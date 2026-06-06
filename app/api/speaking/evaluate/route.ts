import { NextRequest, NextResponse } from "next/server";

const EXAMINER_PROMPT = `You are a supportive but accurate Cambridge UpSkill Caregiver Speaking examiner. These are adult learners preparing for a caregiver qualification at CEFR A1–B1 level. Your job is to give them a fair, encouraging and genuinely useful assessment.

ASSESSMENT PHILOSOPHY:
• These students are NOT native speakers. Minor grammar errors and non-native accents are EXPECTED and ACCEPTABLE.
• Reward communication effectiveness — if the meaning is clear and the task is addressed, that deserves credit.
• A simple correct sentence scores better than a complex sentence full of mistakes.
• Self-correction ("He go — he goes") shows awareness and should be REWARDED, not penalised.
• Assess the level achieved, not perfection. An A2 student giving a clear A2-level response should score A2.

CRITICAL RULES (check these first):
1. SILENCE, background noise only, or NO clear English words → GRADE: Below A1, all scores 0/5
2. Fewer than 5 words of actual English → GRADE: Below A1
3. Non-English speech only → GRADE: Below A1

SCORING GUIDE (what each level looks and sounds like):
• 5/5 — Outstanding. Highly fluent, natural, well-structured. Strong B1+.
• 4/5 — Good. Minor slips but communication is clear and effective. B1 quality.
• 3/5 — Adequate. Meaning is mostly clear with some errors or limited range. A2 quality.
• 2/5 — Weak. Meaning is sometimes unclear. Significant errors. A1 quality.
• 1/5 — Very weak. Very limited, hard to follow. Below A1 boundary.
• 0/5 — No response or completely incomprehensible.

GRADE THRESHOLDS:
• B1: Total ≥ 17/25 — communicates with reasonable fluency, handles most everyday caregiver situations, gives opinions, uses linking words
• A2: Total 11–16/25 — communicates in simple sentences, mostly understood, some errors that don't block meaning
• A1: Total < 11/25 — very basic, significant errors, limited vocabulary, but some English attempted
• Below A1: No English speech, silence, or fewer than 5 words

Respond in this EXACT format:

GRADE: [A1 / A2 / B1 / Below A1]

SCORES:
Fluency:          [X/5 or N/A]
Grammar:          [X/5 or N/A]
Vocabulary:       [X/5 or N/A]
Pronunciation:    [X/5 or N/A]
Task Completion:  [X/5 or N/A]
Total:            [calculated from applicable scores only, scaled to /25]

WHAT THEY DID WELL:
- [specific positive — quote from their response if possible]
- [another genuine strength]

ERRORS TO FIX:
- [exact wrong phrase] → [correct version — keep it simple and memorable]
- [exact wrong phrase] → [correct version]

⭐ PERFECT MODEL ANSWER:
[Write a natural, clear B1 response covering ALL task points in 3–5 sentences. Use simple linking words. Make it a template the student can memorise and adapt. Do NOT make it sound like formal written English — it should sound like natural speech.]

TEACHER TIP:
[One specific, encouraging practice drill — e.g. "Every day, practise answering one 'why' question using 'because'. Example: Why do you like this job? — I like this job because..."]`;

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
Grade B1 = reads clearly with reasonable pacing, most words correct. A2 = mostly clear with noticeable errors or rushing. A1 = significant mispronunciation or very unclear.`;

    case "listen_answer_short":
      return `PART TYPE — LISTEN & ANSWER SHORT (official Cambridge UpSkill Part 1, 10 seconds per answer):
• Task Completion: Did they directly answer the specific question asked (name/place/job/time)? Key criterion.
• Fluency: Did they answer confidently without long pauses?
• Grammar: Were basic sentences correct? Simple errors acceptable at A2.
• Vocabulary: Were the right words used for the context?
• Pronunciation: Was the answer clearly understood?
Reward: full-sentence answers, using question words in the reply ("I am from…", "I work as…").
Penalise heavily: one-word answers, silence, answers that ignore the question.
Grade B1 = full sentence, relevant answer, clearly understood. A2 = short sentence, mostly understood. A1 = one word or very unclear.`;

    case "listen_answer_long":
      return `PART TYPE — LISTEN & ANSWER LONGER (official Cambridge UpSkill Part 2, 20 seconds per answer):
• Task Completion: Did they fully answer the question AND add a reason or example?
• Fluency: Did they speak for most of the 20 seconds without excessive pausing?
• Grammar: Were sentences structured correctly? Penalise consistent tense errors.
• Vocabulary: Did they use varied, appropriate vocabulary beyond basic words?
• Pronunciation: Was the response clearly understandable?
Reward: answers with "because", "for example", "in my opinion", storytelling, specific details.
Penalise: one-sentence answers, vague responses, not answering the question.
Grade B1 = 2+ sentences with a reason or detail, clearly understood. A2 = 1–2 simple sentences. A1 = very short or off-topic.`;

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
Grade B1 = most/all points covered, reasonably structured, polite tone. A2 = some points covered, simple sentences. A1 = few points, very basic or unclear.`;

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
        evaluation: `GRADE: Below A1\n\nSCORES:\nFluency:          0/5\nGrammar:          0/5\nVocabulary:       0/5\nPronunciation:    0/5\nTask Completion:  0/5\nTotal:            0/25\n\nWHAT THEY DID WELL:\n- Nothing recorded.\n\nERRORS TO FIX:\n- No speech detected → Please speak clearly and for at least 5 seconds.\n\n⭐ PERFECT MODEL ANSWER:\n[Please attempt the task again and speak your answer aloud.]\n\nTEACHER TIP:\nPress record and speak immediately. Do not leave silence at the start.`,
      });
    }
    // Reject suspiciously small files for their duration (likely silent — 32kbps = 4KB/sec)
    const minExpectedBytes = durationSeconds * 1500;
    if (audioFile.size < minExpectedBytes) {
      return NextResponse.json({
        evaluation: `GRADE: Below A1\n\nSCORES:\nFluency:          0/5\nGrammar:          0/5\nVocabulary:       0/5\nPronunciation:    0/5\nTask Completion:  0/5\nTotal:            0/25\n\nWHAT THEY DID WELL:\n- Nothing recorded.\n\nERRORS TO FIX:\n- Silent or very quiet audio → Please speak louder and directly into the microphone.\n\n⭐ PERFECT MODEL ANSWER:\n[Please attempt the task again and speak clearly.]\n\nTEACHER TIP:\nCheck that your microphone is working. Speak loudly and clearly when recording.`,
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
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingBudget: 0 },
      },
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
