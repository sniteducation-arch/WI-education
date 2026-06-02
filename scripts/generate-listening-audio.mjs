/**
 * Generates MP3 audio for ALL listening questions (Sets 1–3) using OpenAI TTS.
 * Run once from the project root:  node scripts/generate-listening-audio.mjs
 *
 * Output:  public/audio/listening/<id>.mp3
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

const OUTPUT_DIR = path.join(ROOT, "public", "audio", "listening");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ── Unique transcripts to generate ────────────────────────────────────────────
// Questions sharing the same transcript reuse the same file (see URL_MAP below).
const TRANSCRIPTS = {

  // ════════════════════════════════════════════════════════
  // SET 1
  // ════════════════════════════════════════════════════════

  // Part 1 — Chat with a colleague (choose the correct reply)
  "l1p1q1": "Colleague: Good morning! Could you help me turn Mrs. Davies? She's been on her left side for too long.",
  "l1p1q2": "Manager: Have you completed the handover notes before your shift ends?",
  "l1p1q3": "Nurse: Mrs. Jones hasn't eaten her lunch today. Have you noticed anything unusual?",
  "l1p1q4": "Family member: Excuse me, can you tell me how my father has been today?",

  // Part 2 — Order the information (one ordering question)
  "l1p2q1": "Before we start the morning round, let me go over the patient admission steps. First, we welcome the new resident and show them to their room. Then we complete the initial health assessment. After that, we create the care plan together with the resident and family. The next step is a family meeting to discuss the care plan. Finally, the resident settles in and regular care begins.",

  // Part 3 — Fill in the gap
  "l1p3q1": "Manager: Fire drill will be held this Thursday at 2 PM. All staff must participate and guide residents to the assembly point outside.",
  "l1p3q2": "Nurse: Remember, Mrs. Jones needs her blood pressure medication at noon and her vitamins in the evening.",
  "l1p3q3": "Caregiver: Mr. Brown, would you like tea or coffee this morning? Mr. Brown: Coffee please, but no sugar. Caregiver: Of course. I'll bring it right away.",
  "l1p3q4": "Manager: Today we have a new resident joining us, Mrs. Patel. She needs help with meals and walking. Please make her feel welcome.",

  // Part 4 — Choose the correct answer (short recordings)
  "l1p4q1": "Training session: When moving a patient from bed to wheelchair, always lock the wheelchair brakes first. Then help the patient to the edge of the bed. Place a transfer belt around their waist. Ask them to push up with their hands, then stand and pivot to sit in the chair.",
  "l1p4q2": "Doctor on phone: Please make sure Mr. Sharma takes his antibiotics three times a day with food. He should complete the full 7-day course even if he feels better.",
  "l1p4q3": "Caregiver report: Mrs. Chen was upset this morning. She cried during breakfast and said she missed her family. I sat with her for 20 minutes and she felt calmer afterwards.",
  "l1p4q4": "Phone rings. Receptionist: Good morning, Sunrise Care Home. How can I help? Caller: I would like to book an appointment to visit my mother. Is Saturday morning available? Receptionist: Yes, Saturday at 10 AM is free.",

  // Part 5 — Choose the correct answer (extended, longer recordings)
  // l1p5q1, l1p5q2, l1p5q3 share the Health & Safety briefing audio
  "l1p5q1": "Health and Safety Briefing: Good morning everyone. Today we are going over our infection control policy. The most important thing is hand hygiene. You must wash your hands before and after every patient contact. Use the six-step technique and wash for at least 20 seconds. Alcohol gel is available at every bedside, but remember it is not a substitute for soap and water when hands are visibly dirty. If you have any cuts or wounds, please cover them with a waterproof plaster before starting your shift.",
  // l1p5q2 → shares l1p5q1
  // l1p5q3 → shares l1p5q1
  "l1p5q4": "End of life care briefing: When a resident enters the end-of-life stage, we focus on comfort, dignity and supporting the family rather than curative treatment. Pain management becomes the priority. Always follow the care plan and the advance directive if there is one. Family should be contacted promptly and allowed flexible visiting. Create a calm, peaceful environment and offer emotional support to both the resident and the family.",

  // ════════════════════════════════════════════════════════
  // SET 2
  // ════════════════════════════════════════════════════════

  // Part 1 — Chat with a colleague
  "l2p1q1": "Manager: All care plans for residents on your ward need to be reviewed and updated by Friday afternoon. Can you do that?",
  "l2p1q2": "Resident: Excuse me, could you help me put on my cardigan? My shoulder is a bit stiff today.",
  "l2p1q3": "Nurse: Mrs. Okafor's new medication must be taken 30 minutes before her meal. Can you make sure that happens?",
  "l2p1q4": "Senior caregiver: Before you go home, make sure you have handed over the medication keys to Jenny.",

  // Part 2 — Order the information
  "l2p2q1": "PPE training: When entering an isolation room, the order is very important. First, wash your hands thoroughly. Then put on the apron. After that, put on your gloves. Next, put on the mask. Finally, you may enter the room. Remember this order every time.",

  // Part 3 — Fill in the gap
  "l2p3q1": "Nurse to caregiver: Please check on Mr. Peters in room 8. He pressed his call bell 20 minutes ago and nobody has responded. This is unacceptable. Call bells must be answered within five minutes.",
  "l2p3q2": "Job interview recording: My name is Priya. I have been working in elderly care for five years — two years in India and three years in the UK.",
  "l2p3q3": "Staff meeting: All staff must keep personal mobile phones stored in lockers during working hours. You may check them during your break.",
  "l2p3q4": "Nurse briefing: We have a new resident coming in tomorrow — Mrs. Begum. She has high blood pressure and is allergic to penicillin. Please make a note of this.",

  // Part 4 — Choose the correct answer
  // l2p4q2, l2p4q3, l2p4q4 share the Moving & Handling briefing
  "l2p4q1": "Moving and Handling Briefing: The most important rule is never to lift a resident alone. All manual lifts require two members of staff. Before any transfer, always introduce yourself to the resident and explain what you are going to do. If the resident is in pain or refuses, do not proceed — inform the nurse immediately. After the transfer, always record it in the care notes.",

  // Part 5 — Choose the correct answer (extended)
  "l2p5q1": "Caregiver report: Mrs. Diaz had a small accident in her room this morning. She needs help to the bathroom and her bedding needs changing. I have informed the nurse and completed the incident form.",
  "l2p5q2": "Staff announcement: The activity coordinator has set up a sing-along session in the lounge at 2 PM today. Please encourage residents to attend, especially those who seem withdrawn or low in mood. Their participation will improve their wellbeing.",
  "l2p5q3": "Caregiver: The shower in Room 5 is still not working. Maintenance was called yesterday but nobody came. Mrs. Wright needs her shower this morning. Can we use the accessible bathroom on the second floor?",
  "l2p5q4": "Nurse: The GP is visiting this Wednesday at 11 AM to review medication for residents in the Bluebell wing. Please make sure all relevant care files and medication records are available at the nurses' station before 10:30 AM.",

  // ════════════════════════════════════════════════════════
  // SET 3
  // ════════════════════════════════════════════════════════

  // Part 1 — Chat with a colleague
  "l3p1q1": "Caregiver to nurse: I just noticed that Mr. Collins has a new reddening on his lower back. I have repositioned him. Should I complete an incident report?",
  "l3p1q2": "Manager: We have a mandatory fire safety training on Monday at 9 AM. All care staff must attend. Please arrange cover for your residents first.",
  "l3p1q3": "Resident: I am feeling a bit dizzy today. I nearly fell when I stood up too fast.",
  "l3p1q4": "Colleague: Mrs. Abbott will not eat her lunch. The food is too hard for her teeth. What should we do?",

  // Part 2 — Order the information
  "l3p2q1": "Falls prevention training: Before you help a resident to walk, always follow these steps in order. First, check that they are wearing non-slip footwear. Second, make sure their walking aid is within reach. Third, check that the path ahead is clear of any obstacles. Fourth, tell the resident what you are going to do. Finally, begin walking with them slowly.",

  // Part 3 — Fill in the gap
  "l3p3q1": "Interview recording: My name is Roberto. I moved to the UK three years ago and I have been working in care since I arrived.",
  "l3p3q2": "End-of-life care briefing: When a resident enters the end-of-life stage, pain management becomes the priority. Always follow the care plan and contact the family promptly.",
  "l3p3q3": "Nurse to caregiver: Mrs. Huang has been refusing her evening medication for three days. Document each refusal clearly in her medication record.",
  "l3p3q4": "Manager: A family member complained that the rooms are not clean enough. Please ensure all rooms are checked at the start of every shift and cleaning issues are reported to housekeeping immediately.",

  // Part 4 — Choose the correct answer
  // l3p4q2, l3p4q3, l3p4q4 share the Safeguarding briefing
  "l3p4q1": "Safeguarding Briefing: Good morning. Today's session covers safeguarding adults. Safeguarding means protecting people from abuse, neglect and harm. As a caregiver, you have a duty to report any concerns about a resident's wellbeing. Types of abuse include physical, emotional, financial and sexual abuse. Signs include unexplained bruises, withdrawal, sudden changes in behaviour, or a resident appearing frightened around a certain person. If you suspect abuse, do not investigate yourself — report your concerns immediately to the manager or the designated safeguarding lead. All concerns must be documented, regardless of how minor they seem.",

  // Part 5 — Choose the correct answer (extended)
  "l3p5q1": "Caregiver report: Mrs. Reid has been very tearful today. She told me she is worried about her son who has not visited for three weeks. I sat with her for a while and she felt better. I have made a note in her daily report.",
  "l3p5q2": "I have just checked on Mr. Vasquez and found him on the floor next to his bed. He seems confused but is conscious and says his hip hurts. I have not moved him. I have pressed the emergency buzzer and I am staying with him until the nurse arrives.",
  "l3p5q3": "The dietitian has left a note saying that three residents need to be encouraged to eat more protein. Please offer them cheese, eggs or meat with every meal and record how much they eat on the nutrition monitoring sheet.",
  "l3p5q4": "A reminder that tomorrow's morning medication round will start at 7:30 AM instead of 8 AM because the pharmacist is coming early to audit the controlled drugs cabinet. Please make sure all night staff have updated the medication records before handing over.",
};

// ── Question ID → audio file ID (shared transcripts reuse the same file) ──────
const URL_MAP = {
  // Set 1
  l1p1q1:"l1p1q1", l1p1q2:"l1p1q2", l1p1q3:"l1p1q3", l1p1q4:"l1p1q4",
  l1p2q1:"l1p2q1",
  l1p3q1:"l1p3q1", l1p3q2:"l1p3q2", l1p3q3:"l1p3q3", l1p3q4:"l1p3q4",
  l1p4q1:"l1p4q1", l1p4q2:"l1p4q2", l1p4q3:"l1p4q3", l1p4q4:"l1p4q4",
  l1p5q1:"l1p5q1", l1p5q2:"l1p5q1", l1p5q3:"l1p5q1",  // same Health & Safety briefing
  l1p5q4:"l1p5q4",
  // Set 2
  l2p1q1:"l2p1q1", l2p1q2:"l2p1q2", l2p1q3:"l2p1q3", l2p1q4:"l2p1q4",
  l2p2q1:"l2p2q1",
  l2p3q1:"l2p3q1", l2p3q2:"l2p3q2", l2p3q3:"l2p3q3", l2p3q4:"l2p3q4",
  l2p4q1:"l2p4q1", l2p4q2:"l2p4q1", l2p4q3:"l2p4q1", l2p4q4:"l2p4q1", // shared — long briefing
  l2p5q1:"l2p5q1", l2p5q2:"l2p5q2", l2p5q3:"l2p5q3", l2p5q4:"l2p5q4",
  // Set 3
  l3p1q1:"l3p1q1", l3p1q2:"l3p1q2", l3p1q3:"l3p1q3", l3p1q4:"l3p1q4",
  l3p2q1:"l3p2q1",
  l3p3q1:"l3p3q1", l3p3q2:"l3p3q2", l3p3q3:"l3p3q3", l3p3q4:"l3p3q4",
  l3p4q1:"l3p4q1", l3p4q2:"l3p4q1", l3p4q3:"l3p4q1", l3p4q4:"l3p4q1", // shared — safeguarding briefing
  l3p5q1:"l3p5q1", l3p5q2:"l3p5q2", l3p5q3:"l3p5q3", l3p5q4:"l3p5q4",
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

// ── Rewrite listening-audio-urls.ts ──────────────────────────────────────────
function writeUrlFile() {
  const urlsPath = path.join(ROOT, "lib", "listening-audio-urls.ts");
  const entries = Object.entries(URL_MAP)
    .map(([qId, fileId]) => `  "${qId}": "/audio/listening/${fileId}.mp3"`)
    .join(",\n");
  const content = `// Auto-generated by scripts/generate-listening-audio.mjs — do not edit manually\nexport const listeningAudioUrls: Record<string, string> = {\n${entries}\n};\n`;
  fs.writeFileSync(urlsPath, content);
  console.log("\n✓ lib/listening-audio-urls.ts rewritten");
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const total = Object.keys(TRANSCRIPTS).length;
  console.log(`\nGenerating ${total} unique audio files → public/audio/listening/\n`);

  let i = 0;
  for (const [id, text] of Object.entries(TRANSCRIPTS)) {
    i++;
    process.stdout.write(`[${i}/${total}] `);
    await generateOne(id, text);
    // Small delay to stay within rate limits
    await new Promise(r => setTimeout(r, 300));
  }

  writeUrlFile();
  console.log(`\nAll done. Run 'npm run dev' to serve the new audio files.\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
