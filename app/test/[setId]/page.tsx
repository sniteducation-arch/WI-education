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

const CASLON: React.CSSProperties = { fontFamily: "'Libre Caslon Text', Georgia, serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };

const modules = [
  { key: "writing",   label: "Writing",   icon: "edit_note",        time: "30 min · 2 Tasks",        desc: "Comparative analysis and structured academic writing tasks." },
  { key: "reading",   label: "Reading",   icon: "menu_book",        time: "25 min · 25 Questions",   desc: "Multi-passage comprehension and critical reading exercises." },
  { key: "listening", label: "Listening", icon: "headphones",       time: "25 min · Audio Based",    desc: "Lecture synthesis and conversational comprehension tasks." },
  { key: "speaking",  label: "Speaking",  icon: "record_voice_over",time: "12 min · Interactive",    desc: "Oral argumentation and structured response tasks." },
];

const cefrColors: Record<string, string> = { B1: "#775a19", A2: "#000b21", A1: "#ba1a1a" };

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

  const totalPct = Math.round((doneCount / 4) * 100);

  const overallGrade = (() => {
    const scores = [progress.reading, progress.writing, progress.listening].filter((s) => s !== undefined) as number[];
    if (scores.length === 0) return null;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg >= 80) return "B1";
    if (avg >= 50) return "A2";
    return "A1";
  })();

  return (
    <div style={{ minHeight: "100dvh", background: "#fbf9f8" }}>
      <TopBar showBack backHref="/dashboard" />

      <main style={{ paddingTop: 64, paddingBottom: 96 }}>

        {/* Hero section */}
        <div style={{ background: "#ffffff", borderBottom: "1px solid #c4c6ce", padding: "20px 20px 16px" }}>
          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#44474e", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Library</span>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#c4c6ce" }}>chevron_right</span>
            <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#000b21", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              Practice Set #{String(setNum).padStart(2, "0")}
            </span>
          </nav>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ ...CASLON, fontSize: 26, fontWeight: 600, color: "#000b21", marginBottom: 8, lineHeight: 1.2 }}>
                Advanced Academic Synthesis
              </h2>
              <p style={{ ...INTER, fontSize: 13, color: "#44474e", lineHeight: 1.6, marginBottom: 4 }}>
                WI Upskill Mock Test · {name}
              </p>
            </div>
            {/* Completion */}
            <div style={{ background: "#f5f3f3", border: "1px solid #c4c6ce", padding: "12px 14px", flexShrink: 0, minWidth: 100, textAlign: "center" }}>
              <p style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#44474e", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 4 }}>COMPLETION</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center" }}>
                <span style={{ ...CASLON, fontSize: 26, fontWeight: 700, color: "#000b21" }}>{totalPct}</span>
                <span style={{ ...INTER, fontSize: 12, color: "#44474e" }}>%</span>
              </div>
              <p style={{ ...INTER, fontSize: 10, color: "#44474e" }}>{doneCount} of 4 Modules</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ margin: "16px 20px 0", background: "#f5f3f3", border: "1px solid #c4c6ce", padding: 14 }}>
          <p style={{ ...INTER, fontSize: 13, color: "#44474e", lineHeight: 1.7 }}>
            This practice set is designed to align with the{" "}
            <strong style={{ color: "#000b21" }}>WI Upskill Mock Test</strong>{" "}
            criteria. Work through each module to build your linguistic precision and confidence.
          </p>
        </div>

        {/* CEFR Overview */}
        {overallGrade && (
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{ background: "#eae8e7", border: "1px solid #c4c6ce", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#775a19", fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              <p style={{ ...INTER, fontSize: 13, color: "#44474e" }}>
                Current trajectory:{" "}
                <strong style={{ color: cefrColors[overallGrade] }}>
                  {overallGrade} · {overallGrade === "B1" ? "Intermediate" : overallGrade === "A2" ? "Elementary" : "Beginner"}
                </strong>
              </p>
            </div>
          </div>
        )}

        {/* Modules header */}
        <div style={{ padding: "20px 20px 12px" }}>
          <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#44474e", letterSpacing: "0.1em", textTransform: "uppercase" as const, borderBottom: "1px solid #c4c6ce", paddingBottom: 8 }}>
            EXAMINATION MODULES
          </p>
        </div>

        {/* Module grid (2x2) */}
        <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {modules.map((m) => {
            const moduleScore = progress[m.key as keyof SetProgress];
            const moduleDone = moduleScore !== undefined && moduleScore !== false;
            const grade = progress[`${m.key}Grade` as keyof SetProgress] as string | undefined;

            return (
              <div
                key={m.key}
                style={{
                  background: "#ffffff",
                  border: "1px solid #c4c6ce",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  opacity: moduleDone ? 0.75 : 1,
                  filter: moduleDone ? "grayscale(0.2)" : "none",
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                onClick={() => router.push(`/test/${setId}/${m.key}`)}
                onMouseEnter={(e) => { if (!moduleDone) e.currentTarget.style.borderColor = "#775a19"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#c4c6ce"; }}
              >
                {/* Icon + badge row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 26, color: moduleDone ? "#44474e" : "#000b21" }}>{m.icon}</span>
                  <span style={{
                    ...INTER, fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", padding: "3px 7px",
                    background: moduleDone ? "#eae8e7" : "#fed488",
                    color: moduleDone ? "#44474e" : "#785a1a",
                    textTransform: "uppercase" as const,
                  }}>
                    {moduleDone ? "COMPLETED" : "PENDING"}
                  </span>
                </div>

                {/* Title + desc */}
                <div style={{ marginTop: "auto" }}>
                  <h4 style={{ ...CASLON, fontSize: 15, fontWeight: 600, color: "#000b21", marginBottom: 4 }}>{m.label}</h4>
                  <p style={{ ...INTER, fontSize: 11, color: "#44474e", marginBottom: 12, lineHeight: 1.5 }}>{m.desc}</p>
                  {grade && (
                    <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: cefrColors[grade] || "#775a19", marginBottom: 8 }}>Grade: {grade}</p>
                  )}
                  <button
                    style={{
                      ...INTER,
                      width: "100%",
                      background: moduleDone ? "transparent" : "#000b21",
                      color: moduleDone ? "#000b21" : "#fff",
                      border: moduleDone ? "1px solid #000b21" : "none",
                      borderRadius: 0,
                      padding: "10px 0",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      textTransform: "uppercase" as const,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    {moduleDone ? "REVIEW RESULTS" : <>{`START MODULE `}<span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span></>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Consolidated Transcript */}
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ background: "#efeded", border: "1px solid #c4c6ce", padding: 20 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
              <div>
                <h3 style={{ ...CASLON, fontSize: 20, fontWeight: 600, color: "#000b21", marginBottom: 4 }}>Consolidated Transcript</h3>
                <p style={{ ...INTER, fontSize: 12, color: "#44474e" }}>Aggregated performance from completed sections.</p>
              </div>
              <button
                onClick={() => router.push("/transcript")}
                style={{ ...INTER, background: "none", border: "none", cursor: "pointer", color: "#775a19", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "flex", alignItems: "center", gap: 4, padding: 0 }}
              >
                FULL REPORT <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
              </button>
            </div>

            {doneCount === 0 ? (
              <p style={{ ...INTER, fontSize: 13, color: "#44474e", fontStyle: "italic", textAlign: "center", padding: "16px 0" }}>
                Complete modules to see your scores here.
              </p>
            ) : (
              <>
                {/* Score rows */}
                {[
                  { label: "Reading Accuracy",   score: progress.reading,   grade: progress.readingGrade },
                  { label: "Writing Accuracy",   score: progress.writing,   grade: progress.writingGrade },
                  { label: "Listening Accuracy", score: progress.listening, grade: progress.listeningGrade },
                ].map(({ label, score, grade }) =>
                  score !== undefined ? (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#000b21", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{label}</span>
                        <span style={{ ...CASLON, fontSize: 18, fontWeight: 600, color: cefrColors[grade as string] || "#775a19" }}>{score}%</span>
                      </div>
                      <div style={{ width: "100%", background: "#c4c6ce", height: 2, marginBottom: 16 }}>
                        <div style={{ height: 2, background: cefrColors[grade as string] || "#775a19", width: `${score}%` }} />
                      </div>
                    </div>
                  ) : null
                )}

                {progress.speaking && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #c4c6ce" }}>
                    <span style={{ ...INTER, fontSize: 13, color: "#1b1c1c" }}>Speaking Practice</span>
                    <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#775a19" }}>✓ Completed</span>
                  </div>
                )}

                {overallGrade && (
                  <p style={{ ...INTER, marginTop: 16, fontSize: 12, color: "#44474e", fontStyle: "italic", lineHeight: 1.6 }}>
                    &ldquo;Based on your scores, you are performing at{" "}
                    <strong style={{ color: cefrColors[overallGrade] }}>{overallGrade} level</strong> for this set.&rdquo;
                  </p>
                )}
              </>
            )}
          </div>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
