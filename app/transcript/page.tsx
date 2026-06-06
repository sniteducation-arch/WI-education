"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/components/AuthProvider";

const H = "'Manrope', system-ui, sans-serif";

/* ── Types ──────────────────────────────────────────────── */
interface QuestionResult {
  id: string; part?: number; question: string; passage?: string; type: string;
  options?: string[]; userAnswer: string; correctAnswer: string; correct: boolean;
  pointsEarned: number; pointsMax: number; transcript?: string;
}
interface WritingPart {
  partNum: number; situation: string; task: string; wordLimit?: number;
  studentAnswer: string; evalText: string;
  grade?: string; result?: string; taskScore?: string; grammarScore?: string;
  vocabScore?: string; clarityScore?: string; totalScore?: string;
  wellDone?: string[]; errors?: string[]; modelAnswer?: string; teacherTip?: string;
}
interface SpeakingPart {
  partNum: number; partLabel?: string; partType?: string;
  instruction: string; prompt: string; evalText: string;
  subEvals?: (string | null)[]; subLabels?: string[];
  grade?: string; result?: string; fluency?: string; grammar?: string;
  vocab?: string; pronunciation?: string; taskComp?: string; total?: string;
  wellDone?: string[]; errors?: string[]; modelAnswer?: string; teacherTip?: string;
}
interface SetProgress {
  reading?: number; readingGrade?: string; readingQuestions?: QuestionResult[];
  writing?: number; writingGrade?: string; writingParts?: WritingPart[];
  listening?: number; listeningGrade?: string; listeningQuestions?: QuestionResult[];
  speaking?: number; speakingGrade?: string; speakingParts?: SpeakingPart[];
}

