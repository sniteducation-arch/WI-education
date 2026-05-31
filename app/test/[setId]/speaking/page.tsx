"use client";
import { use, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { testSets } from "@/lib/questions";
import { ArrowLeft, Mic, MicOff, Clock, ChevronRight } from "lucide-react";

type PartStatus = "idle" | "recording" | "evaluating" | "done";

const today = () => new Date().toDateString(); // e.g. "Sat May 31 2026"

// ── Evaluation parser ─────────────────────────────────────────────────────────
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

// ── Evaluation card ───────────────────────────────────────────────────────────
function EvalCard({ partNum, evalText }: { partNum: number; evalText: string }) {
  const e = parseEval(evalText);
  const color = gradeColor(e.grade);
  const isPassing = e.result === "PASS";

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ background: `${color}15`, borderBottom: `2px solid ${color}30`, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>PART {partNum} EVALUATION</p>
          <p style={{ fontSize: 20, fontWeight: 800, color }}>Grade {e.grade}</p>
        </div>
        <span style={{ background: isPassing ? "#dcfce7" : "#fee2e2", color: isPassing ? "#16a34a" : "#dc2626", fontWeight: 700, fontSize: 12, padding: "5px 12px", borderRadius: 9999 }}>
          {e.result}
        </span>
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>SCORES</p>
          {[
            { label: "Fluency", val: e.fluency },
            { label: "Grammar", val: e.grammar },
            { label: "Vocabulary", val: e.vocab },
            { label: "Pronunciation", val: e.pronunciation },
            { label: "Task Completion", val: e.taskComp },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "#374151" }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{s.val}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Total</span>
            <span style={{ fontSize: 14, fontWeight: 800, color }}>{e.total}</span>
          </div>
        </div>

        {e.wellDone.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>✓ WHAT YOU DID WELL</p>
            {e.wellDone.map((pt, i) => (
              <p key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4, paddingLeft: 12 }}>• {pt}</p>
            ))}
          </div>
        )}

        {e.errors.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>✗ ERRORS TO FIX</p>
            {e.errors.map((pt, i) => (
              <p key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4, paddingLeft: 12, fontFamily: "monospace" }}>• {pt}</p>
            ))}
          </div>
        )}

        {e.modelAnswer && (
          <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 10, padding: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>⭐ PERFECT MODEL ANSWER</p>
            <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{e.modelAnswer}</p>
          </div>
        )}

        {e.teacherTip && (
          <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 10, padding: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", marginBottom: 4 }}>💡 TEACHER TIP</p>
            <p style={{ fontSize: 13, color: "#1e3a8a", lineHeight: 1.6 }}>{e.teacherTip}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SpeakingPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = use(params);
  const router = useRouter();
  const setNum = parseInt(setId);
  const tasks = testSets[setNum]?.speaking || [];

  const { user, authLoading } = useAuth();
  const [uid, setUid] = useState("");
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState<PartStatus>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [partResults, setPartResults] = useState<(string | null)[]>(tasks.map(() => null));
  const [finished, setFinished] = useState(false);
  const [micError, setMicError] = useState("");
  const [alreadyUsedToday, setAlreadyUsedToday] = useState(false);
  const [limitChecking, setLimitChecking] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setUid(user.uid);

    // Check if already attempted speaking for this set today
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const lastAttempt = snap.data()?.progress?.[`set${setNum}`]?.speakingLastAttempt;
        if (lastAttempt && lastAttempt === today()) {
          setAlreadyUsedToday(true);
        }
      } catch { /* non-critical */ } finally {
        setLimitChecking(false);
      }
    })();
  }, [authLoading, user, router]);

  // Reset when moving to next part
  useEffect(() => {
    setStatus("idle");
    setRecordingTime(0);
    setMicError("");
    clearInterval(timerRef.current);
  }, [current]);

  const startRecording = useCallback(async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Pick best supported format
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 32000 });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start(250); // collect chunks every 250ms
      setStatus("recording");
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => {
          if (t >= (tasks[current]?.timeSeconds ?? 120)) {
            stopRecording();
            return t;
          }
          return t + 1;
        });
      }, 1000);
    } catch {
      setMicError("Microphone access denied. Please allow microphone access and try again.");
    }
  }, [current, tasks]);

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder || mediaRecorder.state === "inactive") return;

    mediaRecorder.onstop = async () => {
      const mimeType = mediaRecorder.mimeType || "audio/webm";
      const blob = new Blob(audioChunksRef.current, { type: mimeType });
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());

      setStatus("evaluating");

      try {
        const task = tasks[current];
        const fd = new FormData();
        fd.append("audio", blob, `part${current + 1}.webm`);
        fd.append("instruction", task?.instruction ?? "");
        fd.append("prompt", task?.prompt ?? "");

        const res = await fetch("/api/speaking/evaluate", { method: "POST", body: fd });
        const data = await res.json();

        const updated = [...partResults];
        updated[current] = data.evaluation ?? null;
        setPartResults(updated);
      } catch {
        const updated = [...partResults];
        updated[current] = null;
        setPartResults(updated);
      }

      setStatus("done");
    };

    mediaRecorder.stop();
  }, [current, tasks, partResults]);

  const handleFinish = async () => {
    if (uid) {
      try {
        const grades = partResults
          .filter(Boolean)
          .map((r) => parseEval(r!).grade);
        const gradeToNum: Record<string, number> = { B1: 3, A2: 2, A1: 1, "Below A1": 0 };
        const avg = grades.length
          ? grades.reduce((s, g) => s + (gradeToNum[g] ?? 1), 0) / grades.length
          : 1;
        const overallGrade = avg >= 2.5 ? "B1" : avg >= 1.5 ? "A2" : "A1";
        const percentage = avg >= 2.5 ? 85 : avg >= 1.5 ? 65 : 45;

        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        const existing = snap.data()?.progress || {};
        await updateDoc(ref, {
          progress: {
            ...existing,
            [`set${setNum}`]: {
              ...(existing[`set${setNum}`] || {}),
              speaking: percentage,
              speakingGrade: overallGrade,
              speakingLastAttempt: today(),
            },
          },
        });
      } catch { /* non-critical */ }
    }
    setFinished(true);
  };

  const task = tasks[current];
  const mm = String(Math.floor(recordingTime / 60)).padStart(2, "0");
  const ss = String(recordingTime % 60).padStart(2, "0");
  const maxTime = task?.timeSeconds ?? 120;
  const progress = Math.min((recordingTime / maxTime) * 100, 100);

  // ── Limit checking ──
  if (limitChecking) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "4px solid #d1fae5", borderTopColor: "#059669", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Already used today ──
  if (alreadyUsedToday) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎤</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Come Back Tomorrow</h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 300, marginBottom: 24 }}>
          You have already completed the speaking test for Set {setNum} today. You can practise again tomorrow.
        </p>
        <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: 14, maxWidth: 300, marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>
            💡 Use the time to review your feedback from today's session and practise the model answers.
          </p>
        </div>
        <button
          onClick={() => router.push(`/test/${setId}`)}
          style={{ background: "linear-gradient(135deg, #064e3b, #059669)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
        >
          Back to Set {setNum}
        </button>
      </div>
    );
  }

  // ── Finished screen ──
  if (finished) {
    const hasResults = partResults.some(Boolean);
    return (
      <div style={{ minHeight: "100dvh", background: "#f8fafc" }}>
        <div style={{ background: "linear-gradient(135deg, #064e3b, #059669)", padding: "20px 16px 24px" }}>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginBottom: 4 }}>Speaking · Set {setNum}</p>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
            {hasResults ? "AI Examiner Feedback" : "Speaking Complete"}
          </h2>
        </div>
        <div style={{ padding: "16px 16px 32px" }}>
          {hasResults ? (
            tasks.map((t, i) =>
              partResults[i] ? (
                <EvalCard key={t.id} partNum={i + 1} evalText={partResults[i]!} />
              ) : (
                <div key={t.id} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 16, marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: "#64748b" }}>Part {i + 1} — no recording submitted</p>
                </div>
              )
            )
          ) : (
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 20, marginBottom: 16, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#64748b" }}>No evaluations available.</p>
            </div>
          )}
          <button
            onClick={() => router.push(`/test/${setId}`)}
            style={{ width: "100%", background: "linear-gradient(135deg, #1e3a8a, #3b5fc0)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer" }}
          >
            Back to Set {setNum}
          </button>
        </div>
      </div>
    );
  }

  // ── Speaking screen ──
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #064e3b, #059669)", padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={() => router.push(`/test/${setId}`)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#fff", fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={14} color="#fff" />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{mm}:{ss}</span>
          </div>
        </div>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Speaking · Set {setNum}</p>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Part {current + 1} of {tasks.length}</p>
        <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
          {tasks.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: partResults[i] ? "#86efac" : i === current ? "#fff" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>
        {/* Prompt cards */}
        <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 6 }}>INSTRUCTION</p>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{task?.instruction}</p>
        </div>
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1e3a8a", marginBottom: 8 }}>SPEAKING PROMPT</p>
          <p style={{ fontSize: 15, color: "#1e293b", lineHeight: 1.7, fontWeight: 500 }}>{task?.prompt}</p>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 10 }}>
            Time limit: {Math.floor(maxTime / 60)}:{String(maxTime % 60).padStart(2, "0")} min
          </p>
        </div>

        {/* Mic error */}
        {micError && (
          <div style={{ background: "#fee2e2", borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "#dc2626" }}>{micError}</p>
          </div>
        )}

        {/* Recording UI */}
        {status === "idle" && (
          <div style={{ textAlign: "center" }}>
            <div
              onClick={startRecording}
              style={{ width: 120, height: 120, borderRadius: "50%", background: "#f0fdf4", border: "4px solid #16a34a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", cursor: "pointer" }}
            >
              <Mic size={36} color="#16a34a" />
              <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, marginTop: 4 }}>Start</span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b" }}>Tap to start recording your answer</p>
          </div>
        )}

        {status === "recording" && (
          <div style={{ textAlign: "center" }}>
            {/* Progress ring visual */}
            <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 16px" }}>
              <svg width="120" height="120" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="54" fill="none" stroke="#dcfce7" strokeWidth="6" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#16a34a" strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div
                onClick={stopRecording}
                style={{ position: "absolute", top: 8, left: 8, width: 104, height: 104, borderRadius: "50%", background: "#fee2e2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <MicOff size={32} color="#dc2626" />
                <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 700, marginTop: 4 }}>Stop</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#dc2626", fontWeight: 700, animation: "pulse 1s infinite" }}>
              🔴 Recording — {mm}:{ss}
            </p>
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Speak clearly into your microphone</p>
          </div>
        )}

        {status === "evaluating" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 48, height: 48, border: "4px solid #d1fae5", borderTopColor: "#059669", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Evaluating your speaking…</p>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>AI examiner is reviewing your response</p>
          </div>
        )}

        {status === "done" && partResults[current] && (
          <EvalCard partNum={current + 1} evalText={partResults[current]!} />
        )}

        {status === "done" && !partResults[current] && (
          <div style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: "#c2410c" }}>Evaluation unavailable for this part. You can still continue.</p>
          </div>
        )}

        {/* Re-record option */}
        {status === "done" && (
          <button
            onClick={() => { setStatus("idle"); setRecordingTime(0); }}
            style={{ width: "100%", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 12, padding: "11px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}
          >
            🔄 Re-record this part
          </button>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ padding: "12px 16px 24px", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
        {current < tasks.length - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={status !== "done"}
            style={{ width: "100%", background: status === "done" ? "linear-gradient(135deg, #064e3b, #059669)" : "#e2e8f0", color: status === "done" ? "#fff" : "#94a3b8", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: status === "done" ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            Next Part <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={status !== "done"}
            style={{ width: "100%", background: status === "done" ? "linear-gradient(135deg, #16a34a, #22c55e)" : "#e2e8f0", color: status === "done" ? "#fff" : "#94a3b8", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: status === "done" ? "pointer" : "not-allowed" }}
          >
            Finish Speaking
          </button>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
