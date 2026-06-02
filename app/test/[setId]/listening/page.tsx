"use client";
import { use, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { testSets, calculateGrade, ListeningQuestion } from "@/lib/questions";
import { listeningAudioUrls } from "@/lib/listening-audio-urls";
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

const MAX_PLAYS = 3;

// Group consecutive questions that share the same transcript into one audio block
function groupQuestions(qs: ListeningQuestion[]) {
  const groups: Array<{ transcript: string; questions: ListeningQuestion[]; firstQIdx: number }> = [];
  for (let i = 0; i < qs.length; i++) {
    const q = qs[i];
    const last = groups[groups.length - 1];
    if (last && last.transcript === q.transcript) {
      last.questions.push(q);
    } else {
      groups.push({ transcript: q.transcript, questions: [q], firstQIdx: i });
    }
  }
  return groups;
}

function OnDemandPlayer({ transcript }: { transcript: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused" | "error">("idle");
  const [playsUsed, setPlaysUsed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    if (state === "loading" || playsUsed >= MAX_PLAYS) return;
    setState("loading");
    try {
      const res = await fetch("/api/listening/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
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
  }, [transcript, state, playsUsed]);

  const toggle = useCallback(() => {
    if (!audioRef.current) { load(); return; }
    if (state === "playing") audioRef.current.pause();
    else audioRef.current.play();
  }, [state, load]);

  const replay = useCallback(() => {
    if (playsUsed >= MAX_PLAYS || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setPlaysUsed((p) => p + 1);
  }, [playsUsed]);

  useEffect(() => () => {
    audioRef.current?.pause();
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
  }, []);

  const exhausted = playsUsed >= MAX_PLAYS;

  return (
    <div>
      <p style={{ fontSize: 12, color: "#78350f", marginBottom: 10, lineHeight: 1.5 }}>
        Listen carefully. You can play the audio up to {MAX_PLAYS} times.
      </p>
      <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
        {Array.from({ length: MAX_PLAYS }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 9999, background: i < playsUsed ? "#b45309" : "#fde68a" }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: "#92400e", fontWeight: 600, marginBottom: 10 }}>
        {exhausted ? "Maximum plays reached." : `${MAX_PLAYS - playsUsed} play${MAX_PLAYS - playsUsed !== 1 ? "s" : ""} remaining`}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={toggle}
          disabled={state === "loading" || exhausted}
          style={{ flex: 2, background: exhausted ? "#e2e8f0" : state === "playing" ? "#b45309" : "#92400e", color: exhausted ? "#94a3b8" : "#fff", border: "none", borderRadius: 9, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: (state === "loading" || exhausted) ? "not-allowed" : "pointer", opacity: state === "loading" ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          {state === "loading" ? (
            <><span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Generating…</>
          ) : state === "playing" ? "⏸ Pause" : exhausted ? "No plays left" : state === "paused" ? "▶ Resume" : "▶ Play Audio"}
        </button>
        {audioRef.current && !exhausted && state !== "playing" && (
          <button onClick={replay} style={{ flex: 1, background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", borderRadius: 9, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            ↻ Again
          </button>
        )}
      </div>
      {state === "error" && (
        <p style={{ fontSize: 12, color: "#dc2626", marginTop: 8 }}>Audio generation failed. Please read the transcript.</p>
      )}
    </div>
  );
}

const TOTAL_TIME = 25 * 60;

export default function ListeningPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = use(params);
  const router = useRouter();
  const setNum = parseInt(setId);
  const questions = testSets[setNum]?.listening || [];

  const { user, authLoading } = useAuth();
  const [uid, setUid] = useState("");
  const [currentGroup, setCurrentGroup] = useState(0);
  const groups = useMemo(() => groupQuestions(questions), [questions]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
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
      setTimeLeft((t) => { if (t <= 1) { handleSubmit(); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submitted]);

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    let score = 0;
    questions.forEach((q) => {
      if (q.type === "ordering" && q.correctOrder) {
        // Score 1 point per item in the correct position
        try {
          const userOrder: string[] = JSON.parse(answers[q.id] ?? "[]");
          let correct = 0;
          q.correctOrder.forEach((item, i) => { if (userOrder[i] === item) correct++; });
          score += correct;
        } catch { /* ignore */ }
      } else if (q.type === "fill") {
        const userAns = (answers[q.id] ?? "").trim().toLowerCase();
        const correctAns = (q.answer ?? "").trim().toLowerCase();
        if (userAns === correctAns) score += q.points;
      } else {
        if (answers[q.id] === q.answer) score += q.points;
      }
    });
    const total = questions.reduce((s, q) => s + q.points, 0);
    const grade = calculateGrade(score, total);
    setResult(grade);
    setSubmitted(true);
    if (uid) {
      try {
        const listeningQuestions = questions.map((q) => {
          const ans = answers[q.id];
          const correct = ans === q.answer;
          return {
            id: q.id,
            part: q.part ?? 1,
            transcript: q.transcript,
            question: q.question,
            type: q.type,
            options: q.options ?? [],
            userAnswer: ans ?? "(no answer)",
            correctAnswer: q.answer,
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
              listening: grade.percentage,
              listeningGrade: grade.grade,
              listeningQuestions,
            },
          },
        });
      } catch { /* non-critical */ }
    }
  };

  const group = groups[currentGroup];
  const audioUrl = group ? listeningAudioUrls[group.questions[0].id] : undefined;
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  if (submitted && result) return (
    <SimpleResult result={result} setNum={setNum} module="Listening" onBack={() => router.push(`/test/${setId}`)} />
  );

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg, #78350f, #d97706)", padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={() => router.push(`/test/${setId}`)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#fff", fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px" }}>
            <Clock size={14} color="#fff" />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontVariantNumeric: "tabular-nums" }}>{mm}:{ss}</span>
          </div>
        </div>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Listening · Set {setNum}</p>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
          {group && (
            group.questions.length > 1
              ? `Questions ${group.firstQIdx + 1}–${group.firstQIdx + group.questions.length} of ${questions.length}`
              : `Question ${group.firstQIdx + 1} of ${questions.length}`
          )}
        </p>
        <div style={{ marginTop: 10, background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 4 }}>
          <div style={{ height: 4, borderRadius: 4, background: "#fff", width: `${((currentGroup + 1) / groups.length) * 100}%` }} />
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>
        {/* Single audio player for this group */}
        <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 12, padding: 14, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Volume2 size={18} color="#92400e" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#92400e" }}>
              Part {group?.questions[0].part} · Listen and Answer
            </span>
          </div>
          {audioUrl ? (
            <audio
              key={audioUrl}
              controls
              style={{ width: "100%", borderRadius: 8, outline: "none" }}
            >
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
          ) : (
            <OnDemandPlayer key={group?.questions[0].id} transcript={group?.transcript ?? ""} />
          )}
        </div>

        {/* All questions for this audio group */}
        {group?.questions.map((q, qi) => (
          <div key={q.id} style={{ marginBottom: qi < group.questions.length - 1 ? 28 : 0 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", lineHeight: 1.6, marginBottom: 14 }}>
              Q{group.firstQIdx + qi + 1}. {q.question}
            </p>

            {/* MCQ */}
            {q.type === "mcq" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    style={{
                      background: answers[q.id] === opt ? "#fef3c7" : "#f8fafc",
                      border: `2px solid ${answers[q.id] === opt ? "#f59e0b" : "#e2e8f0"}`,
                      borderRadius: 12, padding: "13px 16px", fontSize: 14,
                      color: answers[q.id] === opt ? "#92400e" : "#374151",
                      fontWeight: answers[q.id] === opt ? 600 : 400,
                      cursor: "pointer", textAlign: "left",
                    }}
                  >{opt}</button>
                ))}
              </div>
            )}

            {/* Gap-fill */}
            {q.type === "fill" && (
              <div>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Type the missing word exactly as you hear it.</p>
                <input
                  type="text"
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Type your answer here…"
                  style={{
                    width: "100%", padding: "13px 14px", fontSize: 15, color: "#1e293b",
                    border: `2px solid ${answers[q.id] ? "#f59e0b" : "#e2e8f0"}`,
                    borderRadius: 12, outline: "none", background: answers[q.id] ? "#fef3c7" : "#f8fafc",
                    fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {/* Ordering */}
            {q.type === "ordering" && q.items && (() => {
              let userOrder: string[] = [];
              try { userOrder = JSON.parse(answers[q.id] ?? "[]"); } catch { userOrder = []; }
              const setOrder = (newOrder: string[]) =>
                setAnswers((a) => ({ ...a, [q.id]: JSON.stringify(newOrder) }));
              const handleTap = (item: string) => {
                if (userOrder.includes(item)) {
                  setOrder(userOrder.filter((i) => i !== item));
                } else if (userOrder.length < (q.items?.length ?? 5)) {
                  setOrder([...userOrder, item]);
                }
              };
              return (
                <div>
                  <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
                    Tap items in the order you hear them (1st → 5th). Tap again to remove.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {q.items.map((item) => {
                      const pos = userOrder.indexOf(item);
                      const selected = pos !== -1;
                      return (
                        <button
                          key={item}
                          onClick={() => handleTap(item)}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            background: selected ? "#fef3c7" : "#f8fafc",
                            border: `2px solid ${selected ? "#f59e0b" : "#e2e8f0"}`,
                            borderRadius: 12, padding: "11px 14px", fontSize: 14,
                            color: selected ? "#92400e" : "#374151",
                            fontWeight: selected ? 600 : 400,
                            cursor: "pointer", textAlign: "left",
                          }}
                        >
                          <span style={{
                            width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                            background: selected ? "#f59e0b" : "#e2e8f0",
                            color: selected ? "#fff" : "#94a3b8",
                            fontSize: 12, fontWeight: 800,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>{selected ? pos + 1 : "·"}</span>
                          {item}
                        </button>
                      );
                    })}
                  </div>
                  {userOrder.length > 0 && (
                    <button
                      onClick={() => setOrder([])}
                      style={{ marginTop: 10, fontSize: 12, color: "#dc2626", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      ✕ Clear order
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        ))}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ padding: "12px 16px 24px", background: "#fff", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
        <button onClick={() => setCurrentGroup((g) => Math.max(0, g - 1))} disabled={currentGroup === 0} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: currentGroup === 0 ? 0.4 : 1 }}>
          <ChevronLeft size={18} /> Previous
        </button>
        {currentGroup < groups.length - 1 ? (
          <button onClick={() => setCurrentGroup((g) => g + 1)} style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: "linear-gradient(135deg, #78350f, #d97706)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button onClick={handleSubmit} style={{ flex: 2, background: "linear-gradient(135deg, #16a34a, #22c55e)", color: "#fff", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Submit Test
          </button>
        )}
      </div>
    </div>
  );
}

function SimpleResult({ result, setNum, module, onBack }: { result: ReturnType<typeof calculateGrade>; setNum: number; module: string; onBack: () => void }) {
  const gradeColors: Record<string, string> = { B1: "#16a34a", A2: "#f59e0b", A1: "#ef4444" };
  const color = gradeColors[result.grade];
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <div style={{ width: 90, height: 90, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 30, fontWeight: 800, color: "#fff" }}>
        {result.grade}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>{module} Complete</h2>
      <p style={{ fontSize: 16, color, fontWeight: 600 }}>{result.label}</p>
      <p style={{ color: "#64748b", marginTop: 4, marginBottom: 16 }}>{result.score}/{result.total} · {result.percentage}%</p>
      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, maxWidth: 320, marginBottom: 32 }}>{result.feedback}</p>
      <button onClick={onBack} style={{ background: "linear-gradient(135deg, #1e3a8a, #3b5fc0)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
        Back to Set {setNum}
      </button>
    </div>
  );
}
