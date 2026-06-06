"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { Volume2, Mic, MicOff, ChevronRight } from "lucide-react";
import { speakingAudioUrls } from "@/lib/speaking-audio-urls";
import {
  FULL_EXAM_SECTIONS,
  TOTAL_EXAM_MINUTES,
  calcExamScore,
  ExamSection,
  ExamPart,
  MCQQuestion,
  TextQuestion,
  OrderingQuestion,
  FillQuestion,
} from "@/lib/full-exam-data";

const H = "'Manrope', system-ui, sans-serif";

type Phase = "section_intro" | "testing" | "section_done" | "results";

/* ── Listening audio player (OpenAI TTS) ─────────────────── */
const MAX_PLAYS = 3;

function ListeningPlayer({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused" | "error">("idle");
  const [playsUsed, setPlaysUsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const load = async () => {
    if (state === "loading" || playsUsed >= MAX_PLAYS) return;
    setState("loading");
    try {
      const res = await fetch("/api/listening/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setState("idle");
      audio.onpause = () => setState("paused");
      audio.onplay = () => setState("playing");
      audio.play();
      setPlaysUsed((p) => p + 1);
    } catch {
      setState("error");
    }
  };

  const toggle = () => {
    if (!audioRef.current) { load(); return; }
    if (state === "playing") { audioRef.current.pause(); }
    else { audioRef.current.play(); }
  };

  const replay = () => {
    if (playsUsed >= MAX_PLAYS) return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlaysUsed((p) => p + 1);
    } else { load(); }
  };

  const exhausted = playsUsed >= MAX_PLAYS;

  useEffect(() => () => {
    audioRef.current?.pause();
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
  }, []);

  return (
    <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, padding: 14, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Volume2 size={16} color="#92400e" />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>{label} — Listen carefully</span>
      </div>

      <p style={{ fontSize: 12, color: "#78350f", marginBottom: 12, lineHeight: 1.5 }}>
        Listen carefully. You can play the audio up to 3 times. The transcript is not shown during the exam.
      </p>

      {/* Play count indicator */}
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {Array.from({ length: MAX_PLAYS }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 9999, background: i < playsUsed ? "#b45309" : "#fde68a" }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: "#92400e", fontWeight: 600, marginBottom: 10 }}>
        {exhausted ? "Maximum plays reached." : `${MAX_PLAYS - playsUsed} play${MAX_PLAYS - playsUsed !== 1 ? "s" : ""} remaining`}
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={toggle}
          disabled={state === "loading" || exhausted}
          style={{ flex: 2, background: exhausted ? "#e1e3e4" : state === "playing" ? "#b45309" : "#92400e", color: exhausted ? "#767682" : "#fff", border: "none", borderRadius: 9, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: (state === "loading" || exhausted) ? "not-allowed" : "pointer", opacity: state === "loading" ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit" }}
        >
          {state === "loading" ? (
            <><span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Generating…</>
          ) : state === "playing" ? (
            <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>pause</span> Pause</>
          ) : exhausted ? (
            <>No plays left</>
          ) : (
            <><span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>play_circle</span> {state === "paused" ? "Resume" : "Play Audio"}</>
          )}
        </button>
        {audioRef.current && !exhausted && state !== "playing" && (
          <button
            onClick={replay}
            style={{ flex: 1, background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", borderRadius: 9, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontFamily: "inherit" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>replay</span> Again
          </button>
        )}
      </div>
      {state === "error" && (
        <p style={{ fontSize: 12, color: "#dc2626", marginTop: 8, textAlign: "center" }}>Audio generation failed. Please move to the next question.</p>
      )}
    </div>
  );
}

// ── Speaking recording helpers ────────────────────────────────────────────────
function parseEval(text: string) {
  const grade = text.match(/GRADE:\s*(.+)/)?.[1]?.trim() ?? "—";
  const result = text.match(/RESULT:\s*(.+)/)?.[1]?.trim() ?? "—";
  const fluency = text.match(/Fluency:\s*(.+)/)?.[1]?.trim() ?? "—";
  const grammar = text.match(/Grammar:\s*(.+)/)?.[1]?.trim() ?? "—";
  const vocab = text.match(/Vocabulary:\s*(.+)/)?.[1]?.trim() ?? "—";
  const pronunciation = text.match(/Pronunciation:\s*(.+)/)?.[1]?.trim() ?? "—";
  const taskComp = text.match(/Task Completion:\s*(.+)/)?.[1]?.trim() ?? "—";
  const total = text.match(/Total:\s*(.+)/)?.[1]?.trim() ?? "—";
  const wellDoneBlock = text.match(/WHAT THEY DID WELL:\n([\s\S]*?)(?=\nERRORS TO FIX:|$)/)?.[1] ?? "";
  const wellDone = wellDoneBlock.match(/^- .+$/gm)?.map((s) => s.slice(2)) ?? [];
  const errorsBlock = text.match(/ERRORS TO FIX:\n([\s\S]*?)(?=\n⭐|$)/)?.[1] ?? "";
  const errors = errorsBlock.match(/^- .+$/gm)?.map((s) => s.slice(2)) ?? [];
  const modelAnswer = text.match(/⭐ PERFECT MODEL ANSWER:\n([\s\S]*?)(?=\nTEACHER TIP:|$)/)?.[1]?.trim() ?? "";
  const teacherTip = text.match(/TEACHER TIP:\n?([\s\S]*?)$/)?.[1]?.trim() ?? "";
  return { grade, result, fluency, grammar, vocab, pronunciation, taskComp, total, wellDone, errors, modelAnswer, teacherTip };
}

function gradeColor(g: string) {
  if (g === "B1") return "#16a34a";
  if (g === "A2") return "#f59e0b";
  if (g === "A1") return "#ef4444";
  return "#94a3b8";
}

function speakingFairTotal(e: ReturnType<typeof parseEval>): number {
  const raw = [e.fluency, e.grammar, e.vocab, e.pronunciation, e.taskComp];
  const available = raw.filter((v) => v !== "—");
  if (available.length === 0) return 0;
  const sum = available.reduce((s, v) => s + (parseInt(v) || 0), 0);
  return Math.round((sum / (available.length * 5)) * 25);
}

function SpeakingEvalCard({ label, evalText }: { label: string; evalText: string }) {
  const e = parseEval(evalText);
  const color = gradeColor(e.grade);
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ background: `${color}15`, borderBottom: `2px solid ${color}30`, padding: "14px 16px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>{label.toUpperCase()} EVALUATION</p>
        <p style={{ fontSize: 20, fontWeight: 800, color }}>Grade {e.grade}</p>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        {e.modelAnswer && (
          <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #86efac", borderRadius: 12, padding: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 8 }}>💬 HOW YOU SHOULD ANSWER</p>
            <p style={{ fontSize: 14, color: "#14532d", lineHeight: 1.8, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{e.modelAnswer}</p>
          </div>
        )}
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>SCORES</p>
          {[["Fluency", e.fluency], ["Grammar", e.grammar], ["Vocabulary", e.vocab], ["Pronunciation", e.pronunciation], ["Task Completion", e.taskComp]].filter(([, val]) => val !== "—").map(([lbl, val]) => (
            <div key={lbl} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "#374151" }}>{lbl}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{val}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Total</span>
            <span style={{ fontSize: 14, fontWeight: 800, color }}>{speakingFairTotal(e)}/25</span>
          </div>
        </div>
        {e.wellDone.length > 0 && <div><p style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>✓ WHAT YOU DID WELL</p>{e.wellDone.map((pt, i) => <p key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4, paddingLeft: 12 }}>• {pt}</p>)}</div>}
        {e.errors.length > 0 && <div><p style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>✗ ERRORS TO FIX</p>{e.errors.map((pt, i) => <p key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4, paddingLeft: 12, fontFamily: "monospace" }}>• {pt}</p>)}</div>}
        {e.teacherTip && <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 10, padding: 12 }}><p style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", marginBottom: 4 }}>💡 TEACHER TIP</p><p style={{ fontSize: 13, color: "#1e3a8a", lineHeight: 1.6 }}>{e.teacherTip}</p></div>}
      </div>
    </div>
  );
}

const SPEAKING_PART_TYPES: Record<string, string> = {
  S1: "listen_answer_short",
  S2: "listen_answer_long",
  S3: "read_aloud",
  S4: "read_aloud_extended",
  S5: "leave_message",
};

function SpeakingRecorder({ question, part, onComplete }: {
  question: TextQuestion;
  part: ExamPart;
  onComplete: (evals: (string | null)[]) => void;
}) {
  const subPrompts = question.subPrompts;
  const totalSubs = subPrompts?.length ?? 1;
  const timePerSub = Math.floor(question.timeSeconds / totalSubs);
  const partType = SPEAKING_PART_TYPES[part.id] ?? "read_aloud";
  const isListenPart = partType === "listen_answer_short" || partType === "listen_answer_long";
  const isLeaveMessage = partType === "leave_message";

  const [subIdx, setSubIdx] = useState(0);
  const [subEvals, setSubEvals] = useState<(string | null)[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [status, setStatus] = useState<"idle" | "playing" | "recording" | "evaluating">("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [micError, setMicError] = useState("");
  const [isPreparing, setIsPreparing] = useState(isLeaveMessage);
  const [prepCountdown, setPrepCountdown] = useState(isLeaveMessage ? 40 : 0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const secondsRef = useRef(0);
  const questionAudioRef = useRef<HTMLAudioElement | null>(null);
  const prepTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const currentPrompt = subPrompts ? subPrompts[subIdx] : question.prompt;
  const mm = String(Math.floor(recordingTime / 60)).padStart(2, "0");
  const ss = String(recordingTime % 60).padStart(2, "0");
  const progress = Math.min((recordingTime / timePerSub) * 100, 100);

  // Leave message: 40-sec prep countdown before recording
  useEffect(() => {
    if (!isLeaveMessage) return;
    setIsPreparing(true);
    setPrepCountdown(40);
    prepTimerRef.current = setInterval(() => {
      setPrepCountdown((c) => {
        if (c <= 1) { clearInterval(prepTimerRef.current); setIsPreparing(false); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(prepTimerRef.current);
  }, []);

  // Auto-play audio question for listen_answer parts
  const playQuestion = useCallback((idx: number) => {
    if (questionAudioRef.current) { questionAudioRef.current.pause(); questionAudioRef.current = null; }
    const key = `fe-${part.id.toLowerCase()}q${idx + 1}`;
    const src = speakingAudioUrls[key];
    if (!src) { setStatus("idle"); return; }
    setStatus("playing");
    const audio = new Audio(src);
    questionAudioRef.current = audio;
    audio.onended = () => setStatus("idle");
    audio.onerror = () => setStatus("idle");
    audio.play().catch(() => setStatus("idle"));
  }, [part.id]);

  useEffect(() => {
    if (!isListenPart) return;
    playQuestion(subIdx);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subIdx]);

  const startRecording = useCallback(async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "audio/webm";
      const mr = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 32000 });
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.start(250);
      setStatus("recording");
      setRecordingTime(0);
      secondsRef.current = 0;
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => {
          const next = t + 1;
          secondsRef.current = next;
          if (next >= timePerSub) { stopRecording(); return next; }
          return next;
        });
      }, 1000);
    } catch {
      setMicError("Microphone access denied. Please allow microphone access and try again.");
    }
  }, [timePerSub]);

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state === "inactive") return;
    mr.onstop = async () => {
      const mimeType = mr.mimeType || "audio/webm";
      const blob = new Blob(audioChunksRef.current, { type: mimeType });
      mr.stream.getTracks().forEach((t) => t.stop());
      setStatus("evaluating");
      let evalResult: string | null = null;
      try {
        const fd = new FormData();
        fd.append("audio", blob, `exam_${part.id}_q${subIdx + 1}.webm`);
        fd.append("instruction", part.directions ?? "");
        fd.append("prompt", currentPrompt ?? question.prompt);
        fd.append("partType", partType);
        fd.append("partLabel", part.title);
        fd.append("graphicAlt", part.id === "S4" ? "Bar chart: Weekly Care Tasks Distribution — Personal Care 35%, Medication 20%, Mobility Support 18%, Meal Assistance 15%, Documentation 12%" : "");
        fd.append("durationSeconds", String(secondsRef.current));
        const res = await fetch("/api/speaking/evaluate", { method: "POST", body: fd });
        const data = await res.json();
        evalResult = data.evaluation ?? null;
      } catch { evalResult = null; }
      const newSubEvals = [...subEvals, evalResult];
      setSubEvals(newSubEvals);
      if (subIdx >= totalSubs - 1) {
        setStatus("idle");
        setShowReport(true);
      } else {
        setStatus("idle");
        setRecordingTime(0);
        secondsRef.current = 0;
        setSubIdx((s) => s + 1);
      }
    };
    mr.stop();
  }, [subIdx, totalSubs, subEvals, currentPrompt, question.prompt, part, partType, timePerSub]);

  if (showReport) {
    const subLabels = totalSubs > 1
      ? ((partType === "read_aloud" || partType === "read_aloud_extended")
          ? subPrompts!.map((_, i) => `Sentence ${i + 1}`)
          : subPrompts!.map((_, i) => `Q${i + 1}`))
      : [part.title];
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ flex: 1, padding: "16px 16px 8px", overflowY: "auto" }}>
          <div style={{ background: "#064e3b", borderRadius: 8, padding: "6px 12px", display: "inline-block", marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>{part.title.toUpperCase()} — FEEDBACK</p>
          </div>
          {subEvals.map((evalText, i) => evalText
            ? <SpeakingEvalCard key={i} label={subLabels[i] ?? `Q${i + 1}`} evalText={evalText} />
            : <div key={i} style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 12, padding: 14, marginBottom: 16 }}><p style={{ fontSize: 13, color: "#c2410c" }}>{subLabels[i] ?? `Q${i + 1}`} — evaluation unavailable</p></div>
          )}
        </div>
        <div style={{ padding: "12px 16px 28px", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
          <button onClick={() => onComplete(subEvals)} style={{ width: "100%", background: "linear-gradient(135deg, #064e3b, #059669)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            Continue <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>

      {/* Leave a message: prep countdown */}
      {isLeaveMessage && isPreparing && (
        <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, padding: 14, marginBottom: 12, textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Preparation Time</p>
          <p style={{ fontSize: 36, fontWeight: 800, color: "#92400e" }}>{prepCountdown}s</p>
          <p style={{ fontSize: 12, color: "#78350f" }}>Read the notes below carefully. Recording starts when the timer ends.</p>
        </div>
      )}

      {/* Leave a message: notes card */}
      {isLeaveMessage && (
        <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 8 }}>📋 YOUR NOTES — cover all points in your message</p>
          <p style={{ fontSize: 14, color: "#78350f", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{currentPrompt}</p>
          <p style={{ fontSize: 11, color: "#92400e", marginTop: 10, fontWeight: 600 }}>💡 Start with who you are · Cover every note point · Speak for at least 1 minute</p>
        </div>
      )}

      {/* Listen & Answer: show question text + progress */}
      {isListenPart && (
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1e3a8a" }}>QUESTION</p>
            {totalSubs > 1 && <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", background: "#f1f5f9", borderRadius: 6, padding: "2px 8px" }}>{subIdx + 1} / {totalSubs}</span>}
          </div>
          {totalSubs > 1 && (
            <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
              {Array.from({ length: totalSubs }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i < subIdx ? "#86efac" : i === subIdx ? "#1e3a8a" : "#e2e8f0", transition: "background 0.3s" }} />
              ))}
            </div>
          )}
          <p style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{currentPrompt}</p>
          <p style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>💡 Answer in full sentences · Give reasons where possible</p>
        </div>
      )}

      {/* Read aloud: show text prominently */}
      {(partType === "read_aloud" || partType === "read_aloud_extended") && (
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1e3a8a" }}>READ ALOUD</p>
            {totalSubs > 1 && <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", background: "#f1f5f9", borderRadius: 6, padding: "2px 8px" }}>{subIdx + 1} / {totalSubs}</span>}
          </div>
          {totalSubs > 1 && (
            <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
              {Array.from({ length: totalSubs }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i < subIdx ? "#86efac" : i === subIdx ? "#1e3a8a" : "#e2e8f0", transition: "background 0.3s" }} />
              ))}
            </div>
          )}
          <p style={{ fontSize: 18, color: "#1e293b", lineHeight: 1.8, fontWeight: 700, whiteSpace: "pre-wrap" }}>{currentPrompt}</p>
          <p style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>💡 Pause at commas · Stop at full stops · Don't rush</p>
        </div>
      )}

      <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
        Time: {Math.floor(timePerSub / 60)}:{String(timePerSub % 60).padStart(2, "0")} per {totalSubs > 1 ? "question" : "recording"}
      </p>

      {micError && <div style={{ background: "#fee2e2", borderRadius: 10, padding: 12, marginBottom: 16 }}><p style={{ fontSize: 13, color: "#dc2626" }}>{micError}</p></div>}

      {/* Playing audio question */}
      {status === "playing" && (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#eff6ff", border: "3px solid #3b82f6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "pulse 1.2s ease-in-out infinite" }}>
            <Volume2 size={32} color="#2563eb" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1e40af" }}>🔊 Question playing…</p>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Listen carefully, then get ready to answer</p>
        </div>
      )}

      {status === "idle" && !isPreparing && (
        <div style={{ textAlign: "center" }}>
          {isListenPart && (
            <button
              onClick={() => playQuestion(subIdx)}
              style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 10, padding: "8px 20px", color: "#1e40af", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Volume2 size={14} /> Play Again
            </button>
          )}
          <div onClick={startRecording} style={{ width: 120, height: 120, borderRadius: "50%", background: "#f0fdf4", border: "4px solid #16a34a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", cursor: "pointer" }}>
            <Mic size={36} color="#16a34a" />
            <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, marginTop: 4 }}>Start</span>
          </div>
          <p style={{ fontSize: 13, color: "#64748b" }}>Tap to record your answer</p>
        </div>
      )}
      {status === "recording" && (
        <div style={{ textAlign: "center" }}>
          <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 16px" }}>
            <svg width="120" height="120" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke="#dcfce7" strokeWidth="6" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="#16a34a" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div onClick={stopRecording} style={{ position: "absolute", top: 8, left: 8, width: 104, height: 104, borderRadius: "50%", background: "#fee2e2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <MicOff size={32} color="#dc2626" />
              <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 700, marginTop: 4 }}>Stop</span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#dc2626", fontWeight: 700 }}>🔴 Recording — {mm}:{ss}</p>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Speak clearly into your microphone</p>
        </div>
      )}
      {status === "evaluating" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 48, height: 48, border: "4px solid #d1fae5", borderTopColor: "#059669", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Evaluating your answer…</p>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>AI examiner is reviewing your response</p>
        </div>
      )}
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function FullExamTest() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");
  const [phase, setPhase] = useState<Phase>("section_intro");
  const [secIdx, setSecIdx] = useState(0);
  const [partIdx, setPartIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [sectionTimes, setSectionTimes] = useState<Record<string, number>>({});
  const [globalSecs, setGlobalSecs] = useState(TOTAL_EXAM_MINUTES * 60);
  const [sectionSecs, setSectionSecs] = useState(0);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [examScore, setExamScore] = useState<ReturnType<typeof calcExamScore> | null>(null);
  const [speakingPartEvals, setSpeakingPartEvals] = useState<Record<string, (string | null)[]>>({});
  const [showTips, setShowTips] = useState(false);

  const globalTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const sectionTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const section: ExamSection = FULL_EXAM_SECTIONS[secIdx];
  const part: ExamPart = section?.parts[partIdx];
  const question = part?.questions[qIdx];
  const totalParts = section?.parts.length || 0;
  const totalQInPart = part?.questions.length || 0;

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setUid(user.uid);
    getIdToken(user).then(setToken);
  }, [authLoading, user, router]);

  // Prevent accidental navigation away
  useEffect(() => {
    const handle = (e: BeforeUnloadEvent) => {
      if (!submitted) {
        e.preventDefault();
        e.returnValue = "Your exam is in progress. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handle);
    return () => window.removeEventListener("beforeunload", handle);
  }, [submitted]);

  // Global timer
  useEffect(() => {
    if (phase === "results" || submitted) return;
    globalTimer.current = setInterval(() => {
      setGlobalSecs((s) => {
        if (s <= 1) { clearInterval(globalTimer.current); handleFinishExam(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(globalTimer.current);
  }, [phase, submitted]);

  // Section timer
  useEffect(() => {
    if (phase !== "testing") { clearInterval(sectionTimer.current); return; }
    setSectionSecs(section.durationMinutes * 60);
    sectionTimer.current = setInterval(() => {
      setSectionSecs((s) => {
        if (s <= 1) {
          clearInterval(sectionTimer.current);
          advanceSection();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(sectionTimer.current);
  }, [secIdx, phase]);

  const advanceSection = useCallback(() => {
    clearInterval(sectionTimer.current);
    setSectionTimes((prev) => ({ ...prev, [section.id]: section.durationMinutes * 60 - sectionSecs }));
    if (secIdx < FULL_EXAM_SECTIONS.length - 1) {
      setSecIdx((i) => i + 1);
      setPartIdx(0);
      setQIdx(0);
      setShowSampleAnswer(false);
      setPhase("section_intro");
    } else {
      handleFinishExam();
    }
  }, [secIdx, section, sectionSecs]);

  const handleFinishExam = useCallback(() => {
    clearInterval(globalTimer.current);
    clearInterval(sectionTimer.current);
    setSubmitted(true);
    const score = calcExamScore(answers);
    setExamScore(score);
    setPhase("results");
    // Save results
    setSaving(true);
    getIdToken(auth.currentUser!).then((t) => {
      fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t, ...score, answers, sectionTimes }),
      }).finally(() => setSaving(false));
    }).catch(() => setSaving(false));
  }, [answers, sectionTimes]);

  const handleAnswer = (val: string | number) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: val }));
  };

  const goNext = () => {
    setShowSampleAnswer(false);
    setShowTips(false);
    // Try next question
    if (qIdx < totalQInPart - 1) { setQIdx((i) => i + 1); return; }
    // Try next part
    if (partIdx < totalParts - 1) { setPartIdx((i) => i + 1); setQIdx(0); return; }
    // Section done
    advanceSection();
  };

  const goPrev = () => {
    setShowSampleAnswer(false);
    setShowTips(false);
    if (qIdx > 0) { setQIdx((i) => i - 1); return; }
    if (partIdx > 0) { setPartIdx((i) => i - 1); setQIdx(0); }
  };

  const isLastQInExam = secIdx === FULL_EXAM_SECTIONS.length - 1 &&
    partIdx === section.parts.length - 1 &&
    qIdx === totalQInPart - 1;

  const currentAnswer = question ? answers[question.id] : undefined;
  const hasAnswer = currentAnswer !== undefined && currentAnswer !== "";

  // ── SECTION INTRO ──────────────────────────────────────────────────────────
  if (phase === "section_intro") {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, background: section.bg, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: section.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#fff", fontVariationSettings: "'FILL' 1" }}>{section.icon}</span>
        </div>
        <p style={{ fontSize: 12, fontWeight: 700, color: section.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
          Section {secIdx + 1} of {FULL_EXAM_SECTIONS.length}
        </p>
        <h1 style={{ fontFamily: H, fontSize: 28, fontWeight: 800, color: "#0d2067", marginBottom: 10 }}>{section.title}</h1>
        <p style={{ fontSize: 14, color: "#454651", marginBottom: 6 }}>
          {section.durationMinutes} minutes · {section.parts.length} parts
        </p>
        <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 28, maxWidth: 340, width: "100%", marginTop: 10 }}>
          <p style={{ fontSize: 14, color: "#454651", lineHeight: 1.6 }}>{section.overview}</p>
        </div>
        <div style={{ background: "rgba(13,32,103,0.08)", borderRadius: 10, padding: "8px 16px", marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: "#0d2067", fontWeight: 600 }}>
            Global time remaining: {fmt(globalSecs)}
          </p>
        </div>
        <button
          onClick={() => setPhase("testing")}
          style={{ background: section.color, color: "#fff", border: "none", borderRadius: 14, padding: "16px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: H, boxShadow: `0 4px 14px ${section.color}44` }}>
          Start {section.title} Section →
        </button>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── RESULTS / FULL TRANSCRIPT ─────────────────────────────────────────────
  if (phase === "results" && examScore) {
    const { correct, total, pct, cefr } = examScore;
    const cefrColor = cefr === "B1" ? "#16a34a" : cefr === "A2" ? "#d97706" : "#dc2626";
    const cefrBg = cefr === "B1" ? "#dcfce7" : cefr === "A2" ? "#fef3c7" : "#fee2e2";
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

    // ── Helpers for transcript ──────────────────────────────────────────────
    function TranscriptSection({ title, color, bg, icon, children }: { title: string; color: string; bg: string; icon: string; children: React.ReactNode }) {
      const [open, setOpen] = useState(true);
      return (
        <div style={{ border: `1.5px solid ${color}30`, borderRadius: 14, overflow: "hidden", marginBottom: 12 }}>
          <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: bg, border: "none", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              <span style={{ fontFamily: H, fontSize: 15, fontWeight: 700, color }}>{title}</span>
            </div>
            <span style={{ fontSize: 16, color }}>{open ? "▲" : "▼"}</span>
          </button>
          {open && <div style={{ background: "#fff", padding: "14px 16px" }}>{children}</div>}
        </div>
      );
    }

    // Speaking section
    const speakingParts = FULL_EXAM_SECTIONS.find(s => s.id === "speaking")!.parts;
    const speakingSection = FULL_EXAM_SECTIONS.find(s => s.id === "speaking")!;

    // Listening section
    const listeningParts = FULL_EXAM_SECTIONS.find(s => s.id === "listening")!.parts;

    // Reading section
    const readingParts = FULL_EXAM_SECTIONS.find(s => s.id === "reading")!.parts;

    // Writing section
    const writingParts = FULL_EXAM_SECTIONS.find(s => s.id === "writing")!.parts;

    return (
      <div style={{ minHeight: "100dvh", background: "#f0f2f5" }}>
        {/* Certificate header */}
        <div style={{ background: "linear-gradient(135deg, #0d2067, #1e3a8a)", padding: "28px 20px 36px" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#abf374", fontVariationSettings: "'FILL' 1", marginBottom: 8, display: "block" }}>workspace_premium</span>
            <h1 style={{ fontFamily: H, fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>WI Upskill Mock Test</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Full Exam Transcript · {today}</p>
          </div>
          {/* CEFR card */}
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: cefrBg, border: `2px solid ${cefrColor}`, borderRadius: 12, padding: "10px 18px", textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontFamily: H, fontSize: 36, fontWeight: 800, color: cefrColor, lineHeight: 1 }}>{cefr}</p>
              <p style={{ fontSize: 10, color: cefrColor, fontWeight: 700, marginTop: 2 }}>CEFR LEVEL</p>
            </div>
            <div>
              <p style={{ fontFamily: H, fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                {cefr === "B1" ? "Intermediate — Excellent performance" : cefr === "A2" ? "Elementary — Good foundation" : "Beginner — Keep practising"}
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>Auto-marked score: {correct}/{total} ({pct}%)</p>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 6, marginTop: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 4, background: cefrColor, width: `${pct}%` }} />
              </div>
            </div>
          </div>
          {/* Module score pills */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
            {(["listening","reading"] as const).map((id) => {
              const sec = FULL_EXAM_SECTIONS.find(s => s.id === id)!;
              let sc = 0, tot = 0;
              sec.parts.forEach(p => p.questions.forEach(q => {
                if (q.type === "mcq") { tot += q.points; if (Number(answers[q.id]) === (q as MCQQuestion).correct) sc += q.points; }
                else if (q.type === "fill") { tot += q.points; if (String(answers[q.id] ?? "").trim().toLowerCase() === (q as FillQuestion).answer.toLowerCase()) sc += q.points; }
                else if (q.type === "ordering") { const oq = q as OrderingQuestion; tot += oq.correctOrder.length; try { const u: string[] = JSON.parse(String(answers[q.id] ?? "[]")); oq.correctOrder.forEach((item, i) => { if (u[i] === item) sc++; }); } catch {} }
              }));
              const spct = tot > 0 ? Math.round((sc / tot) * 100) : 0;
              const color2 = spct >= 88 ? "#16a34a" : spct >= 63 ? "#d97706" : "#dc2626";
              return (
                <div key={id} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, textTransform: "uppercase" }}>{id}</p>
                  <p style={{ fontFamily: H, fontSize: 18, fontWeight: 800, color: "#fff" }}>{sc}/{tot}</p>
                  <p style={{ fontSize: 11, color: color2, fontWeight: 700 }}>{spct}%</p>
                </div>
              );
            })}
            {(["speaking","writing"] as const).map((id) => (
              <div key={id} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px" }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, textTransform: "uppercase" }}>{id}</p>
                <p style={{ fontFamily: H, fontSize: 13, fontWeight: 700, color: "#fff" }}>AI Evaluated</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>See below</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 16px 100px" }}>

          {/* ── SPEAKING TRANSCRIPT ─────────────────────────────── */}
          <TranscriptSection title="Speaking" color={speakingSection.color} bg={speakingSection.bg} icon="record_voice_over">
            {speakingParts.map((p) => {
              const evals = speakingPartEvals[p.id] ?? [];
              const partType = SPEAKING_PART_TYPES[p.id];
              const isReadAloud = partType === "read_aloud" || partType === "read_aloud_extended";
              const subLabels = evals.length > 1
                ? (isReadAloud ? evals.map((_, i) => `Sentence ${i + 1}`) : evals.map((_, i) => `Q${i + 1}`))
                : [p.title];
              return (
                <div key={p.id} style={{ marginBottom: 20 }}>
                  <div style={{ background: "#064e3b", borderRadius: 8, padding: "5px 12px", display: "inline-block", marginBottom: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>{p.title.toUpperCase()}</p>
                  </div>
                  {evals.length === 0 ? (
                    <div style={{ background: "#f1f5f9", borderRadius: 10, padding: 12 }}>
                      <p style={{ fontSize: 13, color: "#94a3b8" }}>Not completed.</p>
                    </div>
                  ) : evals.map((evalText, i) => evalText ? (
                    <SpeakingEvalCard key={i} label={subLabels[i] ?? `Q${i + 1}`} evalText={evalText} />
                  ) : (
                    <div key={i} style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                      <p style={{ fontSize: 13, color: "#c2410c" }}>{subLabels[i] ?? `Q${i + 1}`} — evaluation unavailable</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </TranscriptSection>

          {/* ── LISTENING TRANSCRIPT ────────────────────────────── */}
          <TranscriptSection title="Listening" color="#92400e" bg="#fffbeb" icon="hearing">
            {listeningParts.map((p) => (
              <div key={p.id} style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{p.title}</p>
                {p.questions.map((q, qi) => {
                  if (q.type === "mcq") {
                    const mq = q as MCQQuestion;
                    const userAns = Number(answers[q.id]);
                    const correct = userAns === mq.correct;
                    return (
                      <div key={q.id} style={{ background: correct ? "#f0fdf4" : "#fef2f2", border: `1.5px solid ${correct ? "#86efac" : "#fca5a5"}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                        <p style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}><strong>Q{qi + 1}.</strong> {mq.question}</p>
                        <p style={{ fontSize: 12, color: correct ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                          {correct ? "✓" : "✗"} Your answer: {mq.options[userAns] ?? "(no answer)"}
                        </p>
                        {!correct && <p style={{ fontSize: 12, color: "#16a34a" }}>✓ Correct: {mq.options[mq.correct]}</p>}
                      </div>
                    );
                  }
                  if (q.type === "ordering") {
                    const oq = q as OrderingQuestion;
                    let userOrder: string[] = [];
                    try { userOrder = JSON.parse(String(answers[q.id] ?? "[]")); } catch {}
                    let pts = 0;
                    oq.correctOrder.forEach((item, i) => { if (userOrder[i] === item) pts++; });
                    const correct = pts === oq.correctOrder.length;
                    return (
                      <div key={q.id} style={{ background: correct ? "#f0fdf4" : "#fef2f2", border: `1.5px solid ${correct ? "#86efac" : "#fca5a5"}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                        <p style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}><strong>Q{qi + 1}.</strong> {oq.question} <span style={{ color: "#92400e", fontWeight: 700 }}>({pts}/{oq.correctOrder.length} pts)</span></p>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Your order:</p>
                        {userOrder.length === 0 ? <p style={{ fontSize: 12, color: "#94a3b8" }}>(not answered)</p>
                          : userOrder.map((item, i) => {
                            const isRight = oq.correctOrder[i] === item;
                            return <p key={i} style={{ fontSize: 12, color: isRight ? "#16a34a" : "#dc2626", marginBottom: 2 }}>{i + 1}. {isRight ? "✓" : "✗"} {item}</p>;
                          })}
                        {!correct && (
                          <>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginTop: 6, marginBottom: 4 }}>Correct order:</p>
                            {oq.correctOrder.map((item, i) => <p key={i} style={{ fontSize: 12, color: "#16a34a", marginBottom: 2 }}>{i + 1}. {item}</p>)}
                          </>
                        )}
                      </div>
                    );
                  }
                  if (q.type === "fill") {
                    const fq = q as FillQuestion;
                    const userAns = String(answers[q.id] ?? "").trim();
                    const correct = userAns.toLowerCase() === fq.answer.toLowerCase();
                    return (
                      <div key={q.id} style={{ background: correct ? "#f0fdf4" : "#fef2f2", border: `1.5px solid ${correct ? "#86efac" : "#fca5a5"}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                        <p style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}><strong>Q{qi + 1}.</strong> {fq.question}</p>
                        <p style={{ fontSize: 12, color: correct ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                          {correct ? "✓" : "✗"} Your answer: "{userAns || "(no answer)"}"
                        </p>
                        {!correct && <p style={{ fontSize: 12, color: "#16a34a" }}>✓ Correct: "{fq.answer}"</p>}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </TranscriptSection>

          {/* ── READING TRANSCRIPT ──────────────────────────────── */}
          <TranscriptSection title="Reading" color="#0d2067" bg="#dde1ff" icon="menu_book">
            {readingParts.map((p) => (
              <div key={p.id} style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0d2067", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{p.title}</p>
                {p.questions.map((q, qi) => {
                  if (q.type !== "mcq") return null;
                  const mq = q as MCQQuestion;
                  const userAns = Number(answers[q.id]);
                  const correct = userAns === mq.correct;
                  return (
                    <div key={q.id} style={{ background: correct ? "#f0fdf4" : "#fef2f2", border: `1.5px solid ${correct ? "#86efac" : "#fca5a5"}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                      <p style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}><strong>Q{qi + 1}.</strong> {mq.question}</p>
                      <p style={{ fontSize: 12, color: correct ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                        {correct ? "✓" : "✗"} Your answer: {mq.options[userAns] ?? "(no answer)"}
                      </p>
                      {!correct && <p style={{ fontSize: 12, color: "#16a34a" }}>✓ Correct: {mq.options[mq.correct]}</p>}
                    </div>
                  );
                })}
              </div>
            ))}
          </TranscriptSection>

          {/* ── WRITING TRANSCRIPT ──────────────────────────────── */}
          <TranscriptSection title="Writing" color="#7c3aed" bg="#f5f3ff" icon="edit_note">
            {writingParts.map((p) => {
              const tq2 = p.questions[0] as TextQuestion;
              const studentAnswer = String(answers[tq2.id] ?? "").trim();
              const isPersonalPart = p.id === "W1";
              const partTypeLabel = isPersonalPart ? "✉ Personal Email" : "📝 Formal Reply";
              const partTypeColor = isPersonalPart ? "#15803d" : "#1e40af";
              const partTypeBg = isPersonalPart ? "#f0fdf4" : "#eff6ff";
              return (
                <div key={p.id} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.05em" }}>{p.title}</p>
                    <span style={{ background: partTypeBg, color: partTypeColor, fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px" }}>{partTypeLabel}</span>
                  </div>
                  <div style={{ background: "#f5f3ff", border: "1.5px solid #ddd6fe", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>TASK</p>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{tq2.prompt}</p>
                  </div>
                  <div style={{ background: studentAnswer ? "#fff" : "#f8f9fa", border: `1.5px solid ${studentAnswer ? "#ddd6fe" : "#e2e8f0"}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>YOUR ANSWER <span style={{ color: "#94a3b8", fontWeight: 400 }}>({studentAnswer.trim().split(/\s+/).filter(Boolean).length} words)</span></p>
                    {studentAnswer ? (
                      <p style={{ fontSize: 13, color: "#1e293b", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{studentAnswer}</p>
                    ) : (
                      <p style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic" }}>No answer submitted.</p>
                    )}
                  </div>
                  <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 10, padding: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>⭐ MODEL ANSWER</p>
                    <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.7, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{tq2.sampleAnswer}</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginTop: 10, marginBottom: 6 }}>ASSESSMENT CRITERIA</p>
                    {tq2.assessmentCriteria.map((c, i) => (
                      <p key={i} style={{ fontSize: 12, color: "#78350f", marginBottom: 3 }}>• {c}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </TranscriptSection>

          {/* Disclaimer */}
          <div style={{ background: "#fff8e1", border: "1.5px solid #fde68a", borderRadius: 12, padding: 14, marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
              <strong>Disclaimer:</strong> This is a practice exam only. Results do not represent official assessment results. Auto-marked score is based on Listening and Reading sections only.
            </p>
          </div>

          {saving && <p style={{ fontSize: 13, color: "#767682", textAlign: "center", marginBottom: 12 }}>Saving your results…</p>}

          <button onClick={() => router.push("/dashboard")}
            style={{ width: "100%", background: "#0d2067", color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: H, marginBottom: 10 }}>
            Back to Dashboard
          </button>
          <button onClick={() => router.push("/full-exam")}
            style={{ width: "100%", background: "#fff", color: "#0d2067", border: "1.5px solid #0d2067", borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: H }}>
            Retake Full Exam
          </button>
        </div>
      </div>
    );
  }

  // ── ACTIVE TEST ─────────────────────────────────────────────────────────────
  if (!question) return null;

  const isMCQ = question.type === "mcq";
  const isText = question.type === "text";
  const isOrdering = question.type === "ordering";
  const isFill = question.type === "fill";
  const q = question as MCQQuestion;
  const tq = question as TextQuestion;
  const oq = question as OrderingQuestion;
  const fq = question as FillQuestion;

  const sectionPct = Math.round(((section.durationMinutes * 60 - sectionSecs) / (section.durationMinutes * 60)) * 100);
  const globalPct = Math.round(((TOTAL_EXAM_MINUTES * 60 - globalSecs) / (TOTAL_EXAM_MINUTES * 60)) * 100);
  const isTimeLow = sectionSecs < 120;

  // ── SPEAKING SECTION — full audio recording flow ───────────────────────────
  if (section.id === "speaking" && isText) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 40, background: section.color, padding: "10px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {section.title} · Part {partIdx + 1}/{totalParts}
              </p>
              <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#fff" }}>{part.title}</p>
            </div>
            <div style={{ background: isTimeLow ? "#dc2626" : "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 10px" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Section</p>
              <p style={{ fontFamily: H, fontSize: 15, fontWeight: 800, color: "#fff" }}>{fmt(sectionSecs)}</p>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 4 }}>
            <div style={{ height: 4, borderRadius: 4, background: "#fff", width: `${sectionPct}%`, transition: "width 1s linear" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Total: {fmt(globalSecs)}</p>
          </div>
        </div>
        <div style={{ background: "#fff", borderBottom: "1px solid #e1e3e4", padding: "10px 16px" }}>
          <p style={{ fontSize: 12, color: "#454651", lineHeight: 1.5, fontStyle: "italic" }}>{part.directions}</p>
        </div>
        <SpeakingRecorder
          key={`${secIdx}-${partIdx}-${qIdx}`}
          question={tq}
          part={part}
          onComplete={(evals) => {
            setSpeakingPartEvals((prev) => ({ ...prev, [part.id]: evals }));
            goNext();
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      {/* Top bar — fixed */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: section.color, padding: "10px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {section.title} · Part {partIdx + 1}/{totalParts}
            </p>
            <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#fff" }}>
              Q {qIdx + 1}/{totalQInPart} — {part.title}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ background: isTimeLow ? "#dc2626" : "rgba(255,255,255,0.2)", borderRadius: 8, padding: "4px 10px" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Section</p>
              <p style={{ fontFamily: H, fontSize: 15, fontWeight: 800, color: "#fff" }}>{fmt(sectionSecs)}</p>
            </div>
          </div>
        </div>
        {/* Section progress bar */}
        <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 4 }}>
          <div style={{ height: 4, borderRadius: 4, background: "#fff", width: `${sectionPct}%`, transition: "width 1s linear" }} />
        </div>
        {/* Global timer strip */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Total: {fmt(globalSecs)}</p>
        </div>
      </div>

      {/* Part directions banner */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e1e3e4", padding: "10px 16px" }}>
        <p style={{ fontSize: 12, color: "#454651", lineHeight: 1.5, fontStyle: "italic" }}>{part.directions}</p>
      </div>

      {/* Question body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 20px" }}>

        {/* Listening: audio player for MCQ */}
        {section.id === "listening" && isMCQ && q.context && !["Same transcript as above.", "Same telephone message.", "Same training transcript.", "Same interview.", "Same interview."].includes(q.context) && (
          <ListeningPlayer key={q.id} text={q.context} label={q.contextLabel || `Part ${partIdx + 1}`} />
        )}
        {section.id === "listening" && isMCQ && q.context && ["Same transcript as above.", "Same telephone message.", "Same training transcript.", "Same interview."].includes(q.context) && (
          <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: "#92400e", fontWeight: 600 }}>🔊 Listen to the same audio as the previous question.</p>
          </div>
        )}

        {/* Listening: audio player for ordering */}
        {section.id === "listening" && isOrdering && (
          <ListeningPlayer key={oq.id} text={oq.context} label={oq.contextLabel || "Recording"} />
        )}

        {/* Listening: audio player for fill */}
        {section.id === "listening" && isFill && (
          <ListeningPlayer key={fq.id} text={fq.context} label={fq.contextLabel || "Recording"} />
        )}

        {/* Context (passage/transcript) — non-listening MCQ */}
        {isMCQ && section.id !== "listening" && q.context && q.context !== "Same email." && q.context !== "Same article." && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: 14, marginBottom: 14 }}>
            {q.contextLabel && <p style={{ fontSize: 11, fontWeight: 700, color: "#767682", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{q.contextLabel}</p>}
            <p style={{ fontSize: 13, color: "#191c1d", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{q.context}</p>
          </div>
        )}
        {isMCQ && section.id !== "listening" && q.contextLabel && (q.context === "Same email." || q.context === "Same article.") && (
          <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "8px 12px", marginBottom: 12, border: "1px dashed #c6c5d2" }}>
            <p style={{ fontSize: 12, color: "#767682" }}>↑ Refer to the passage above for this question.</p>
          </div>
        )}

        {/* Question */}
        <div style={{ background: section.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: section.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Question {qIdx + 1}
          </p>
          <p style={{ fontFamily: H, fontSize: 16, fontWeight: 600, color: "#191c1d", lineHeight: 1.5 }}>
            {isMCQ ? q.question : isOrdering ? oq.question : isFill ? fq.question : tq.prompt}
          </p>
        </div>

        {/* MCQ options */}
        {isMCQ && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => {
              const selected = Number(currentAnswer) === i;
              return (
                <button key={i} onClick={() => handleAnswer(i)}
                  style={{
                    width: "100%", textAlign: "left", background: selected ? section.color : "#fff",
                    color: selected ? "#fff" : "#191c1d", border: selected ? `2px solid ${section.color}` : "2px solid #c6c5d2",
                    borderRadius: 12, padding: "14px 16px", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: selected ? "rgba(255,255,255,0.25)" : "#f3f4f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Ordering question */}
        {isOrdering && (() => {
          let userOrder: string[] = [];
          try { userOrder = JSON.parse(String(currentAnswer ?? "[]")); } catch { userOrder = []; }
          const setOrder = (newOrder: string[]) => handleAnswer(JSON.stringify(newOrder));
          const handleTap = (item: string) => {
            if (userOrder.includes(item)) setOrder(userOrder.filter((x) => x !== item));
            else if (userOrder.length < oq.items.length) setOrder([...userOrder, item]);
          };
          return (
            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>Tap items in the order you hear them (1st → 5th). Tap again to remove.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {oq.items.map((item) => {
                  const pos = userOrder.indexOf(item);
                  const selected = pos !== -1;
                  return (
                    <button key={item} onClick={() => handleTap(item)}
                      style={{ display: "flex", alignItems: "center", gap: 10, background: selected ? "#fef3c7" : "#f8f9fa", border: `2px solid ${selected ? "#f59e0b" : "#c6c5d2"}`, borderRadius: 12, padding: "11px 14px", fontSize: 14, color: selected ? "#92400e" : "#191c1d", fontWeight: selected ? 600 : 400, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                      <span style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: selected ? "#f59e0b" : "#e2e8f0", color: selected ? "#fff" : "#94a3b8", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {selected ? pos + 1 : "·"}
                      </span>
                      {item}
                    </button>
                  );
                })}
              </div>
              {userOrder.length > 0 && (
                <button onClick={() => setOrder([])} style={{ marginTop: 10, fontSize: 12, color: "#dc2626", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  ✕ Clear order
                </button>
              )}
            </div>
          );
        })()}

        {/* Fill question */}
        {isFill && (
          <div>
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Type the missing word exactly as you hear it.</p>
            <input
              type="text"
              value={String(currentAnswer ?? "")}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here…"
              style={{ width: "100%", padding: "13px 14px", fontSize: 15, color: "#191c1d", border: `2px solid ${currentAnswer ? "#f59e0b" : "#c6c5d2"}`, borderRadius: 12, outline: "none", background: currentAnswer ? "#fef3c7" : "#f8fafc", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>
        )}

        {/* Text input — writing section only */}
        {isText && section.id !== "speaking" && (() => {
          const isPersonal = part.id === "W1";
          const partLabel = isPersonal ? "PART 1 — PERSONAL EMAIL" : "PART 2 — FORMAL REPLY";
          const partIcon = isPersonal ? "✉" : "📝";
          const partHint = isPersonal
            ? "Write as if you are texting a friend — warm, friendly, use 'Hi [Name],' to start and 'See you soon!' or 'Take care,' to end."
            : "Write professionally — use 'Dear [Title/Name],' to start and 'Yours sincerely,' or 'Kind regards,' to end.";
          const toneColor = isPersonal ? "#15803d" : "#1e40af";
          const toneBg = isPersonal ? "#f0fdf4" : "#eff6ff";
          const toneBorder = isPersonal ? "#86efac" : "#bfdbfe";
          const wc = wordCount((currentAnswer as string) || "");
          const wcMet = wc >= 50;
          const placeholder = isPersonal
            ? "Hi [Name],\n\n[Write your friendly reply here — cover all the points mentioned]\n\nSee you soon!\n[Your name]"
            : "Dear [Hiring Manager / Sir or Madam],\n\n[Write your formal reply here — cover all the required points]\n\nYours sincerely,\n[Your name]";
          return (
            <div>
              {/* Part type badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ background: toneColor, borderRadius: 8, padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13 }}>{partIcon}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.05em" }}>{partLabel}</span>
                </div>
                <span style={{ fontSize: 11, color: "#767682" }}>~15 min · 50+ words</span>
              </div>

              {/* Tone hint card */}
              <div style={{ background: toneBg, border: `1.5px solid ${toneBorder}`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: toneColor, marginBottom: 4 }}>
                  {isPersonal ? "Friendly tone" : "Formal tone"}
                </p>
                <p style={{ fontSize: 12, color: toneColor, lineHeight: 1.5 }}>{partHint}</p>
              </div>

              {/* Collapsible tips panel */}
              <button
                onClick={() => setShowTips((v) => !v)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: "0 0 10px", fontSize: 12, fontWeight: 700, color: "#767682", cursor: "pointer", fontFamily: "inherit" }}
              >
                <span style={{ fontSize: 14 }}>{showTips ? "▲" : "▼"}</span>
                {showTips ? "Hide writing tips" : "Show writing tips"}
              </button>
              {showTips && (
                <div style={{ background: "#f8f9fa", border: "1.5px solid #e1e3e4", borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 12, color: "#454651", lineHeight: 1.7 }}>
                  <p style={{ fontWeight: 700, marginBottom: 8, color: "#191c1d" }}>5 rules for a good mark:</p>
                  <p>1. <strong>Greeting</strong> — Start with {isPersonal ? '"Hi [Name],"' : '"Dear [Name / Sir / Madam],"'}</p>
                  <p>2. <strong>Address every point</strong> — give each one at least one sentence</p>
                  <p>3. <strong>Linking words</strong> — use <em>and, but, because, also, so, however</em></p>
                  <p>4. <strong>50+ words</strong> — count as you write</p>
                  <p>5. <strong>Sign-off</strong> — End with {isPersonal ? '"See you soon! / Take care," + your name' : '"Yours sincerely, / Kind regards," + your name'}</p>
                  <p style={{ marginTop: 8, fontWeight: 700, color: "#191c1d" }}>Email structure:</p>
                  <p>Greeting → Reason for writing → Point 1 → Point 2 → Point 3 → Closing line → Sign-off</p>
                </div>
              )}

              <textarea
                value={(currentAnswer as string) || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={placeholder}
                rows={8}
                style={{ width: "100%", border: `2px solid ${wcMet ? "#16a34a" : "#c6c5d2"}`, borderRadius: 12, padding: "14px", fontSize: 14, color: "#191c1d", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box", transition: "border-color 0.3s" }}
              />

              {/* Word counter */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: wcMet ? "#16a34a" : wc > 0 ? "#dc2626" : "#767682" }}>
                  {wcMet
                    ? `Word count met ✓ (${wc} words)`
                    : wc > 0
                    ? `${50 - wc} more word${50 - wc !== 1 ? "s" : ""} needed`
                    : "Min 50 words"}
                </p>
                <p style={{ fontSize: 12, color: "#767682" }}>Time: {fmt(tq.timeSeconds)}</p>
              </div>

              {/* Model answer toggle */}
              <button onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                style={{ marginTop: 12, background: "#f3f4f5", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#454651", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{showSampleAnswer ? "visibility_off" : "visibility"}</span>
                {showSampleAnswer ? "Hide model answer" : "Show model answer"}
              </button>

              {showSampleAnswer && (
                <div style={{ marginTop: 12, background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 8 }}>Model Answer</p>
                  <p style={{ fontSize: 13, color: "#191c1d", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{tq.sampleAnswer}</p>
                  <div style={{ marginTop: 12, borderTop: "1px solid #bbf7d0", paddingTop: 10 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>Self-Assessment Checklist</p>
                    {tq.assessmentCriteria.map((c, i) => (
                      <p key={i} style={{ fontSize: 12, color: "#454651", marginBottom: 4, display: "flex", gap: 6 }}>
                        <span style={{ color: "#16a34a" }}>✓</span> {c}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Bottom navigation */}
      <div style={{ background: "#fff", borderTop: "1px solid #e1e3e4", padding: "12px 16px", display: "flex", gap: 10 }}>
        {qIdx > 0 || partIdx > 0 ? (
          <button onClick={goPrev}
            style={{ flex: 1, background: "#f3f4f5", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#454651", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
            Back
          </button>
        ) : <div style={{ flex: 1 }} />}

        <button
          onClick={isLastQInExam ? handleFinishExam : goNext}
          disabled={isMCQ && !hasAnswer}
          style={{
            flex: 2, background: isLastQInExam ? "#16a34a" : (isMCQ && !hasAnswer ? "#e1e3e4" : section.color),
            color: (isMCQ && !hasAnswer) ? "#767682" : "#fff", border: "none", borderRadius: 12,
            padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: (isMCQ && !hasAnswer) ? "not-allowed" : "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
          {isLastQInExam ? (
            <><span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>task_alt</span>Submit Exam</>
          ) : qIdx < totalQInPart - 1 ? (
            <>Next Question <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span></>
          ) : partIdx < totalParts - 1 ? (
            <>Next Part <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span></>
          ) : (
            <>Next Section <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span></>
          )}
        </button>
      </div>
    </div>
  );
}