/* ── Helpers ────────────────────────────────────────────── */
const gradeColor = (g?: string) => g === "B1" ? "#346b00" : g === "A2" ? "#92400e" : "#dc2626";
const gradeBg    = (g?: string) => g === "B1" ? "#dcfce7" : g === "A2" ? "#fef3c7" : "#fee2e2";
const pctToGrade = (p?: number) => p === undefined ? "—" : p >= 80 ? "B1" : p >= 50 ? "A2" : "A1";

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1.5px solid ${color}30`, borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", background: `${color}10`, border: "none", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
      >
        <span style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color }}>{title}</span>
        <span style={{ fontSize: 18, color, lineHeight: 1 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div style={{ padding: "12px 14px 16px", background: "#fff" }}>{children}</div>}
    </div>
  );
}

/* ── AI eval section card ────────────────────────────────── */
function EvalSection({ part, label, color }: { part: WritingPart | SpeakingPart; label: string; color: string }) {
  const hasEval = !!part.evalText;
  const isSpeaking = "fluency" in part;
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
      {/* Part header */}
      <div style={{ background: `${color}12`, borderBottom: `1.5px solid ${color}25`, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 2 }}>{label}</p>
          {part.grade && part.grade !== "—" && (
            <p style={{ fontFamily: H, fontSize: 16, fontWeight: 800, color: gradeColor(part.grade) }}>Grade {part.grade}</p>
          )}
        </div>
        {part.result && part.result !== "—" && (
          <span style={{ background: part.result === "PASS" ? "#dcfce7" : "#fee2e2", color: part.result === "PASS" ? "#16a34a" : "#dc2626", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 9999 }}>
            {part.result}
          </span>
        )}
      </div>

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Prompt/situation */}
        {"situation" in part && part.situation && (
          <div style={{ background: "#f5f3ff", borderRadius: 8, padding: "8px 10px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", marginBottom: 4 }}>SITUATION</p>
            <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{part.situation}</p>
          </div>
        )}
        {"instruction" in part && part.instruction && (
          <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 10px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#166534", marginBottom: 4 }}>INSTRUCTION</p>
            <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{part.instruction}</p>
          </div>
        )}
        {"prompt" in part && part.prompt && (
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#1e3a8a", marginBottom: 4 }}>PROMPT</p>
            <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{part.prompt}</p>
          </div>
        )}

        {/* Student answer (writing only) */}
        {"studentAnswer" in part && part.studentAnswer && (
          <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8, padding: "8px 10px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>YOUR ANSWER</p>
            <p style={{ fontSize: 12, color: "#1e293b", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{part.studentAnswer}</p>
          </div>
        )}

        {!hasEval && (
          <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No AI evaluation recorded for this part.</p>
        )}

        {hasEval && (
          <>
            {/* Scores */}
            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 10px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>SCORES</p>
              {isSpeaking ? (
                [["Fluency", (part as SpeakingPart).fluency], ["Grammar", (part as SpeakingPart).grammar], ["Vocabulary", (part as SpeakingPart).vocab], ["Pronunciation", (part as SpeakingPart).pronunciation], ["Task Completion", (part as SpeakingPart).taskComp]].map(([l, v]) => v && v !== "—" ? (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: "#374151" }}>{l}</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{v}</span>
                  </div>
                ) : null)
              ) : (
                [["Task Completion", (part as WritingPart).taskScore], ["Grammar", (part as WritingPart).grammarScore], ["Vocabulary", (part as WritingPart).vocabScore], ["Clarity", (part as WritingPart).clarityScore]].map(([l, v]) => v && v !== "—" ? (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: "#374151" }}>{l}</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{v}</span>
                  </div>
                ) : null)
              )}
              {(isSpeaking ? (part as SpeakingPart).total : (part as WritingPart).totalScore) && (
                <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 4, paddingTop: 4, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: gradeColor(part.grade) }}>{isSpeaking ? (part as SpeakingPart).total : (part as WritingPart).totalScore}</span>
                </div>
              )}
            </div>

            {part.wellDone && part.wellDone.length > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>✓ WHAT YOU DID WELL</p>
                {part.wellDone.map((pt, i) => <p key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 3, paddingLeft: 10 }}>• {pt}</p>)}
              </div>
            )}

            {part.errors && part.errors.length > 0 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>✗ ERRORS TO FIX</p>
                {part.errors.map((pt, i) => <p key={i} style={{ fontSize: 12, color: "#374151", marginBottom: 3, paddingLeft: 10, fontFamily: "monospace" }}>• {pt}</p>)}
              </div>
            )}

            {part.modelAnswer && (
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 10px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>⭐ PERFECT MODEL ANSWER</p>
                <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{part.modelAnswer}</p>
              </div>
            )}

            {part.teacherTip && (
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "8px 10px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#1e40af", marginBottom: 4 }}>💡 TEACHER TIP</p>
                <p style={{ fontSize: 12, color: "#1e3a8a", lineHeight: 1.5 }}>{part.teacherTip}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Speaking part card (supports multi sub-eval) ──────────── */
function parseEvalT(text: string) {
  const get = (re: RegExp) => text.match(re)?.[1]?.trim() ?? "—";
  const grade = get(/GRADE:\s*(.+)/);
  const result = get(/RESULT:\s*(.+)/);
  const fluency = get(/Fluency:\s*(.+)/);
  const grammar = get(/Grammar:\s*(.+)/);
  const vocab = get(/Vocabulary:\s*(.+)/);
  const pronunciation = get(/Pronunciation:\s*(.+)/);
  const taskComp = get(/Task Completion:\s*(.+)/);
  const wellDoneBlock = text.match(/WHAT THEY DID WELL:\n([\s\S]*?)(?=\nERRORS TO FIX:|$)/)?.[1] ?? "";
  const wellDone = wellDoneBlock.match(/^- .+$/gm)?.map((s) => s.slice(2)) ?? [];
  const errorsBlock = text.match(/ERRORS TO FIX:\n([\s\S]*?)(?=\n⭐|$)/)?.[1] ?? "";
  const errors = errorsBlock.match(/^- .+$/gm)?.map((s) => s.slice(2)) ?? [];
  const modelAnswer = text.match(/⭐ PERFECT MODEL ANSWER:\n([\s\S]*?)(?=\nTEACHER TIP:|$)/)?.[1]?.trim() ?? "";
  const teacherTip = text.match(/TEACHER TIP:\n?([\s\S]*?)$/)?.[1]?.trim() ?? "";
  // Fair total from available scores
  const raw = [fluency, grammar, vocab, pronunciation, taskComp];
  const avail = raw.filter((v) => v !== "—");
  const fairTotal = avail.length ? Math.round(avail.reduce((s, v) => s + (parseInt(v) || 0), 0) / (avail.length * 5) * 25) : 0;
  return { grade, result, fluency, grammar, vocab, pronunciation, taskComp, wellDone, errors, modelAnswer, teacherTip, fairTotal };
}

function SubEvalCard({ label, evalText, color }: { label: string; evalText: string; color: string }) {
  const e = parseEvalT(evalText);
  const gc = gradeColor(e.grade);
  return (
    <div style={{ border: `1px solid ${gc}30`, borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
      <div style={{ background: `${gc}12`, borderBottom: `1px solid ${gc}25`, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 1 }}>{label}</p>
          {e.grade !== "—" && <p style={{ fontSize: 14, fontWeight: 800, color: gc }}>Grade {e.grade}</p>}
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: gc }}>{e.fairTotal}/25</span>
      </div>
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* How you should answer — first and prominent */}
        {e.modelAnswer && (
          <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #86efac", borderRadius: 8, padding: "8px 10px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#166534", marginBottom: 4 }}>💬 HOW YOU SHOULD ANSWER</p>
            <p style={{ fontSize: 12, color: "#14532d", lineHeight: 1.7, whiteSpace: "pre-wrap", fontStyle: "italic" }}>{e.modelAnswer}</p>
          </div>
        )}
        {/* Scores */}
        <div style={{ background: "#f8fafc", borderRadius: 6, padding: "6px 8px" }}>
          {[["Fluency", e.fluency], ["Grammar", e.grammar], ["Vocabulary", e.vocab], ["Pronunciation", e.pronunciation], ["Task Completion", e.taskComp]].filter(([, v]) => v !== "—").map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: 11, color: "#374151" }}>{l}</span>
              <span style={{ fontSize: 11, fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
        {e.wellDone.length > 0 && <div><p style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", marginBottom: 3 }}>✓ WELL DONE</p>{e.wellDone.map((pt, i) => <p key={i} style={{ fontSize: 11, color: "#374151", paddingLeft: 8, marginBottom: 2 }}>• {pt}</p>)}</div>}
        {e.errors.length > 0 && <div><p style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", marginBottom: 3 }}>✗ ERRORS TO FIX</p>{e.errors.map((pt, i) => <p key={i} style={{ fontSize: 11, color: "#374151", paddingLeft: 8, marginBottom: 2, fontFamily: "monospace" }}>• {pt}</p>)}</div>}
        {e.teacherTip && <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "6px 8px" }}><p style={{ fontSize: 10, fontWeight: 700, color: "#1e40af", marginBottom: 3 }}>💡 TEACHER TIP</p><p style={{ fontSize: 11, color: "#1e3a8a", lineHeight: 1.5 }}>{e.teacherTip}</p></div>}
      </div>
    </div>
  );
}

function SpeakingPartCard({ sp, color }: { sp: SpeakingPart; color: string }) {
  const hasSubEvals = sp.subEvals && sp.subEvals.some(Boolean);
  const label = sp.partLabel ?? `Part ${sp.partNum}`;

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
      {/* Part header */}
      <div style={{ background: `${color}10`, borderBottom: `1px solid ${color}20`, padding: "10px 12px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 11, color: "#64748b" }}>{sp.instruction}</p>
      </div>
      <div style={{ padding: "10px 12px" }}>
        {hasSubEvals ? (
          sp.subEvals!.map((evalText, qi) =>
            evalText ? (
              <SubEvalCard
                key={qi}
                label={sp.subLabels?.[qi] ?? (sp.subEvals!.length > 1 ? `Q${qi + 1}` : label)}
                evalText={evalText}
                color={color}
              />
            ) : (
              <div key={qi} style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: 10, marginBottom: 8 }}>
                <p style={{ fontSize: 11, color: "#c2410c" }}>{sp.subLabels?.[qi] ?? `Q${qi + 1}`} — evaluation unavailable</p>
              </div>
            )
          )
        ) : sp.evalText ? (
          <SubEvalCard label={label} evalText={sp.evalText} color={color} />
        ) : (
          <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>No AI evaluation recorded for this part.</p>
        )}
      </div>
    </div>
  );
}

/* ── Q&A result row ──────────────────────────────────────── */
function QRow({ q, idx }: { q: QuestionResult; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1.5px solid ${q.correct ? "#bbf7d0" : "#fecaca"}`, borderRadius: 8, marginBottom: 6, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: "100%", background: q.correct ? "#f0fdf4" : "#fff1f2", border: "none", padding: "8px 12px", display: "flex", gap: 10, alignItems: "center", cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ fontSize: 14, flexShrink: 0 }}>{q.correct ? "✅" : "❌"}</span>
        <span style={{ fontSize: 12, color: "#1e293b", flex: 1, lineHeight: 1.4 }}>Q{idx + 1}: {q.question}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: q.correct ? "#16a34a" : "#dc2626", flexShrink: 0 }}>{q.pointsEarned}/{q.pointsMax}</span>
      </button>
      {open && (
        <div style={{ padding: "8px 12px 10px", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
          {q.passage && <p style={{ fontSize: 11, color: "#64748b", marginBottom: 6, fontStyle: "italic", lineHeight: 1.5 }}>{q.passage}</p>}
          {q.transcript && <p style={{ fontSize: 11, color: "#64748b", marginBottom: 6, fontStyle: "italic", lineHeight: 1.5 }}>🎧 {q.transcript}</p>}
          {q.options && q.options.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              {q.options.map((o) => (
                <p key={o} style={{ fontSize: 12, color: o === q.correctAnswer ? "#16a34a" : o === q.userAnswer && !q.correct ? "#dc2626" : "#64748b", fontWeight: o === q.correctAnswer || (o === q.userAnswer && !q.correct) ? 700 : 400, marginBottom: 2, paddingLeft: 8 }}>
                  {o === q.correctAnswer ? "✓" : o === q.userAnswer && !q.correct ? "✗" : "○"} {o}
                </p>
              ))}
            </div>
          )}
          <p style={{ fontSize: 11, color: "#374151" }}>Your answer: <strong style={{ color: q.correct ? "#16a34a" : "#dc2626" }}>{q.userAnswer}</strong></p>
          {!q.correct && <p style={{ fontSize: 11, color: "#16a34a", marginTop: 2 }}>Correct answer: <strong>{q.correctAnswer}</strong></p>}
        </div>
      )}
    </div>
  );
}

