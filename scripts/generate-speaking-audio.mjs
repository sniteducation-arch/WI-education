/**
 * Generates MP3 audio for ALL speaking Parts 1 & 2 questions (Sets 1–7) using OpenAI TTS.
 * Run once from the project root:  node scripts/generate-speaking-audio.mjs
 *
 * Output:  public/audio/speaking/s{set}p{part}q{q}.mp3
 * Skips files that already exist (safe to re-run).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// ── Load OPENAI_API_KEY from .env.local ────────────────────────────────────────
const envContent = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const OPENAI_API_KEY = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!OPENAI_API_KEY) { console.error("OPENAI_API_KEY not found in .env.local"); process.exit(1); }

const OUTPUT_DIR = path.join(ROOT, "public", "audio", "speaking");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── All Part 1 & 2 questions per set ──────────────────────────────────────────
const QUESTIONS = {

  // ══════════════════════════════════════════════
  // SET 1
  // ══════════════════════════════════════════════
  "s1p1q1": "What is your name and where are you from?",
  "s1p1q2": "What do you do for work at the moment?",
  "s1p1q3": "Do you like helping other people? Why?",
  "s1p1q4": "What time do you usually start your working day?",

  "s1p2q1": "Why did you decide to become a caregiver?",
  "s1p2q2": "Tell me about your previous experience helping others.",
  "s1p2q3": "What do you think is the most important skill for a caregiver? Why?",
  "s1p2q4": "Describe a time when you helped someone who was upset or needed support.",

  // ══════════════════════════════════════════════
  // SET 2
  // ══════════════════════════════════════════════
  "s2p1q1": "How long have you been interested in caregiving?",
  "s2p1q2": "What languages do you speak?",
  "s2p1q3": "Do you prefer working alone or as part of a team?",
  "s2p1q4": "Are you comfortable working night shifts?",

  "s2p2q1": "Have you cared for someone in your family before? Tell me about it.",
  "s2p2q2": "How do you handle stressful situations at work?",
  "s2p2q3": "What challenges do you think a caregiver faces when working in a new country?",
  "s2p2q4": "Describe your ideal working environment and explain why.",

  // ══════════════════════════════════════════════
  // SET 3
  // ══════════════════════════════════════════════
  "s3p1q1": "What made you decide to apply for caregiver work?",
  "s3p1q2": "Describe your personality in two or three words.",
  "s3p1q3": "Have you taken any health or care training courses?",
  "s3p1q4": "Do you enjoy meeting new people?",

  "s3p2q1": "How do you usually build trust with a new patient?",
  "s3p2q2": "Tell me about a time you solved a problem at work.",
  "s3p2q3": "What does patient dignity mean to you in a care setting?",
  "s3p2q4": "How do you stay motivated when your job is difficult or tiring?",

  // ══════════════════════════════════════════════
  // SET 4
  // ══════════════════════════════════════════════
  "s4p1q1": "Tell me briefly about your work experience so far.",
  "s4p1q2": "What do you find most rewarding about helping others?",
  "s4p1q3": "Are you comfortable working night shifts?",
  "s4p1q4": "How do you usually get to work?",

  "s4p2q1": "How would you describe your relationship with a previous employer?",
  "s4p2q2": "Tell me about a time you made a mistake at work and what you learned.",
  "s4p2q3": "How do you handle a patient who is upset or refuses help?",
  "s4p2q4": "What English skills do you think are most important for a caregiver?",

  // ══════════════════════════════════════════════
  // SET 5
  // ══════════════════════════════════════════════
  "s5p1q1": "What country do you hope to work in as a caregiver?",
  "s5p1q2": "Do you have any family living abroad?",
  "s5p1q3": "What hobbies do you enjoy outside of work?",
  "s5p1q4": "Have you ever worked the night shift?",

  "s5p2q1": "How do you prepare for a new job in a new country or city?",
  "s5p2q2": "Have you ever lived away from your family? How did you manage?",
  "s5p2q3": "What are your main goals for the next three years?",
  "s5p2q4": "How do you practise your English outside of work or study?",

  // ══════════════════════════════════════════════
  // SET 6
  // ══════════════════════════════════════════════
  "s6p1q1": "Tell me something interesting about your hometown.",
  "s6p1q2": "What hobbies or activities do you enjoy in your free time?",
  "s6p1q3": "Are you a morning person or an evening person?",
  "s6p1q4": "Do you have any experience caring for elderly people?",

  "s6p2q1": "How do you usually deal with difficult or demanding patients?",
  "s6p2q2": "What does person-centred care mean to you?",
  "s6p2q3": "Tell me about a challenge you faced at work and how you solved it.",
  "s6p2q4": "How do you communicate with a patient who does not speak much English?",

  // ══════════════════════════════════════════════
  // FULL EXAM — Parts 1 & 2 (Listen & Answer)
  // ══════════════════════════════════════════════
  "fe-s1q1": "What is your full name and what country are you hoping to work in?",
  "fe-s1q2": "Do you prefer morning shifts, afternoon shifts, or night shifts — and why?",
  "fe-s1q3": "Have you worked in a care home or hospital before?",
  "fe-s1q4": "What do you do to look after your own health and wellbeing?",

  "fe-s2q1": "Tell me about a time you helped someone who was in a difficult situation. What did you do and how did things turn out?",
  "fe-s2q2": "In your opinion, what makes a truly good caregiver? Please give reasons.",
  "fe-s2q3": "How would you manage a situation where a patient becomes upset and refuses your help?",
  "fe-s2q4": "Describe the most important thing you have learned about caring for people who are elderly or unwell.",

  // ══════════════════════════════════════════════
  // SET 7
  // ══════════════════════════════════════════════
  "s7p1q1": "If you could describe yourself as a caregiver in one sentence, what would you say?",
  "s7p1q2": "What is your favourite part of the working day?",
  "s7p1q3": "Do you prefer working with older adults or younger patients?",
  "s7p1q4": "How long have you been studying English?",

  "s7p2q1": "Tell me about a time you made a mistake at work. What did you learn from it?",
  "s7p2q2": "How do you stay calm when a patient is very unwell or in distress?",
  "s7p2q3": "What advice would you give to someone starting their first caregiving job?",
  "s7p2q4": "How has preparing for this exam helped improve your English?",
};

// ── Generate one audio file ────────────────────────────────────────────────────
async function generateOne(id, text) {
  const outPath = path.join(OUTPUT_DIR, `${id}.mp3`);
  if (fs.existsSync(outPath)) {
    console.log(`  ✓ ${id}.mp3 already exists — skipping`);
    return;
  }
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "tts-1", input: text, voice: "nova", speed: 0.88 }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  ✗ ${id} — ${err}`);
    return;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  console.log(`  ✓ ${id}.mp3  (${(buf.length / 1024).toFixed(0)} KB)`);
}

// ── Write the URL map for the speaking page ───────────────────────────────────
function writeUrlFile() {
  const urlsPath = path.join(ROOT, "lib", "speaking-audio-urls.ts");
  const entries = Object.keys(QUESTIONS)
    .map((id) => `  "${id}": "/audio/speaking/${id}.mp3"`)
    .join(",\n");
  const content = `// Auto-generated by scripts/generate-speaking-audio.mjs — do not edit manually\nexport const speakingAudioUrls: Record<string, string> = {\n${entries}\n};\n`;
  fs.writeFileSync(urlsPath, content);
  console.log("\n✓ lib/speaking-audio-urls.ts written");
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const total = Object.keys(QUESTIONS).length;
  console.log(`\nGenerating ${total} speaking audio files → public/audio/speaking/\n`);

  let i = 0;
  for (const [id, text] of Object.entries(QUESTIONS)) {
    i++;
    process.stdout.write(`[${i}/${total}] `);
    await generateOne(id, text);
    await new Promise(r => setTimeout(r, 300));
  }

  writeUrlFile();
  console.log(`\nAll done. Run 'npm run dev' to serve the new audio files.\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
