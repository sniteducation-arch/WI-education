"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { Volume2 } from "lucide-react";
import {
  FULL_EXAM_SECTIONS,
  TOTAL_EXAM_MINUTES,
  calcExamScore,
  ExamSection,
  ExamPart,
  MCQQuestion,
  TextQuestion,
} from "@/lib/full-exam-data";

const H = "'Manrope', system-ui, sans-serif";

type Phase = "section_intro" | "testing" | "section_done" | "results";

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
    // Try next question
    if (qIdx < totalQInPart - 1) { setQIdx((i) => i + 1); return; }
    // Try next part
    if (partIdx < totalParts - 1) { setPartIdx((i) => i + 1); setQIdx(0); return; }
    // Section done
    advanceSection();
  };

  const goPrev = () => {
    setShowSampleAnswer(false);
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

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (phase === "results" && examScore) {
    const { correct, total, pct, cefr } = examScore;
    const cefrColor = cefr === "B1" ? "#16a34a" : cefr === "A2" ? "#d97706" : "#dc2626";
    const cefrBg = cefr === "B1" ? "#dcfce7" : cefr === "A2" ? "#fef3c7" : "#fee2e2";

    return (
      <div style={{ minHeight: "100dvh", background: "#f8f9fa" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0d2067, #1e3a8a)", padding: "28px 20px 32px", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 56, color: "#abf374", fontVariationSettings: "'FILL' 1", marginBottom: 10, display: "block" }}>
            task_alt
          </span>
          <h1 style={{ fontFamily: H, fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Exam Complete!</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>Here are your results</p>
        </div>

        <div style={{ padding: "20px 20px 100px" }}>
          {/* CEFR badge */}
          <div style={{ background: cefrBg, border: `2px solid ${cefrColor}`, borderRadius: 16, padding: 20, textAlign: "center", marginBottom: 16 }}>
            <p style={{ fontFamily: H, fontSize: 56, fontWeight: 800, color: cefrColor, lineHeight: 1 }}>{cefr}</p>
            <p style={{ fontSize: 14, color: cefrColor, fontWeight: 700, marginTop: 4 }}>CEFR Level</p>
            <p style={{ fontSize: 12, color: "#767682", marginTop: 4 }}>Based on Listening & Reading (auto-marked)</p>
          </div>

          {/* Score breakdown */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #c6c5d2", padding: 18, marginBottom: 16 }}>
            <p style={{ fontFamily: H, fontSize: 15, fontWeight: 700, color: "#0d2067", marginBottom: 14 }}>Auto-Marked Score</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: "#454651" }}>Correct answers</span>
              <span style={{ fontFamily: H, fontSize: 18, fontWeight: 800, color: "#0d2067" }}>{correct}/{total}</span>
            </div>
            <div style={{ background: "#f3f4f5", borderRadius: 8, height: 10, overflow: "hidden", marginBottom: 4 }}>
              <div style={{ height: "100%", borderRadius: 8, background: cefrColor, width: `${pct}%`, transition: "width 1s ease" }} />
            </div>
            <p style={{ fontSize: 12, color: "#767682", textAlign: "right" }}>{pct}%</p>
          </div>

          {/* Section results */}
          <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#191c1d", marginBottom: 10 }}>Section Summary</p>
          {FULL_EXAM_SECTIONS.map((sec) => {
            if (sec.id === "writing" || sec.id === "speaking") {
              return (
                <div key={sec.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: sec.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: sec.color }}>{sec.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: sec.color }}>{sec.title}</p>
                    <p style={{ fontSize: 12, color: "#767682" }}>Self-assessed — see model answers in review</p>
                  </div>
                  <span style={{ background: "#f3f4f5", borderRadius: 9999, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#767682" }}>REVIEWED</span>
                </div>
              );
            }
            let secCorrect = 0, secTotal = 0;
            sec.parts.forEach((p) => p.questions.forEach((q) => {
              if (q.type === "mcq") {
                secTotal += q.points;
                if (Number(answers[q.id]) === q.correct) secCorrect += q.points;
              }
            }));
            const secPct = secTotal > 0 ? Math.round((secCorrect / secTotal) * 100) : 0;
            return (
              <div key={sec.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: sec.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: sec.color }}>{sec.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: sec.color }}>{sec.title}</p>
                  <div style={{ background: "#f3f4f5", borderRadius: 4, height: 6, overflow: "hidden", marginTop: 4 }}>
                    <div style={{ height: "100%", borderRadius: 4, background: sec.color, width: `${secPct}%` }} />
                  </div>
                </div>
                <span style={{ fontFamily: H, fontSize: 15, fontWeight: 800, color: sec.color }}>{secCorrect}/{secTotal}</span>
              </div>
            );
          })}

          {/* CEFR guide */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #c6c5d2", padding: 16, marginBottom: 20, marginTop: 10 }}>
            <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#0d2067", marginBottom: 10 }}>CEFR Level Guide</p>
            {[
              { level: "B1", range: "86–100%", label: "Intermediate — Strong performance", color: "#16a34a", bg: "#dcfce7" },
              { level: "A2", range: "60–85%", label: "Elementary — Good foundation", color: "#d97706", bg: "#fef3c7" },
              { level: "A1", range: "0–59%", label: "Beginner — Keep practising", color: "#dc2626", bg: "#fee2e2" },
            ].map((row) => (
              <div key={row.level} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, opacity: row.level === cefr ? 1 : 0.5 }}>
                <span style={{ background: row.bg, color: row.color, borderRadius: 6, padding: "3px 10px", fontSize: 13, fontWeight: 800, fontFamily: H, minWidth: 32, textAlign: "center" }}>{row.level}</span>
                <span style={{ fontSize: 12, color: "#454651" }}>{row.range} — {row.label}</span>
                {row.level === cefr && <span className="material-symbols-outlined" style={{ fontSize: 16, color: row.color, marginLeft: "auto" }}>arrow_back</span>}
              </div>
            ))}
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
  const q = question as MCQQuestion;
  const tq = question as TextQuestion;

  const sectionPct = Math.round(((section.durationMinutes * 60 - sectionSecs) / (section.durationMinutes * 60)) * 100);
  const globalPct = Math.round(((TOTAL_EXAM_MINUTES * 60 - globalSecs) / (TOTAL_EXAM_MINUTES * 60)) * 100);
  const isTimeLow = sectionSecs < 120;

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

        {/* Audio player for listening section */}
        {section.id === "listening" && isMCQ && (() => {
          const audioUrl = q.audioUrl ?? part.audioUrl;
          if (!audioUrl) return null;
          const isPerQuestion = !!q.audioUrl;
          return (
            <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Volume2 size={16} color="#92400e" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>
                  {isPerQuestion ? `${q.contextLabel || `Conversation ${qIdx + 1}`} — Listen` : `${part.title} — Listen`}
                </span>
              </div>
              <audio
                key={audioUrl}
                controls
                style={{ width: "100%", borderRadius: 8, outline: "none" }}
              >
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support audio.
              </audio>
            </div>
          );
        })()}

        {/* Context (passage / transcript) */}
        {isMCQ && q.context && q.context !== "Same transcript as above." && q.context !== "Same email." && q.context !== "Same article." && q.context !== "Same telephone message." && q.context !== "Same training transcript." && q.context !== "Same interview." && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: 14, marginBottom: 14 }}>
            {q.contextLabel && <p style={{ fontSize: 11, fontWeight: 700, color: "#767682", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{q.contextLabel}</p>}
            <p style={{ fontSize: 13, color: "#191c1d", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{q.context}</p>
          </div>
        )}
        {isMCQ && q.contextLabel && q.contextLabel !== "" && (q.context === "Same transcript as above." || q.context === "Same email." || q.context === "Same article." || q.context === "Same telephone message." || q.context === "Same training transcript." || q.context === "Same interview.") && (
          <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "8px 12px", marginBottom: 12, border: "1px dashed #c6c5d2" }}>
            <p style={{ fontSize: 12, color: "#767682" }}>
              {section.id === "listening" ? "🔊 Refer to the audio above for this question." : "↑ Refer to the passage above for this question."}
            </p>
          </div>
        )}

        {/* Question */}
        <div style={{ background: section.bg, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: section.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Question {qIdx + 1}
          </p>
          <p style={{ fontFamily: H, fontSize: 16, fontWeight: 600, color: "#191c1d", lineHeight: 1.5 }}>
            {isMCQ ? q.question : tq.prompt}
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

        {/* Text input */}
        {isText && (
          <div>
            <p style={{ fontSize: 12, color: "#767682", marginBottom: 8 }}>{tq.instructions}</p>
            <textarea
              value={(currentAnswer as string) || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here…"
              rows={8}
              style={{ width: "100%", border: "2px solid #c6c5d2", borderRadius: 12, padding: "14px", fontSize: 14, color: "#191c1d", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <p style={{ fontSize: 12, color: "#767682" }}>
                Words: {wordCount((currentAnswer as string) || "")}
                {tq.minWords > 0 && ` / min ${tq.minWords}`}
              </p>
              <p style={{ fontSize: 12, color: "#767682" }}>
                Time: {fmt(tq.timeSeconds)}
              </p>
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
        )}
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