/* ── Consolidated insights ──────────────────────────────── */
function Insights({ progress }: { progress: Record<string, SetProgress> }) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const tips: string[] = [];

  for (let s = 1; s <= 7; s++) {
    const p = progress[`set${s}`];
    if (!p) continue;
    // Collect AI tips from speaking (supports both old evalText and new subEvals)
    p.speakingParts?.forEach((sp) => {
      const evalsToScan = sp.subEvals?.filter(Boolean) as string[] ?? (sp.evalText ? [sp.evalText] : []);
      evalsToScan.forEach((et) => {
        const e = parseEvalT(et);
        e.wellDone.forEach((w) => strengths.push(w));
        e.errors.forEach((er) => weaknesses.push(er));
        if (e.teacherTip && e.teacherTip !== "—") tips.push(e.teacherTip);
      });
    });
    // Collect AI tips from writing
    p.writingParts?.forEach((wp) => {
      if (wp.teacherTip) tips.push(wp.teacherTip);
      wp.wellDone?.forEach((w) => strengths.push(w));
      wp.errors?.forEach((e) => weaknesses.push(e));
    });
  }

  if (!strengths.length && !weaknesses.length && !tips.length) return null;

  // Deduplicate roughly (take first 5 of each)
  const uniq = (arr: string[]) => [...new Set(arr)].slice(0, 5);

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #c6c5d2", padding: 16, marginBottom: 20 }}>
      <h3 style={{ fontFamily: H, fontSize: 16, fontWeight: 700, color: "#0d2067", marginBottom: 14 }}>Consolidated Insights</h3>
      {uniq(strengths).length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>✓ YOUR STRENGTHS</p>
          {uniq(strengths).map((s, i) => <p key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4, paddingLeft: 10 }}>• {s}</p>)}
        </div>
      )}
      {uniq(weaknesses).length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>✗ AREAS TO IMPROVE</p>
          {uniq(weaknesses).map((w, i) => <p key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4, paddingLeft: 10, fontFamily: "monospace" }}>• {w}</p>)}
        </div>
      )}
      {uniq(tips).length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", marginBottom: 6 }}>💡 TEACHER TIPS TO DRILL</p>
          {uniq(tips).map((t, i) => <p key={i} style={{ fontSize: 13, color: "#1e3a8a", marginBottom: 4, paddingLeft: 10, lineHeight: 1.5 }}>• {t}</p>)}
        </div>
      )}
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────── */
export default function TranscriptPage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [progress, setProgress] = useState<Record<string, SetProgress>>({});
  const [loading, setLoading] = useState(true);
  const [date] = useState(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setName(user.displayName || "Student");
    setEmail(user.email || "");
    (async () => {
      try {
        const token = await getIdToken(user);
        const res = await fetch(`/api/user/me?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          setProgress(data.progress || {});
          if (data.name) setName(data.name);
        }
      } catch { /* non-critical */ }
      setLoading(false);
    })();
  }, [authLoading, user, router]);

  if (loading) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "4px solid #dde1ff", borderTopColor: "#0d2067", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const sets = Array.from({ length: 7 }, (_, i) => i + 1);
  const allScores: number[] = [];
  sets.forEach((s) => {
    const p = progress[`set${s}`] || {};
    if (p.reading !== undefined) allScores.push(p.reading);
    if (p.writing !== undefined) allScores.push(p.writing);
    if (p.listening !== undefined) allScores.push(p.listening);
    if (p.speaking !== undefined) allScores.push(p.speaking);
  });
  const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null;
  const overallGrade = avgScore !== null ? pctToGrade(avgScore) : null;

  const setLabels: Record<number, string> = {
    1: "Academic Proficiency", 2: "Core Vocabulary", 3: "Grammar & Syntax",
    4: "Listening Mastery", 5: "Care Communication", 6: "Public Speaking", 7: "Final Mock Test",
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#f8f9fa" }}>
      <TopBar title="Transcript" />
      <main style={{ paddingTop: 80, paddingBottom: 100, paddingLeft: 16, paddingRight: 16 }}>

        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: H, fontSize: 28, fontWeight: 700, color: "#0d2067", letterSpacing: "-0.02em", marginBottom: 4 }}>Score Transcript</h2>
          <p style={{ fontSize: 13, color: "#454651" }}>WI Upskill Mock Test · {date}</p>
        </div>

        {/* Student card */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #0d2067, #4a59a1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "ME"}
          </div>
          <div>
            <p style={{ fontFamily: H, fontSize: 15, fontWeight: 700, color: "#191c1d" }}>{name}</p>
            <p style={{ fontSize: 12, color: "#454651" }}>{email}</p>
            <p style={{ fontSize: 11, color: "#767682", marginTop: 2 }}>Generated: {date}</p>
          </div>
        </div>

        {/* Overall grade */}
        {overallGrade && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: gradeColor(overallGrade), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: H, fontWeight: 800, fontSize: 20, flexShrink: 0 }}>
              {overallGrade}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: "#454651", marginBottom: 2 }}>Overall CEFR Level</p>
              <p style={{ fontFamily: H, fontSize: 18, fontWeight: 700, color: "#191c1d" }}>
                {overallGrade === "B1" ? "Intermediate" : overallGrade === "A2" ? "Elementary" : "Beginner"}
              </p>
              <p style={{ fontSize: 13, color: "#454651" }}>{avgScore}% avg · {allScores.length} module{allScores.length !== 1 ? "s" : ""} completed</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 26, color: gradeColor(overallGrade), fontVariationSettings: "'FILL' 1" }}>military_tech</span>
          </div>
        )}

        {/* Module score summary bar */}
        {allScores.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: 16, marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#454651", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Score Summary</p>
            {[
              { label: "Speaking",  color: "#059669", scores: sets.map(s => progress[`set${s}`]?.speaking).filter(v => v !== undefined) as number[] },
              { label: "Writing",   color: "#7c3aed", scores: sets.map(s => progress[`set${s}`]?.writing).filter(v => v !== undefined) as number[] },
              { label: "Reading",   color: "#0d2067", scores: sets.map(s => progress[`set${s}`]?.reading).filter(v => v !== undefined) as number[] },
              { label: "Listening", color: "#b45309", scores: sets.map(s => progress[`set${s}`]?.listening).filter(v => v !== undefined) as number[] },
            ].map(({ label, color, scores }) => {
              if (!scores.length) return null;
              const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
              return (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{avg}% · {pctToGrade(avg)}</span>
                  </div>
                  <div style={{ background: "#f1f5f9", borderRadius: 9999, height: 6 }}>
                    <div style={{ height: 6, borderRadius: 9999, background: color, width: `${avg}%`, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Consolidated insights from AI */}
        <Insights progress={progress} />

        {/* Per-set detailed breakdown */}
        <h3 style={{ fontFamily: H, fontSize: 16, fontWeight: 700, color: "#191c1d", marginBottom: 12 }}>Set-by-Set Full Report</h3>

        {sets.map((s) => {
          const p: SetProgress = progress[`set${s}`] || {};
          const attempted = p.reading !== undefined || p.writing !== undefined || p.listening !== undefined || p.speaking !== undefined;

          return (
            <div key={s} style={{ background: "#fff", borderRadius: 14, border: "1px solid #c6c5d2", marginBottom: 14, overflow: "hidden", opacity: attempted ? 1 : 0.5 }}>
              {/* Set header */}
              <div style={{ background: attempted ? "linear-gradient(135deg, #0d2067, #28387e)" : "#f3f4f5", padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: attempted ? "rgba(255,255,255,0.7)" : "#767682", marginBottom: 2 }}>PRACTICE SET {s}</p>
                    <p style={{ fontFamily: H, fontSize: 15, fontWeight: 700, color: attempted ? "#fff" : "#454651" }}>{setLabels[s]}</p>
                  </div>
                  {!attempted && <span style={{ fontSize: 11, color: "#767682", background: "#e1e3e4", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>NOT STARTED</span>}
                </div>
                {/* Mini score row */}
                {attempted && (
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    {[
                      { label: "SPK", val: p.speaking, grade: p.speakingGrade },
                      { label: "WRT", val: p.writing, grade: p.writingGrade },
                      { label: "RDG", val: p.reading, grade: p.readingGrade },
                      { label: "LST", val: p.listening, grade: p.listeningGrade },
                    ].map(({ label, val, grade }) => val !== undefined ? (
                      <div key={label} style={{ background: gradeBg(grade), borderRadius: 6, padding: "3px 8px", textAlign: "center" }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: gradeColor(grade) }}>{label}</p>
                        <p style={{ fontSize: 12, fontWeight: 800, color: gradeColor(grade) }}>{grade ?? pctToGrade(val)}</p>
                        <p style={{ fontSize: 9, color: gradeColor(grade) }}>{val}%</p>
                      </div>
                    ) : null)}
                  </div>
                )}
              </div>

              {/* Module sections */}
              {attempted && (
                <div style={{ padding: "12px 12px 4px" }}>

                  {/* SPEAKING */}
                  {p.speaking !== undefined && (
                    <Section title={`🎤 Speaking — ${p.speakingGrade ?? pctToGrade(p.speaking)} (${p.speaking}%)`} color="#059669">
                      {p.speakingParts && p.speakingParts.length > 0 ? (
                        p.speakingParts.map((sp) => (
                          <SpeakingPartCard key={sp.partNum} sp={sp} color="#059669" />
                        ))
                      ) : (
                        <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>Detailed part breakdown not available. Complete speaking again to save full results.</p>
                      )}
                    </Section>
                  )}

                  {/* WRITING */}
                  {p.writing !== undefined && (
                    <Section title={`✍️ Writing — ${p.writingGrade ?? pctToGrade(p.writing)} (${p.writing}%)`} color="#7c3aed">
                      {p.writingParts && p.writingParts.length > 0 ? (
                        p.writingParts.map((wp) => (
                          <EvalSection key={wp.partNum} part={wp} label={`PART ${wp.partNum} · Writing`} color="#7c3aed" />
                        ))
                      ) : (
                        <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>Detailed part breakdown not available. Complete writing again to save full results.</p>
                      )}
                    </Section>
                  )}

                  {/* READING */}
                  {p.reading !== undefined && (
                    <Section title={`📖 Reading — ${p.readingGrade ?? pctToGrade(p.reading)} (${p.reading}%)`} color="#0d2067">
                      {p.readingQuestions && p.readingQuestions.length > 0 ? (
                        <>
                          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                            <div style={{ background: "#dcfce7", borderRadius: 8, padding: "6px 10px", flex: 1, textAlign: "center" }}>
                              <p style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>{p.readingQuestions.filter(q => q.correct).length}</p>
                              <p style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>CORRECT</p>
                            </div>
                            <div style={{ background: "#fee2e2", borderRadius: 8, padding: "6px 10px", flex: 1, textAlign: "center" }}>
                              <p style={{ fontSize: 18, fontWeight: 800, color: "#dc2626" }}>{p.readingQuestions.filter(q => !q.correct).length}</p>
                              <p style={{ fontSize: 10, color: "#dc2626", fontWeight: 700 }}>WRONG</p>
                            </div>
                            <div style={{ background: "#dde1ff", borderRadius: 8, padding: "6px 10px", flex: 1, textAlign: "center" }}>
                              <p style={{ fontSize: 18, fontWeight: 800, color: "#0d2067" }}>{p.readingQuestions.reduce((a, q) => a + q.pointsEarned, 0)}/{p.readingQuestions.reduce((a, q) => a + q.pointsMax, 0)}</p>
                              <p style={{ fontSize: 10, color: "#0d2067", fontWeight: 700 }}>POINTS</p>
                            </div>
                          </div>
                          {p.readingQuestions.map((q, i) => <QRow key={q.id} q={q} idx={i} />)}
                        </>
                      ) : (
                        <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>Question breakdown not available. Complete reading again to save full results.</p>
                      )}
                    </Section>
                  )}

                  {/* LISTENING */}
                  {p.listening !== undefined && (
                    <Section title={`🎧 Listening — ${p.listeningGrade ?? pctToGrade(p.listening)} (${p.listening}%)`} color="#b45309">
                      {p.listeningQuestions && p.listeningQuestions.length > 0 ? (
                        <>
                          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                            <div style={{ background: "#dcfce7", borderRadius: 8, padding: "6px 10px", flex: 1, textAlign: "center" }}>
                              <p style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>{p.listeningQuestions.filter(q => q.correct).length}</p>
                              <p style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>CORRECT</p>
                            </div>
                            <div style={{ background: "#fee2e2", borderRadius: 8, padding: "6px 10px", flex: 1, textAlign: "center" }}>
                              <p style={{ fontSize: 18, fontWeight: 800, color: "#dc2626" }}>{p.listeningQuestions.filter(q => !q.correct).length}</p>
                              <p style={{ fontSize: 10, color: "#dc2626", fontWeight: 700 }}>WRONG</p>
                            </div>
                            <div style={{ background: "#fef3c7", borderRadius: 8, padding: "6px 10px", flex: 1, textAlign: "center" }}>
                              <p style={{ fontSize: 18, fontWeight: 800, color: "#b45309" }}>{p.listeningQuestions.reduce((a, q) => a + q.pointsEarned, 0)}/{p.listeningQuestions.reduce((a, q) => a + q.pointsMax, 0)}</p>
                              <p style={{ fontSize: 10, color: "#b45309", fontWeight: 700 }}>POINTS</p>
                            </div>
                          </div>
                          {p.listeningQuestions.map((q, i) => <QRow key={q.id} q={q} idx={i} />)}
                        </>
                      ) : (
                        <p style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>Question breakdown not available. Complete listening again to save full results.</p>
                      )}
                    </Section>
                  )}

                </div>
              )}
            </div>
          );
        })}

        {/* WI Upskill Speaking structure reference */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #c6c5d2", padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontFamily: H, fontSize: 15, fontWeight: 700, color: "#0d2067", marginBottom: 12 }}>WI Upskill Mock Test — What Each Section Tests</h3>
          {[
            {
              icon: "🎤", label: "Speaking (3 Parts · ~12 min)", color: "#059669",
              parts: [
                { name: "Part 1 – Personal Interview", desc: "Examiner asks about yourself, your background, care experience, why you want to work as a caregiver. Tests: fluency, pronunciation, basic communication." },
                { name: "Part 2 – Individual Long Turn", desc: "You describe a scenario card (caregiving situation, workplace scene). Speak for 1–2 minutes uninterrupted. Tests: vocabulary range, grammar, task completion." },
                { name: "Part 3 – Discussion / Role-play", desc: "Collaborative task or role-play (e.g., caregiver-patient interaction). Make decisions, give opinions, negotiate. Tests: interaction, discourse management, empathy language." },
              ],
            },
            {
              icon: "✍️", label: "Writing (2 Parts · 30 min)", color: "#7c3aed",
              parts: [
                { name: "Part 1 – Short Functional Writing (~50 words)", desc: "Write a note, email, or message. E.g., 'Write a note to the nurse explaining a patient's condition'. Tests: task completion, clarity, basic grammar." },
                { name: "Part 2 – Extended Writing (~100 words)", desc: "Write a longer piece: description, report, or formal message. E.g., 'Write a report about a patient's daily routine'. Tests: grammar, vocabulary, coherence." },
              ],
            },
            {
              icon: "📖", label: "Reading (3 Parts · 25 min)", color: "#0d2067",
              parts: [
                { name: "Part 1 – Notices & Signs", desc: "Short texts: workplace signs, notices, instructions. Multiple choice. Tests: scanning, gist reading." },
                { name: "Part 2 – Short Texts", desc: "Emails, memos, short passages. True/False or matching. Tests: detailed comprehension." },
                { name: "Part 3 – Longer Text", desc: "One longer passage (care-related article or report). Multiple choice or matching. Tests: inferencing, global understanding." },
              ],
            },
            {
              icon: "🎧", label: "Listening (3 Parts · 25 min)", color: "#b45309",
              parts: [
                { name: "Part 1 – Short Dialogues", desc: "5–8 short conversations. Multiple choice (what did the speaker mean?). Tests: identifying key information." },
                { name: "Part 2 – Longer Monologue", desc: "A talk, announcement, or recorded message. Gap-fill or multiple choice. Tests: following extended speech." },
                { name: "Part 3 – Extended Conversation", desc: "Two or more speakers discussing a care scenario. Matching or multiple choice. Tests: understanding opinions, attitudes." },
              ],
            },
          ].map(({ icon, label, color, parts }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 8 }}>{icon} {label}</p>
              {parts.map((pt) => (
                <div key={pt.name} style={{ background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 8, padding: "8px 10px", marginBottom: 6 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 3 }}>{pt.name}</p>
                  <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{pt.desc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ background: "#fef3c7", border: "1.5px solid #fde68a", borderRadius: 12, padding: 14 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#92400e", flexShrink: 0, marginTop: 1 }}>info</span>
            <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
              <strong>Disclaimer:</strong> Scores are for practice only and do not represent official assessment results.
            </p>
          </div>
        </div>

      </main>
      <BottomNav />
    </div>
  );
}
