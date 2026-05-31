"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

interface SetProgress {
  reading?: number;
  readingGrade?: string;
  writing?: number;
  writingGrade?: string;
  listening?: number;
  listeningGrade?: string;
  speaking?: boolean;
}

const modules = [
  { key: "writing",   label: "Writing",   icon: "edit_note",          time: "30 min · 2 Tasks",          color: "#7c3aed", bg: "#f5f3ff" },
  { key: "reading",   label: "Reading",   icon: "menu_book",           time: "25 min · 25 Questions",     color: "#0d2067", bg: "#dde1ff" },
  { key: "listening", label: "Listening", icon: "hearing",             time: "25 min · Audio Based",      color: "#92400e", bg: "#fef3c7" },
  { key: "speaking",  label: "Speaking",  icon: "record_voice_over",   time: "12 min · Interactive",      color: "#065f46", bg: "#dcfce7" },
];

const cefrColors: Record<string, string> = { B1: "#346b00", A2: "#92400e", A1: "#dc2626" };

export default function SetDetailPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = use(params);
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const setNum = parseInt(setId);
  const [progress, setProgress] = useState<SetProgress>({});
  const [name, setName] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setName(user.displayName?.split(" ")[0] || "Scholar");
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const p = snap.data().progress || {};
          setProgress(p[`set${setNum}`] || {});
        }
      } catch { /* non-critical */ }
    })();
  }, [authLoading, user, router, setNum]);

  if (isNaN(setNum) || setNum < 1 || setNum > 7) {
    router.push("/dashboard");
    return null;
  }

  const doneCount = [
    progress.reading !== undefined,
    progress.writing !== undefined,
    progress.listening !== undefined,
    progress.speaking,
  ].filter(Boolean).length;

  const overallGrade = (() => {
    const scores = [progress.reading, progress.writing, progress.listening].filter((s) => s !== undefined) as number[];
    if (scores.length === 0) return null;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg >= 75) return "B1";
    if (avg >= 50) return "A2";
    return "A1";
  })();

  return (
    <div style={{ minHeight: "100dvh", background: "#f8f9fa" }}>
      <TopBar showBack backHref="/dashboard" />

      <main style={{ paddingTop: 64, paddingBottom: 96 }}>
        {/* Hero banner */}
        <div style={{ position: "relative", background: "linear-gradient(135deg, #0d2067 0%, #28387e 60%, #4a59a1 100%)", minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 20px 20px", overflow: "hidden" }}>
          {/* Decorative bg icon */}
          <div style={{ position: "absolute", right: -16, top: -16, opacity: 0.08 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 200, color: "#fff", fontVariationSettings: "'FILL' 1" }}>exercise</span>
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: "var(--font-manrope)", fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 4 }}>
              Practice Set #{setNum < 10 ? `0${setNum}` : setNum}
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>MoralEdu Care Upskill Prep · {name}</p>
          </div>
        </div>

        {/* Description card */}
        <div style={{ margin: "16px 20px", background: "#f3f4f5", borderRadius: 12, border: "1px solid #c6c5d2", padding: 14 }}>
          <p style={{ fontSize: 13, color: "#454651", lineHeight: 1.7 }}>
            This practice set is designed to align with the{" "}
            <strong style={{ color: "#0d2067" }}>Cambridge UpSkill assessment</strong>{" "}
            criteria. Work through each module to build your linguistic precision and confidence for the real exam.
          </p>
        </div>

        {/* CEFR Grading Overview */}
        <div style={{ padding: "0 20px", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "var(--font-manrope)", fontSize: 18, fontWeight: 600, color: "#0d2067", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>military_tech</span>
            CEFR Grading Overview
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {(["A1", "A2", "B1"] as const).map((level) => {
              const labels = { A1: "Beginner", A2: "Elementary", B1: "Intermediate" };
              const active = overallGrade === level;
              return (
                <div
                  key={level}
                  style={{
                    background: "#fff",
                    borderLeft: `4px solid ${active ? cefrColors[level] : "#c6c5d2"}`,
                    borderRadius: "0 8px 8px 0",
                    padding: "10px 12px",
                    boxShadow: active ? `0 2px 8px rgba(0,0,0,0.1)` : "none",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: active ? cefrColors[level] : "#767682" }}>{level}</div>
                  <div style={{ fontSize: 12, color: active ? "#191c1d" : "#767682", marginTop: 2 }}>{labels[level]}</div>
                </div>
              );
            })}
          </div>
          {overallGrade && (
            <div style={{ marginTop: 10, background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#346b00", fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              <p style={{ fontSize: 13, color: "#166534" }}>
                Your current trajectory: <strong>{overallGrade} · {overallGrade === "B1" ? "Intermediate" : overallGrade === "A2" ? "Elementary" : "Beginner"}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Modules list */}
        <div style={{ padding: "0 20px", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "var(--font-manrope)", fontSize: 18, fontWeight: 600, color: "#0d2067", marginBottom: 14 }}>
            Core Modules
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {modules.map((m) => {
              const moduleScore = progress[m.key as keyof SetProgress];
              const moduleDone = moduleScore !== undefined && moduleScore !== false;
              const grade = progress[`${m.key}Grade` as keyof SetProgress] as string | undefined;
              return (
                <div
                  key={m.key}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #c6c5d2",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push(`/test/${setId}/${m.key}`)}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(13,32,103,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: moduleDone ? "#dcfce7" : m.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 22, color: moduleDone ? "#16a34a" : m.color, fontVariationSettings: moduleDone ? "'FILL' 1" : "'FILL' 0" }}>
                        {moduleDone ? "check_circle" : m.icon}
                      </span>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "var(--font-manrope)", fontSize: 18, fontWeight: 600, color: "#191c1d", marginBottom: 2 }}>{m.label}</h4>
                      <p style={{ fontSize: 13, color: "#454651" }}>
                        {m.time}
                        {grade && <span style={{ marginLeft: 8, fontWeight: 700, color: cefrColors[grade] || "#346b00" }}>· {grade}</span>}
                      </p>
                    </div>
                  </div>
                  <button style={{ background: moduleDone ? "#f3f4f5" : "#0d2067", color: moduleDone ? "#0d2067" : "#fff", border: moduleDone ? "1px solid #c6c5d2" : "none", borderRadius: 9999, padding: "8px 18px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                    {moduleDone ? "Redo" : "Start"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consolidated Transcript section */}
        <div style={{ padding: "0 20px" }}>
          <div style={{ background: "#e7e8e9", borderRadius: 12, border: "2px dashed #c6c5d2", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-manrope)", fontSize: 18, fontWeight: 600, color: "#0d2067", display: "flex", alignItems: "center", gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>receipt_long</span>
                Set {setNum} Transcript
              </h3>
              <button
                onClick={() => router.push("/transcript")}
                style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#0d2067", fontSize: 12, fontWeight: 700 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
                Full Report
              </button>
            </div>

            {doneCount === 0 ? (
              <p style={{ fontSize: 14, color: "#454651", fontStyle: "italic", textAlign: "center", padding: "16px 0" }}>
                Complete modules to see your scores here.
              </p>
            ) : (
              <div>
                {[
                  { label: "Reading", score: progress.reading, grade: progress.readingGrade },
                  { label: "Writing", score: progress.writing, grade: progress.writingGrade },
                  { label: "Listening", score: progress.listening, grade: progress.listeningGrade },
                ].map(({ label, score, grade }) => (
                  score !== undefined && (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #c6c5d2" }}>
                      <span style={{ fontSize: 14, color: "#191c1d" }}>{label} Accuracy</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cefrColors[grade as string] || "#346b00" }}>
                        {score}% · {grade}
                      </span>
                    </div>
                  )
                ))}
                {progress.speaking && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #c6c5d2" }}>
                    <span style={{ fontSize: 14, color: "#191c1d" }}>Speaking Practice</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#346b00" }}>✓ Completed</span>
                  </div>
                )}
                {overallGrade && (
                  <p style={{ marginTop: 14, fontSize: 13, color: "#454651", fontStyle: "italic", lineHeight: 1.6 }}>
                    &ldquo;Based on your scores, you are performing at <strong style={{ color: cefrColors[overallGrade] }}>{overallGrade} level</strong> for this set.&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
