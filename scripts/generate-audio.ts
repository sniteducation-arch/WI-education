/**
 * Generates MP3 audio for every unique listening transcript using OpenAI TTS.
 * Multi-speaker: male names/roles get a male voice, female names/roles get a female voice.
 * Uploads one MP3 per unique transcript to Firebase Storage and writes
 * lib/listening-audio-urls.ts with the resulting URL map.
 *
 * Setup:
 *   npm install openai
 *   # Add OPENAI_API_KEY=sk-... to .env.local
 *
 * Run:
 *   npx tsx scripts/generate-audio.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import admin from "firebase-admin";
import OpenAI from "openai";
import { set1Listening } from "../lib/questions";

// ── Load .env.local ───────────────────────────────────────────────────────────
(function loadEnv() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  } catch {
    // .env.local not found; fall through to env validation below
  }
})();

// ── Types ─────────────────────────────────────────────────────────────────────
type VoiceId = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
interface Turn {
  speaker: string;
  text: string;
  voice: VoiceId;
}

// ── Voice assignment ──────────────────────────────────────────────────────────
function assignVoice(speaker: string, existing: Map<string, VoiceId>): VoiceId {
  if (existing.has(speaker)) return existing.get(speaker)!;
  const s = speaker.toLowerCase();
  const used = [...existing.values()];

  // Female roles / titles
  if (
    s.includes("mrs") ||
    s.includes("ms.") ||
    s.includes("miss") ||
    ["nurse", "receptionist", "caregiver"].includes(s) ||
    s.includes("recording") // Interview recording → Ana (female)
  ) {
    return used.includes("nova") ? "shimmer" : "nova";
  }

  // Male roles / titles
  if (
    s.includes("mr.") ||
    s.includes("mr ") ||
    s.includes("doctor") ||
    ["caller", "manager"].includes(s)
  ) {
    return used.includes("onyx") ? "echo" : "onyx";
  }

  // Neutral / unknown
  return used.includes("alloy") ? "fable" : "alloy";
}

// ── Transcript parser ─────────────────────────────────────────────────────────
function parseTranscript(transcript: string): Turn[] {
  const speakerVoices = new Map<string, VoiceId>();
  const turns: Turn[] = [];

  // Remove stage directions like [Phone rings]
  const cleaned = transcript.replace(/\[[^\]]+\]/g, "").trim();

  // Match:  Optional Label: 'quoted spoken text'
  // Allow apostrophes mid-word (It's, I'm, etc.) but not as closing quotes
  const pattern = /(?:([A-Za-z][A-Za-z\s.\-]*?):\s*)?'((?:[^']|'(?=[a-zA-Z]))+)'/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(cleaned)) !== null) {
    const speaker = match[1]?.trim() ?? "Unknown";
    const text = match[2].trim();
    if (!text) continue;

    const voice = assignVoice(speaker, speakerVoices);
    speakerVoices.set(speaker, voice);
    turns.push({ speaker, text, voice });
  }

  // Fallback: no quoted strings found — read whole transcript as narrator
  if (turns.length === 0) {
    turns.push({ speaker: "Narrator", text: cleaned, voice: "alloy" });
  }

  return turns;
}

// ── Generate audio for one transcript ────────────────────────────────────────
async function generateAudio(
  transcriptId: string,
  transcript: string,
  openai: OpenAI,
  bucket: admin.storage.Bucket
): Promise<string> {
  const filePath = `listening-audio/${transcriptId}.mp3`;
  const fileRef = bucket.file(filePath);
  const bucketName = bucket.name;
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`;

  // Skip if already uploaded
  const [exists] = await fileRef.exists();
  if (exists) {
    console.log(`  → already exists, skipping`);
    return publicUrl;
  }

  const turns = parseTranscript(transcript);
  console.log(`  → ${turns.length} turn(s): ${turns.map((t) => `${t.speaker}(${t.voice})`).join(", ")}`);

  const buffers: Buffer[] = [];
  for (const turn of turns) {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: turn.voice,
      input: turn.text,
      response_format: "mp3",
    });
    buffers.push(Buffer.from(await response.arrayBuffer()));
  }

  await fileRef.save(Buffer.concat(buffers), {
    metadata: { contentType: "audio/mpeg" },
    public: true,
  });

  return publicUrl;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const required = [
    "OPENAI_API_KEY",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error("Missing environment variables:", missing.join(", "));
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  const bucket = admin.storage().bucket();

  // Deduplicate: transcript text → first question ID that uses it
  const uniqueTranscripts = new Map<string, string>();
  for (const q of set1Listening) {
    if (!uniqueTranscripts.has(q.transcript)) {
      uniqueTranscripts.set(q.transcript, q.id);
    }
  }

  console.log(`Found ${uniqueTranscripts.size} unique transcripts across ${set1Listening.length} questions.\n`);

  const transcriptToUrl = new Map<string, string>();
  let idx = 0;
  for (const [transcript, id] of uniqueTranscripts) {
    idx++;
    console.log(`[${idx}/${uniqueTranscripts.size}] ${id}`);
    try {
      const url = await generateAudio(id, transcript, openai, bucket);
      transcriptToUrl.set(transcript, url);
      console.log(`  ✓ ${url}\n`);
    } catch (err) {
      console.error(`  ✗ Failed for ${id}:`, err, "\n");
    }
  }

  // Build questionId → url map (shared transcripts get the same URL)
  const urlMap: Record<string, string> = {};
  for (const q of set1Listening) {
    const url = transcriptToUrl.get(q.transcript);
    if (url) urlMap[q.id] = url;
  }

  const outPath = resolve(process.cwd(), "lib/listening-audio-urls.ts");
  writeFileSync(
    outPath,
    `// Auto-generated by scripts/generate-audio.ts — do not edit manually\nexport const listeningAudioUrls: Record<string, string> = ${JSON.stringify(urlMap, null, 2)};\n`,
    "utf-8"
  );

  console.log(`✓ Written lib/listening-audio-urls.ts with ${Object.keys(urlMap).length} entries.`);
}

main().catch(console.error);
