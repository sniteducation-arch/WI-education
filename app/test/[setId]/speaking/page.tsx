"use client";
import { use, useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { testSets } from "@/lib/questions";
import { ArrowLeft, Mic, MicOff, Clock, ChevronRight } from "lucide-react";

type PartStatus = "idle" | "recording" | "evaluating" | "done";

const today = () => new Date().toDateString();

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

// Recalculate total fairly: only count criteria that have a valid numeric score
function fairTotal(e: ReturnType<typeof parseEval>): number {
  const raw = [e.fluency, e.grammar, e.vocab, e.pronunciation, e.taskComp];
  const scores = raw.map((v) => parseInt(v)).filter((n) => !isNaN(n));
  if (scores.length === 0) return 0;
  return Math.round((scores.reduce((s, n) => s + n, 0) / (scores.length * 5)) * 25);
}

// Grade based on score out of 25 — aligned with real exam (35/40 = B1)
function scoreToGrade(score: number): string {
  if (score >= 20) return "B1";
  if (score >= 13) return "A2";
  return "A1";
}

// Recalculate grade from fair total, preserving Below A1 for silent/no-speech cases
function evalGrade(e: ReturnType<typeof parseEval>): string {
  if (e.grade === "Below A1") return "Below A1";
  return scoreToGrade(fairTotal(e));
}

// ── Evaluation card ───────────────────────────────────────────────────────────
function EvalCard({ label, evalText }: { label: string; evalText: string }) {
  const e = parseEval(evalText);
  const grade = evalGrade(e);
  const total = fairTotal(e);
  const color = gradeColor(grade);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ background: `${color}15`, borderBottom: `2px solid ${color}30`, padding: "14px 16px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>{label.toUpperCase()} EVALUATION</p>
        <p style={{ fontSize: 20, fontWeight: 800, color }}>Grade {grade}</p>
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* How you should answer — shown first and prominently */}
        {e.modelAnswer && (
          <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #86efac", borderRadius: 12, padding: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 8 }}>💬 HOW YOU SHOULD ANSWER</p>
            <p style={{ fontSize: 14, color: "#14532d", lineHeight: 1.8, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{e.modelAnswer}</p>
          </div>
        )}

        {/* Scores */}
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>SCORES</p>
          {[
            { label: "Fluency", val: e.fluency },
            { label: "Grammar", val: e.grammar },
            { label: "Vocabulary", val: e.vocab },
            { label: "Pronunciation", val: e.pronunciation },
            { label: "Task Completion", val: e.taskComp },
          ].filter((s) => !isNaN(parseInt(s.val))).map((s) => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "#374151" }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{s.val}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Total</span>
            <span style={{ fontSize: 14, fontWeight: 800, color }}>{total}/25</span>
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

  // Part navigation
  const [current, setCurrent] = useState(0);
  const [partResults, setPartResults] = useState<(string | null)[]>(tasks.map(() => null));
  const [allPartSubEvals, setAllPartSubEvals] = useState<(string | null)[][]>(tasks.map(() => []));
  const [finished, setFinished] = useState(false);

  // Sub-question state (within a part)
  const [subIdx, setSubIdx] = useState(0);                                // current sub-question index
  const [subEvals, setSubEvals] = useState<(string | null)[]>([]);        // evaluations per sub-question
  const [showPartReport, setShowPartReport] = useState(false);            // show part report after all sub-qs done

  // Recording state
  const [status, setStatus] = useState<PartStatus>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [prepCountdown, setPrepCountdown] = useState(0);
  const [isPreparing, setIsPreparing] = useState(false);
  const [micError, setMicError] = useState("");

  // Auth / limit
  const [alreadyUsedToday, setAlreadyUsedToday] = useState(false);
  const [limitChecking, setLimitChecking] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const prepTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const recordingSecondsRef = useRef(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setUid(user.uid);
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const lastAttempt = snap.data()?.progress?.[`set${setNum}`]?.speakingLastAttempt;
        if (lastAttempt && lastAttempt === today()) setAlreadyUsedToday(true);
      } catch { /* non-critical */ } finally {
        setLimitChecking(false);
      }
    })();
  }, [authLoading, user, router]);

  // Reset everything when moving to a new PART
  useEffect(() => {
    setStatus("idle");
    setRecordingTime(0);
    recordingSecondsRef.current = 0;
    setSubIdx(0);
    setSubEvals([]);
    setShowPartReport(false);
    setMicError("");
    setIsPreparing(false);
    clearInterval(timerRef.current);
    clearInterval(prepTimerRef.current);

    const task = tasks[current];
    if (task?.prepSeconds && task.prepSeconds > 0) {
      setIsPreparing(true);
      setPrepCountdown(task.prepSeconds);
      prepTimerRef.current = setInterval(() => {
        setPrepCountdown((c) => {
          if (c <= 1) { clearInterval(prepTimerRef.current); setIsPreparing(false); return 0; }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(prepTimerRef.current);
  }, [current]);

  // Derived values for current sub-question
  const task = tasks[current];
  const subPrompts = task?.subPrompts;
  const totalSubs = subPrompts?.length ?? 1;
  const timePerSub = Math.floor((task?.timeSeconds ?? 120) / totalSubs);
  const currentPrompt = subPrompts ? subPrompts[subIdx] : task?.prompt;

  const mm = String(Math.floor(recordingTime / 60)).padStart(2, "0");
  const ss = String(recordingTime % 60).padStart(2, "0");
  const progress = Math.min((recordingTime / timePerSub) * 100, 100);

  const startRecording = useCallback(async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

      mediaRecorder.start(250);
      setStatus("recording");
      setRecordingTime(0);
      recordingSecondsRef.current = 0;

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => {
          const next = t + 1;
          recordingSecondsRef.current = next;
          if (next >= timePerSub) {
            stopRecording();
            return next;
          }
          return next;
        });
      }, 1000);
    } catch {
      setMicError("Microphone access denied. Please allow microphone access and try again.");
    }
  }, [current, subIdx, timePerSub]);

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current);
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder || mediaRecorder.state === "inactive") return;

    mediaRecorder.onstop = async () => {
      const mimeType = mediaRecorder.mimeType || "audio/webm";
      const blob = new Blob(audioChunksRef.current, { type: mimeType });
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());

      setStatus("evaluating");

      let evalResult: string | null = null;
      try {
        const fd = new FormData();
        fd.append("audio", blob, `part${current + 1}_q${subIdx + 1}.webm`);
        fd.append("instruction", task?.instruction ?? "");
        // Send the specific sub-prompt for accurate evaluation
        fd.append("prompt", currentPrompt ?? task?.prompt ?? "");
        fd.append("partType", task?.partType ?? "interview");
        fd.append("partLabel", task?.partLabel ?? `Part ${current + 1}`);
        fd.append("graphicAlt", task?.graphicAlt ?? "");
        fd.append("durationSeconds", String(recordingSecondsRef.current));

        const res = await fetch("/api/speaking/evaluate", { method: "POST", body: fd });
        const data = await res.json();
        evalResult = data.evaluation ?? null;
      } catch {
        evalResult = null;
      }

      const newSubEvals = [...subEvals, evalResult];
      setSubEvals(newSubEvals);

      const isLastSub = subIdx >= totalSubs - 1;

      if (isLastSub) {
        // All sub-questions done — save to partResults and show part report
        const combined = newSubEvals.find(Boolean) ?? null;
        setPartResults((prev) => { const u = [...prev]; u[current] = combined; return u; });
        setAllPartSubEvals((prev) => { const u = [...prev]; u[current] = newSubEvals; return u; });
        setStatus("done");
        setShowPartReport(true);
      } else {
        // More sub-questions remaining — advance to next one
        setStatus("idle");
        setRecordingTime(0);
        recordingSecondsRef.current = 0;
        setSubIdx((s) => s + 1);
      }
    };

    mediaRecorder.stop();
  }, [current, subIdx, totalSubs, subEvals, task, currentPrompt]);

  const handleNextPart = () => {
    setCurrent((c) => c + 1);
  };

  const handleFinish = async () => {
    if (uid) {
      try {
        // Grade from ALL sub-evals across all parts for accuracy
        const gradeToNum: Record<string, number> = { B1: 3, A2: 2, A1: 1, "Below A1": 0 };
        const allGrades = allPartSubEvals.flat().filter(Boolean).map((r) => evalGrade(parseEval(r!)));
        const avg = allGrades.length ? allGrades.reduce((s, g) => s + (gradeToNum[g] ?? 1), 0) / allGrades.length : 1;
        const overallGrade = avg >= 2.5 ? "B1" : avg >= 1.5 ? "A2" : "A1";
        const percentage = avg >= 2.5 ? 85 : avg >= 1.5 ? 65 : 45;

        const speakingParts = tasks.map((t, i) => {
          const subEvalsForPart = allPartSubEvals[i] ?? [];
          const firstEval = subEvalsForPart.find(Boolean) ?? "";
          const e = firstEval ? parseEval(firstEval) : null;
          // Derive sub-question labels for the transcript
          const subCount = subEvalsForPart.length;
          const subLabels = subCount > 1
            ? (t.partType === "read_aloud"
                ? subEvalsForPart.map((_, qi) => `Sentence ${qi + 1}`)
                : subEvalsForPart.map((_, qi) => `Q${qi + 1}`))
            : [t.partLabel ?? `Part ${i + 1}`];
          return {
            partNum: i + 1,
            partLabel: t.partLabel,
            partType: t.partType,
            instruction: t.instruction,
            prompt: t.prompt,
            evalText: firstEval,         // backward compat for transcript page
            subEvals: subEvalsForPart,   // all sub-question evals
            subLabels,                   // display labels per sub-question
            grade: e?.grade ?? "—",
            result: e?.result ?? "—",
            fluency: e?.fluency ?? "—",
            grammar: e?.grammar ?? "—",
            vocab: e?.vocab ?? "—",
            pronunciation: e?.pronunciation ?? "—",
            taskComp: e?.taskComp ?? "—",
            total: e?.total ?? "—",
            wellDone: e?.wellDone ?? [],
            errors: e?.errors ?? [],
            modelAnswer: e?.modelAnswer ?? "",
            teacherTip: e?.teacherTip ?? "",
          };
        });

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
              speakingParts,
            },
          },
        });
      } catch { /* non-critical */ }
    }
    setFinished(true);
  };

  // ── Guards ────────────────────────────────────────────────────────────────────
  if (limitChecking) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "4px solid #d1fae5", borderTopColor: "#059669", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (alreadyUsedToday) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎤</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Come Back Tomorrow</h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 300, marginBottom: 24 }}>
          You have already completed the speaking test for Set {setNum} today. You can practise again tomorrow.
        </p>
        <button
          onClick={() => router.push(`/test/${setId}`)}
          style={{ background: "linear-gradient(135deg, #064e3b, #059669)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
        >
          Back to Set {setNum}
        </button>
      </div>
    );
  }

  if (finished) {
    // Compute overall grade from all sub-evals across all parts
    const gradeToNum: Record<string, number> = { B1: 3, A2: 2, A1: 1, "Below A1": 0 };
    const allGrades = allPartSubEvals.flat().filter(Boolean).map((r) => evalGrade(parseEval(r!)));
    const avg = allGrades.length ? allGrades.reduce((s, g) => s + (gradeToNum[g] ?? 1), 0) / allGrades.length : 0;
    const overallGrade = avg >= 2.5 ? "B1" : avg >= 1.5 ? "A2" : "A1";
    const overallColor = gradeColor(overallGrade);
    const totalParts = tasks.length;
    const completedParts = allPartSubEvals.filter((p) => p.some(Boolean)).length;

    return (
      <div style={{ minHeight: "100dvh", background: "#f8fafc" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #064e3b, #059669)", padding: "20px 16px 28px" }}>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginBottom: 6 }}>Speaking · Set {setNum}</p>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Speaking Transcript</h2>
          {/* Overall summary */}
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 700, marginBottom: 4 }}>OVERALL GRADE</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{overallGrade}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 700, marginBottom: 4 }}>PARTS COMPLETED</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{completedParts}/{totalParts}</p>
            </div>
          </div>
          {/* Part completion dots */}
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            {tasks.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: allPartSubEvals[i]?.some(Boolean) ? "#86efac" : "rgba(255,255,255,0.3)" }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "16px 16px 32px" }}>
          {tasks.map((t, partIndex) => {
            const subEvalsForPart = allPartSubEvals[partIndex] ?? [];
            const hasAny = subEvalsForPart.some(Boolean);
            const subCount = subEvalsForPart.length;
            const subLabels = subCount > 1
              ? (t.partType === "read_aloud"
                  ? subEvalsForPart.map((_, i) => `Sentence ${i + 1}`)
                  : subEvalsForPart.map((_, i) => `Q${i + 1}`))
              : [t.partLabel ?? `Part ${partIndex + 1}`];

            return (
              <div key={t.id} style={{ marginBottom: 24 }}>
                {/* Part header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ background: hasAny ? "#064e3b" : "#94a3b8", borderRadius: 8, padding: "5px 12px" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>{t.partLabel?.toUpperCase()}</p>
                  </div>
                  {!hasAny && (
                    <p style={{ fontSize: 12, color: "#94a3b8" }}>Not submitted</p>
                  )}
                </div>

                {hasAny ? (
                  subEvalsForPart.map((evalText, qi) =>
                    evalText ? (
                      <EvalCard key={qi} label={subLabels[qi] ?? `Q${qi + 1}`} evalText={evalText} />
                    ) : (
                      <div key={qi} style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                        <p style={{ fontSize: 13, color: "#c2410c" }}>{subLabels[qi] ?? `Q${qi + 1}`} — evaluation unavailable</p>
                      </div>
                    )
                  )
                ) : (
                  <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e2e8f0", padding: 16, marginBottom: 8 }}>
                    <p style={{ fontSize: 13, color: "#64748b" }}>No recording submitted for this part.</p>
                  </div>
                )}
              </div>
            );
          })}

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

  // ── Part report screen (shown after all sub-questions of a part are done) ─────
  if (showPartReport) {
    const subLabels = totalSubs > 1
      ? (task?.partType === "read_aloud" ? subPrompts!.map((_, i) => `Sentence ${i + 1}`) : subPrompts!.map((_, i) => `Q${i + 1}`))
      : [`Part ${current + 1}`];
    const isLastPart = current >= tasks.length - 1;

    return (
      <div style={{ minHeight: "100dvh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "linear-gradient(135deg, #064e3b, #059669)", padding: "20px 16px 24px" }}>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginBottom: 4 }}>Speaking · Set {setNum}</p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{task?.partLabel} — Feedback</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 }}>
            {isLastPart ? "Last part — review and finish" : `Next: Part ${current + 2} of ${tasks.length}`}
          </p>
        </div>

        <div style={{ flex: 1, padding: "16px 16px 8px", overflowY: "auto" }}>
          {subEvals.map((evalText, i) =>
            evalText ? (
              <EvalCard key={i} label={subLabels[i] ?? `Q${i + 1}`} evalText={evalText} />
            ) : (
              <div key={i} style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: "#c2410c" }}>{subLabels[i] ?? `Q${i + 1}`} — evaluation unavailable</p>
              </div>
            )
          )}
        </div>

        <div style={{ padding: "12px 16px 28px", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
          {isLastPart ? (
            <button
              onClick={handleFinish}
              style={{ width: "100%", background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
            >
              Finish Speaking
            </button>
          ) : (
            <button
              onClick={handleNextPart}
              style={{ width: "100%", background: "linear-gradient(135deg, #064e3b, #059669)", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              Next Part <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Recording screen ──────────────────────────────────────────────────────────
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
        {/* Part progress bar */}
        <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
          {tasks.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: partResults[i] ? "#86efac" : i === current ? "#fff" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>
        {/* Part label */}
        <div style={{ background: "#064e3b", borderRadius: 8, padding: "6px 12px", display: "inline-block", marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>{task?.partLabel?.toUpperCase()}</p>
        </div>

        {/* Prep countdown */}
        {isPreparing && (
          <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, padding: 14, marginBottom: 14, textAlign: "center" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Preparation Time</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: "#92400e" }}>{prepCountdown}s</p>
            <p style={{ fontSize: 12, color: "#78350f" }}>Read the questions below. Press Start when ready.</p>
          </div>
        )}

        {/* Instruction */}
        <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#166534", marginBottom: 6 }}>INSTRUCTION</p>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{task?.instruction}</p>
        </div>

        {/* Part 4 graphic */}
        {task?.partType === "long_turn_graphic" && task.graphicUrl && (
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "8px 12px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#1e3a8a" }}>CHART / GRAPHIC</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={task.graphicUrl} alt={task.graphicAlt || "Speaking graphic"} style={{ width: "100%", display: "block" }} />
          </div>
        )}

        {/* Prompt / Sub-question */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1e3a8a" }}>
              {task?.partType === "read_aloud" ? "READ ALOUD" : task?.partType === "long_turn_graphic" ? "YOUR TASK" : "SPEAKING PROMPT"}
            </p>
            {totalSubs > 1 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", background: "#f1f5f9", borderRadius: 6, padding: "2px 8px" }}>
                {subIdx + 1} / {totalSubs}
              </span>
            )}
          </div>

          {/* Sub-question progress dots */}
          {totalSubs > 1 && (
            <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
              {Array.from({ length: totalSubs }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i < subIdx ? "#86efac" : i === subIdx ? "#1e3a8a" : "#e2e8f0", transition: "background 0.3s" }} />
              ))}
            </div>
          )}

          <p style={{ fontSize: task?.partType === "read_aloud" ? 18 : 14, color: "#1e293b", lineHeight: 1.8, fontWeight: task?.partType === "read_aloud" ? 700 : 500, whiteSpace: "pre-wrap" }}>
            {currentPrompt}
          </p>
          {task?.partType === "read_aloud" && (
            <p style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>💡 Pause at commas · Stop at full stops · Don't rush</p>
          )}
        </div>

        {/* Part 3 guiding points */}
        {task?.partType === "long_turn_topic" && task.guidingPoints && (
          <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", marginBottom: 8 }}>GUIDING POINTS — cover all three</p>
            {task.guidingPoints.map((pt, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#1e40af", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                <p style={{ fontSize: 13, color: "#1e3a8a", lineHeight: 1.5 }}>{pt}</p>
              </div>
            ))}
          </div>
        )}

        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
          Time: {Math.floor(timePerSub / 60)}:{String(timePerSub % 60).padStart(2, "0")} min per {totalSubs > 1 ? "question" : "recording"}
        </p>

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
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>Evaluating your answer…</p>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>AI examiner is reviewing your response</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
