"use client";
import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { testSets } from "@/lib/questions";
import { ArrowLeft, Clock } from "lucide-react";

const TOTAL_TIME = 30 * 60;

// ── Evaluation parser ─────────────────────────────────────────────────────────
function parseEval(text: string) {
  const grade = text.match(/GRADE:\s*(.+)/)?.[1]?.trim() ?? "—";
  const result = text.match(/RESULT:\s*(.+)/)?.[1]?.trim() ?? "—";
  const taskScore = text.match(/Task Completion:\s*(.+)/)?.[1]?.trim() ?? "—";
  const grammarScore = text.match(/Grammar:\s*(.+)/)?.[1]?.trim() ?? "—";
  const vocabScore = text.match(/Vocabulary:\s*(.+)/)?.[1]?.trim() ?? "—";
  const clarityScore = text.match(/Clarity:\s*(.+)/)?.[1]?.trim() ?? "—";
  const totalScore = text.match(/Total:\s*(.+)/)?.[1]?.trim() ?? "—";

  const wellDoneBlock = text.match(/WHAT THEY DID WELL:\n([\s\S]*?)(?=\nERRORS TO FIX:|$)/)?.[1] ?? "";
  const wellDone = wellDoneBlock.match(/^- .+$/gm)?.map((s) => s.slice(2)) ?? [];

  const errorsBlock = text.match(/ERRORS TO FIX:\n([\s\S]*?)(?=\n⭐|$)/)?.[1] ?? "";
  const errors = errorsBlock.match(/^- .+$/gm)?.map((s) => s.slice(2)) ?? [];

  const modelAnswer = text.match(/⭐ PERFECT MODEL ANSWER:\n([\s\S]*?)(?=\nTEACHER TIP:|$)/)?.[1]?.trim() ?? "";
  const teacherTip = text.match(/TEACHER TIP:\n?([\s\S]*?)$/)?.[1]?.trim() ?? "";

  return { grade, result, taskScore, grammarScore, vocabScore, clarityScore, totalScore, wellDone, errors, modelAnswer, teacherTip };
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
      {/* Header */}
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
        {/* Scores */}
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 8 }}>SCORES</p>
          {[
            { label: "Task Completion", val: e.taskScore },
            { label: "Grammar", val: e.grammarScore },
            { label: "Vocabulary", val: e.vocabScore },
            { label: "Clarity", val: e.clarityScore },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "#374151" }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{s.val}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Total</span>
            <span style={{ fontSize: 14, fontWeight: 800, color }}>{e.totalScore}</span>
          </div>
        </div>

        {/* What they did well */}
        {e.wellDone.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>✓ WHAT YOU DID WELL</p>
            {e.wellDone.map((pt, i) => (
              <p key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4, paddingLeft: 12 }}>• {pt}</p>
            ))}
          </div>
        )}

        {/* Errors to fix */}
        {e.errors.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>✗ ERRORS TO FIX</p>
            {e.errors.map((pt, i) => (
              <p key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4, paddingLeft: 12, fontFamily: "monospace" }}>• {pt}</p>
            ))}
          </div>
        )}

        {/* Model answer */}
        {e.modelAnswer && (
          <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 10, padding: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 6 }}>⭐ PERFECT MODEL ANSWER</p>
            <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{e.modelAnswer}</p>
          </div>
        )}

        {/* Teacher tip */}
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
export default function WritingPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = use(params);
  const router = useRouter();
  const setNum = parseInt(setId);
  const prompts = testSets[setNum]?.writing || [];

  const { user, authLoading } = useAuth();
  const [uid, setUid] = useState("");
  const [part, setPart] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", ""]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [aiResults, setAiResults] = useState<(string | null)[]>([null, null]);
  const [showTips, setShowTips] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const uidRef = useRef("");
  const handleSubmitRef = useRef<() => void>(() => {});
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setUid(user.uid);
    uidRef.current = user.uid;
  }, [authLoading, user, router]);

  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      clearInterval(timerRef.current);
      handleSubmitRef.current();
    }
  }, [timeLeft]);

  const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    setSubmitted(true);
    setEvaluating(true);

    try {
      const evals = await Promise.all(
        prompts.map((p, i) =>
          fetch("/api/writing/evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              situation: p.situation,
              task: p.task,
              answer: answers[i] || "",
              wordLimit: p.wordLimit,
              partType: i === 0 ? "personal_email" : "formal_reply",
            }),
          })
            .then((r) => r.json())
            .then((d) => d.evaluation ?? null)
            .catch(() => null)
        )
      );
      setAiResults(evals);

      // Save to Firebase — grade + full per-part breakdown for transcript
      const currentUid = uidRef.current || uid;
      if (currentUid) {
        try {
          const mainEval = evals[1] ?? evals[0];
          const grade = mainEval ? (parseEval(mainEval).grade) : "A1";
          const gradeToPercent: Record<string, number> = { B1: 85, A2: 65, A1: 45, "Below A1": 25 };
          const percentage = gradeToPercent[grade] ?? 50;

          const writingParts = prompts.map((p, i) => {
            const evalText = evals[i] ?? "";
            const e = evalText ? parseEval(evalText) : null;
            return {
              partNum: i + 1,
              situation: p.situation,
              task: p.task,
              wordLimit: p.wordLimit,
              studentAnswer: answers[i] || "",
              evalText,
              ...(e || { grade: "—", result: "—" }),
            };
          });

          const ref = doc(db, "users", currentUid);
          const snap = await getDoc(ref);
          const existing = snap.data()?.progress || {};
          await updateDoc(ref, {
            progress: {
              ...existing,
              [`set${setNum}`]: {
                ...(existing[`set${setNum}`] || {}),
                writing: percentage,
                writingGrade: grade,
                writingParts,
              },
            },
          });
        } catch { /* non-critical */ }
      }
    } finally {
      setEvaluating(false);
    }
  };

  // Keep handleSubmitRef current so the auto-submit effect always calls the latest version
  useEffect(() => { handleSubmitRef.current = handleSubmit; });

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const current = prompts[part];
  const wc = countWords(answers[part] || "");

  // ── Evaluating screen ──
  if (submitted && evaluating) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 16 }}>
        <div style={{ width: 48, height: 48, border: "4px solid #ddd6fe", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Evaluating your writing…</p>
        <p style={{ fontSize: 13, color: "#64748b" }}>Our AI examiner is reviewing both parts.</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Result screen ──
  if (submitted && !evaluating) {
    const hasResults = aiResults.some((r) => r !== null);
    return (
      <div style={{ minHeight: "100dvh", background: "#f8fafc" }}>
        <div style={{ background: "linear-gradient(135deg, #4c1d95, #7c3aed)", padding: "20px 16px 24px" }}>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginBottom: 4 }}>Writing · Set {setNum}</p>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
            {hasResults ? "AI Examiner Feedback" : "Writing Complete"}
          </h2>
        </div>

        <div style={{ padding: "16px 16px 32px" }}>
          {hasResults ? (
            prompts.map((p, i) =>
              aiResults[i] ? (
                <EvalCard key={p.id} partNum={i + 1} evalText={aiResults[i]!} />
              ) : (
                <div key={p.id} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 16, marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>Part {i + 1} — evaluation unavailable</p>
                  <p style={{ fontSize: 13, color: "#374151", marginTop: 8, whiteSpace: "pre-wrap" }}>{answers[i] || "(No answer)"}</p>
                </div>
              )
            )
          ) : (
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: 20, marginBottom: 16, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#64748b" }}>AI evaluation unavailable. Check your GEMINI_API_KEY in .env.local.</p>
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

  const isPersonal = part === 0;
  const partLabel = isPersonal ? "Personal Email" : "Formal Reply";
  const partIcon = isPersonal ? "✉" : "📝";
  const partHint = isPersonal
    ? "Write to a friend, family member, or colleague. Use a friendly greeting (Hi [Name],) and a warm sign-off."
    : "Write a formal text — to an employer, business, or organisation. Use a formal greeting (Dear [Name/Title],) and a professional tone.";

  // ── Writing screen ──
  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #4c1d95, #7c3aed)", padding: "16px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={() => router.push(`/test/${setId}`)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#fff", fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px" }}>
            <Clock size={14} color="#fff" />
            <span style={{ color: timeLeft < 300 ? "#fca5a5" : "#fff", fontWeight: 700, fontSize: 15 }}>{mm}:{ss}</span>
          </div>
        </div>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Writing · Set {setNum}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, marginBottom: 10 }}>
          <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 10px", letterSpacing: "0.04em" }}>
            {partIcon} PART {part + 1} — {partLabel.toUpperCase()}
          </span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>~15 min · 50+ words</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {prompts.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= part ? "#fff" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </div>

      {/* Situation + Task — always visible */}
      <div style={{ padding: "12px 16px", background: "#faf8ff", borderBottom: "1.5px solid #ede9fe", flexShrink: 0 }}>
        <div style={{ background: "#f5f3ff", border: "1.5px solid #ddd6fe", borderRadius: 12, padding: "10px 14px", marginBottom: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", marginBottom: 3, letterSpacing: "0.06em" }}>SITUATION</p>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{current?.situation}</p>
        </div>
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "10px 14px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#1e3a8a", marginBottom: 3, letterSpacing: "0.06em" }}>YOUR TASK</p>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{current?.task}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#7c3aed", fontWeight: 700, background: "#f3e8ff", borderRadius: 6, padding: "2px 8px" }}>
              {partIcon} {partLabel}
            </span>
            <span style={{ fontSize: 11, color: "#64748b" }}>Write at least {current?.wordLimit} words</span>
          </div>
        </div>

        {/* Part tone hint */}
        <div style={{ marginTop: 8, background: isPersonal ? "#f0fdf4" : "#eff6ff", border: `1px solid ${isPersonal ? "#bbf7d0" : "#bfdbfe"}`, borderRadius: 10, padding: "8px 12px" }}>
          <p style={{ fontSize: 12, color: isPersonal ? "#166534" : "#1e40af", lineHeight: 1.5 }}>
            <strong>Tone:</strong> {partHint}
          </p>
        </div>
      </div>

      {/* Write area — scrollable */}
      <div style={{ flex: 1, padding: "12px 16px 16px", overflowY: "auto" }}>

        {/* Collapsible tips */}
        <button
          onClick={() => setShowTips((v) => !v)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#7c3aed", fontSize: 12, fontWeight: 700, padding: 0, marginBottom: 10 }}
        >
          <span style={{ fontSize: 14 }}>{showTips ? "▲" : "▼"}</span>
          {showTips ? "Hide writing tips" : "Show writing tips"}
        </button>

        {showTips && (
          <div style={{ background: "#faf8ff", border: "1.5px solid #ddd6fe", borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#4c1d95", marginBottom: 8 }}>5 RULES THAT ALWAYS APPLY</p>
            {[
              "Address every point — most tasks ask you to cover three things. Write at least one sentence for each.",
              "Write at least 50 words — the counter below tracks this in real time.",
              "Keep sentences simple — a correct simple sentence beats a complicated one full of mistakes.",
              "Use linking words — and, but, because, also, first, second, then.",
              "Check spelling and grammar before you submit — a quick re-read is worth it.",
            ].map((tip, i) => (
              <p key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, marginBottom: 4, paddingLeft: 10 }}>• {tip}</p>
            ))}
            <p style={{ fontSize: 12, fontWeight: 700, color: "#4c1d95", marginTop: 10, marginBottom: 6 }}>RELIABLE EMAIL STRUCTURE</p>
            {['Greeting — "Hi Mona," / "Dear Hiring Manager,"', "Reason for writing — one short opening sentence.", "The required points — one or two sentences each.", 'Closing line — "See you soon!" / "I look forward to hearing from you."', "Sign-off — your name."].map((s, i) => (
              <p key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, paddingLeft: 10 }}>{i + 1}. {s}</p>
            ))}
          </div>
        )}

        <div style={{ position: "relative" }}>
          <textarea
            value={answers[part]}
            onChange={(e) => {
              const updated = [...answers];
              updated[part] = e.target.value;
              setAnswers(updated);
            }}
            placeholder={isPersonal
              ? "Hi [Name],\n\nI am writing to…\n\n[Your name]"
              : "Dear [Name/Hiring Manager],\n\nI am writing to…\n\nYours sincerely,\n[Your name]"}
            rows={9}
            style={{ width: "100%", background: "#fff", border: `2px solid ${wc >= 50 ? "#a3e635" : "#e2e8f0"}`, borderRadius: 14, padding: "14px 14px 44px", fontSize: 15, color: "#1e293b", outline: "none", resize: "none", lineHeight: 1.7, fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" }}
          />
          <div style={{ position: "absolute", bottom: 10, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: wc < 50 ? "#dc2626" : "#16a34a", fontWeight: 700 }}>
              {wc < 50 ? `${50 - wc} more word${50 - wc !== 1 ? "s" : ""} needed` : "Word count met ✓"}
            </span>
            <span style={{ fontSize: 12, color: wc >= (current?.wordLimit || 50) ? "#16a34a" : "#94a3b8", fontWeight: 700 }}>
              {wc} / {current?.wordLimit} words
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {part > 0 && (
            <button onClick={() => setPart(0)} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              ← Part 1
            </button>
          )}
          {part < prompts.length - 1 ? (
            <button onClick={() => setPart(1)} style={{ flex: 2, background: "linear-gradient(135deg, #4c1d95, #7c3aed)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Next → Formal Reply
            </button>
          ) : (
            <button onClick={handleSubmit} style={{ flex: 2, background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Submit Writing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
