"use client";
import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { testSets, calculateGrade, Question } from "@/lib/questions";
import { ArrowLeft, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const TOTAL_TIME = 25 * 60;

export default function ReadingPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = use(params);
  const router = useRouter();
  const setNum = parseInt(setId);
  const questions = testSets[setNum]?.reading || [];

  const { user, authLoading } = useAuth();
  const [uid, setUid] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof calculateGrade> | null>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setUid(user.uid);
  }, [authLoading, user, router]);

  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submitted]);

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    let score = 0;
    questions.forEach((q) => {
      const ans = answers[q.id];
      if (q.type === "truefalse") {
        if (ans === String(q.answer)) score += q.points;
      } else {
        if (ans === q.answer) score += q.points;
      }
    });
    const total = questions.reduce((s, q) => s + q.points, 0);
    const grade = calculateGrade(score, total);
    setResult(grade);
    setSubmitted(true);
    if (uid) {
      try {
        const readingQuestions = questions.map((q) => {
          const ans = answers[q.id];
          const correct = q.type === "truefalse" ? ans === String(q.answer) : ans === q.answer;
          return {
            id: q.id,
            part: q.part ?? 1,
            question: q.question,
            passage: q.passage ?? "",
            type: q.type,
            options: q.options ?? [],
            userAnswer: ans ?? "(no answer)",
            correctAnswer: String(q.answer),
            correct,
            pointsEarned: correct ? q.points : 0,
            pointsMax: q.points,
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
              reading: grade.percentage,
              readingGrade: grade.grade,
              readingQuestions,
            },
          },
        });
      } catch { /* non-critical */ }
    }
  };

  const q = questions[current];
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const partNum = q?.part ?? 1;
  const partNames: Record<number, string> = {
    1: "Short Texts — Choose the Meaning",
    2: "Complete the Sentence",
    3: "Complete the Sentence (Extended)",
    4: "Complete the Sentence (Advanced)",
    5: "Longer Text — Comprehension",
  };
  const isLongPassage = partNum === 5;

  if (submitted && result) return <ResultScreen result={result} setNum={setNum} answers={answers} questions={questions} onBack={() => router.push(`/test/${setId}`)} />;

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a, #3b5fc0)", padding: "16px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={() => router.push(`/test/${setId}`)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#fff", fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px" }}>
            <Clock size={14} color={timeLeft < 300 ? "#fca5a5" : "#fff"} />
            <span style={{ color: timeLeft < 300 ? "#fca5a5" : "#fff", fontWeight: 700, fontSize: 15, fontVariantNumeric: "tabular-nums" }}>
              {mm}:{ss}
            </span>
          </div>
        </div>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Reading · Set {setNum}</p>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
          Part {partNum} · Q{current + 1} of {questions.length}
        </p>
        <div style={{ marginTop: 10, background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 4 }}>
          <div style={{ height: 4, borderRadius: 4, background: "#fff", width: `${((current + 1) / questions.length) * 100}%`, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Part label */}
      <div style={{ padding: "10px 16px 0", background: "#f8fafc", flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1e3a8a", background: "#dbeafe", borderRadius: 6, padding: "3px 10px" }}>
          PART {partNum} — {partNames[partNum]}
        </span>
      </div>

      {/* Part 5: long passage fixed above question */}
      {isLongPassage && q.passage && (
        <div style={{ padding: "10px 16px 0", background: "#f8fafc", flexShrink: 0, borderBottom: "1.5px solid #e2e8f0" }}>
          <div style={{ background: "#fff", border: "1.5px solid #dbeafe", borderRadius: 12, padding: 14, fontSize: 13, color: "#374151", lineHeight: 1.7, maxHeight: 160, overflowY: "auto" }}>
            {q.passage}
          </div>
        </div>
      )}

      {/* Question area */}
      <div style={{ flex: 1, padding: "16px 16px", overflowY: "auto" }}>
        {/* Non-Part-5 passage (short notice/sign) */}
        {!isLongPassage && q.passage && (
          <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 13, color: "#374151", lineHeight: 1.7, fontStyle: "italic" }}>
            {q.passage}
          </div>
        )}

        <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", lineHeight: 1.6, marginBottom: 18 }}>
          Q{current + 1}. {q.question}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options?.map((opt) => (
            <OptionBtn key={opt} label={opt} selected={answers[q.id] === opt} onSelect={() => setAnswers((a) => ({ ...a, [q.id]: opt }))} />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ padding: "12px 16px 24px", background: "#fff", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          style={{ flex: 1, ...navBtn, opacity: current === 0 ? 0.4 : 1 }}
        >
          <ChevronLeft size={18} /> Previous
        </button>
        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent((c) => c + 1)} style={{ flex: 2, ...navBtnPrimary }}>
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button onClick={handleSubmit} style={{ flex: 2, ...navBtnSuccess }}>
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
}

function OptionBtn({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      style={{
        background: selected ? "#dbeafe" : "#f8fafc",
        border: `2px solid ${selected ? "#3b82f6" : "#e2e8f0"}`,
        borderRadius: 12,
        padding: "13px 16px",
        fontSize: 14,
        color: selected ? "#1e40af" : "#374151",
        fontWeight: selected ? 600 : 400,
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function ResultScreen({ result, setNum, answers, questions, onBack }: {
  result: ReturnType<typeof calculateGrade>;
  setNum: number;
  answers: Record<string, string | boolean>;
  questions: Question[];
  onBack: () => void;
}) {
  const gradeColors: Record<string, string> = { B1: "#16a34a", A2: "#f59e0b", A1: "#ef4444" };
  const color = gradeColors[result.grade];
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a8a, #3b5fc0)", padding: "24px 20px", textAlign: "center", color: "#fff" }}>
        <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>Reading · Set {setNum}</p>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 28, fontWeight: 800, color: "#fff" }}>
          {result.grade}
        </div>
        <p style={{ fontSize: 22, fontWeight: 700 }}>{result.label}</p>
        <p style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>{result.score}/{result.total} · {result.percentage}%</p>
      </div>

      <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{result.feedback}</p>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Answer Review</h3>
        {questions.map((q, i) => {
          const userAns = answers[q.id];
          const correct = q.type === "truefalse" ? userAns === String(q.answer) : userAns === q.answer;
          return (
            <div key={q.id} style={{ background: "#fff", borderRadius: 12, padding: 14, marginBottom: 8, border: `1.5px solid ${correct ? "#bbf7d0" : "#fecaca"}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <p style={{ fontSize: 13, color: "#374151", fontWeight: 600, marginBottom: 4 }}>Q{i + 1}. {q.question}</p>
              <p style={{ fontSize: 12, color: correct ? "#16a34a" : "#dc2626" }}>Your answer: {String(userAns || "Not answered")}</p>
              {!correct && <p style={{ fontSize: 12, color: "#16a34a" }}>Correct: {String(q.answer)}</p>}
            </div>
          );
        })}

        <button onClick={onBack} style={{ width: "100%", background: "linear-gradient(135deg, #1e3a8a, #3b5fc0)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
          Back to Set {setNum}
        </button>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

const navBtn: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" };
const navBtnPrimary: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "linear-gradient(135deg, #1e3a8a, #3b5fc0)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" };
const navBtnSuccess: React.CSSProperties = { ...navBtnPrimary, background: "linear-gradient(135deg, #16a34a, #22c55e)" };
