"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdToken } from "firebase/auth";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import toast from "react-hot-toast";
import { useAuth } from "@/components/AuthProvider";

interface SetProgress {
  reading?: number;
  writing?: number;
  listening?: number;
  speaking?: boolean;
}

const CASLON: React.CSSProperties = { fontFamily: "'Libre Caslon Text', Georgia, serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };

const setData = [
  { id: 1, label: "Academic Proficiency",     icon: "history_edu" },
  { id: 2, label: "Core Vocabulary",          icon: "science" },
  { id: 3, label: "Grammar & Syntax",         icon: "balance" },
  { id: 4, label: "Listening Mastery",        icon: "architecture" },
  { id: 5, label: "Care Communication",       icon: "verified" },
  { id: 6, label: "Public Speaking",          icon: "public" },
  { id: 7, label: "Final Mock Test",          icon: "psychology" },
];

const moduleIcons = [
  { key: "writing",   icon: "edit_note" },
  { key: "reading",   icon: "menu_book" },
  { key: "listening", icon: "hearing" },
  { key: "speaking",  icon: "record_voice_over" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [name, setName] = useState("");
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, SetProgress>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setName(user.displayName?.split(" ")[0] || "Scholar");
    (async () => {
      try {
        const token = await getIdToken(user);
        const res = await fetch(`/api/user/me?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          setPaid(data.paid || false);
          setProgress(data.progress || {});
          if (data.name) setName(data.name.split(" ")[0] || "Scholar");
        }
      } catch {
        toast.error("Could not load data. Check your connection.");
      }
      setLoading(false);
    })();
  }, [authLoading, user, router]);

  if (loading) return <LoadingScreen />;

  const scores: number[] = [];
  for (let s = 1; s <= 7; s++) {
    const p = progress[`set${s}`] || {};
    if (p.reading !== undefined) scores.push(p.reading);
    if (p.writing !== undefined) scores.push(p.writing);
    if (p.listening !== undefined) scores.push(p.listening);
  }
  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const overallGrade = avg >= 80 ? "B1" : avg >= 50 ? "A2" : "A1";
  const gradeLabel = overallGrade === "B1" ? "Upper Int." : overallGrade === "A2" ? "Elementary" : "Beginner";

  const setsAttempted = Array.from({ length: 7 }, (_, i) => {
    const p = progress[`set${i + 1}`] || {};
    return p.reading !== undefined || p.writing !== undefined || p.listening !== undefined || p.speaking;
  });
  const weeklyPct = Math.round((setsAttempted.filter(Boolean).length / 7) * 100);
  const completedCount = setsAttempted.filter(Boolean).length;

  const handleSetClick = (id: number) => {
    if (!paid) {
      toast.error("Please complete payment to access practice sets.");
      router.push("/payment");
    } else {
      router.push(`/test/${id}`);
    }
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#fbf9f8" }}>
      <TopBar
        rightSlot={
          <div
            onClick={() => router.push("/profile")}
            style={{ width: 34, height: 34, border: "1px solid #c4c6ce", background: "#eae8e7", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <span className="material-symbols-outlined" style={{ color: "#000b21", fontSize: 18 }}>person</span>
          </div>
        }
      />

      <main style={{ paddingTop: 80, paddingBottom: 88, paddingLeft: 20, paddingRight: 20 }}>

        {/* Free user upgrade banner */}
        {!paid && (
          <div style={{ background: "#0d2240", padding: 18, marginBottom: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -10, top: -10, opacity: 0.06 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 100, color: "#fff", fontVariationSettings: "'FILL' 1" }}>lock</span>
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <span style={{ background: "#fed488", color: "#785a1a", fontSize: 10, fontWeight: 700, padding: "3px 10px", letterSpacing: "0.06em", display: "inline-block", marginBottom: 8 }}>FREE ACCOUNT</span>
              <h3 style={{ ...CASLON, fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Unlock All 7 Practice Sets</h3>
              <p style={{ ...INTER, fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 14, lineHeight: 1.5 }}>
                Pay once and get full access to Reading, Writing, Listening and Speaking modules.
              </p>
              <button
                onClick={() => router.push("/payment")}
                style={{ ...INTER, background: "#fff", color: "#000b21", border: "none", borderRadius: 0, padding: "11px 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, textTransform: "uppercase" as const }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>payments</span>
                REQUEST FULL ACCESS — NPR 499
              </button>
            </div>
          </div>
        )}

        {/* Hero stats */}
        <div style={{ background: "#ffffff", border: "1px solid #c4c6ce", padding: 20, marginBottom: 0 }}>
          <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#775a19", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" as const }}>CURRENT STANDING</p>
          <h2 style={{ ...CASLON, fontSize: 26, fontWeight: 600, color: "#000b21", marginBottom: 8, lineHeight: 1.2 }}>Upskill Practice Sets</h2>
          <p style={{ ...INTER, fontSize: 14, color: "#44474e", marginBottom: 16, lineHeight: 1.6 }}>
            Refine your academic prowess through rigorous modular evaluation.
          </p>
          <div style={{ display: "flex", gap: 28 }}>
            <div>
              <p style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#44474e", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 2 }}>LEVEL</p>
              <p style={{ ...CASLON, fontSize: 18, fontWeight: 600, color: "#000b21" }}>{paid ? `${overallGrade} ${gradeLabel}` : "Locked"}</p>
            </div>
            <div style={{ width: 1, background: "#c4c6ce" }} />
            <div>
              <p style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#44474e", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 2 }}>COMPLETED</p>
              <p style={{ ...CASLON, fontSize: 18, fontWeight: 600, color: "#000b21" }}>{completedCount} Sets</p>
            </div>
          </div>
        </div>

        {/* Weekly goal card (paid) */}
        {paid && (
          <div style={{ background: "#0d2240", padding: 20, marginBottom: 0, borderTop: "none" }}>
            <p style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#778aad", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 8 }}>WEEKLY GOAL</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 8 }}>
              <span style={{ ...CASLON, fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{weeklyPct}</span>
              <span style={{ ...CASLON, fontSize: 22, fontWeight: 700, color: "#778aad", paddingBottom: 4 }}>%</span>
            </div>
            <div style={{ width: "100%", background: "#000b21", height: 4, marginBottom: 8 }}>
              <div style={{ height: 4, background: "#fed488", width: `${weeklyPct}%`, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#778aad", letterSpacing: "0.06em" }}>CURRENT: {weeklyPct}%</span>
              <span style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#778aad", letterSpacing: "0.06em" }}>GOAL: 100%</span>
            </div>
          </div>
        )}

        {/* Full Exam card (paid) */}
        {paid && (
          <div
            onClick={() => router.push("/full-exam")}
            style={{ background: "#fff", border: "1px solid #c4c6ce", borderLeft: "4px solid #000b21", padding: 16, marginTop: 16, cursor: "pointer", position: "relative", overflow: "hidden" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = "#775a19"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = "#000b21"; }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <span style={{ background: "#fed488", color: "#785a1a", fontSize: 10, fontWeight: 700, padding: "2px 8px", letterSpacing: "0.06em" }}>NEW</span>
                  <span style={{ background: "#eae8e7", color: "#44474e", fontSize: 10, fontWeight: 700, padding: "2px 8px", letterSpacing: "0.06em" }}>PAID ONLY</span>
                </div>
                <h3 style={{ ...CASLON, fontSize: 16, fontWeight: 600, color: "#000b21", marginBottom: 4 }}>Full Practice Exam</h3>
                <p style={{ ...INTER, fontSize: 12, color: "#44474e", lineHeight: 1.5 }}>96 min · Listening, Reading, Writing & Speaking</p>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#000b21" }}>arrow_forward</span>
            </div>
          </div>
        )}

        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #c4c6ce", paddingBottom: 14, marginTop: 28, marginBottom: 16 }}>
          <h3 style={{ ...CASLON, fontSize: 24, fontWeight: 600, color: "#000b21" }}>Active Curriculum</h3>
          {!paid && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, ...INTER, fontSize: 11, color: "#ba1a1a", fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
              LOCKED
            </span>
          )}
        </div>

        {/* Practice set cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {setData.map((s) => {
            const sp = progress[`set${s.id}`] || {};
            const doneCount = [sp.reading !== undefined, sp.writing !== undefined, sp.listening !== undefined, sp.speaking].filter(Boolean).length;
            const allDone = doneCount === 4;
            const pct = Math.round((doneCount / 4) * 100);
            const locked = !paid;

            return (
              <div
                key={s.id}
                onClick={() => handleSetClick(s.id)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #c4c6ce",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  opacity: allDone ? 0.7 : 1,
                  filter: allDone ? "grayscale(0.4)" : "none",
                  transition: "border-color 0.15s",
                  gap: 10,
                }}
                onMouseEnter={(e) => { if (!allDone) e.currentTarget.style.borderColor = "#775a19"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#c4c6ce"; }}
              >
                {/* Left: icon + info */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 }}>
                  <div style={{ background: "#eae8e7", padding: 10, flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#000b21" }}>{s.icon}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#44474e", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 2 }}>SET {String(s.id).padStart(2, "0")}</p>
                    <h4 style={{ ...CASLON, fontSize: 15, fontWeight: 600, color: "#000b21", marginBottom: 8, lineHeight: 1.3 }}>{s.label}</h4>
                    {/* Module icons */}
                    <div style={{ display: "flex", gap: 10 }}>
                      {moduleIcons.map((m) => {
                        const done = !locked && sp[m.key as keyof SetProgress] !== undefined && sp[m.key as keyof SetProgress] !== false;
                        return (
                          <span
                            key={m.key}
                            className="material-symbols-outlined"
                            style={{ fontSize: 16, color: done ? "#775a19" : "#c4c6ce" }}
                            title={m.key}
                          >
                            {m.icon}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: status + button */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ ...INTER, fontSize: 9, fontWeight: 600, color: "#44474e", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 2 }}>STATUS</p>
                    <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: allDone ? "#775a19" : locked ? "#ba1a1a" : doneCount > 0 ? "#000b21" : "#775a19" }}>
                      {locked ? "LOCKED" : allDone ? "PASSED" : doneCount > 0 ? `${pct}% COMPLETE` : "NOT STARTED"}
                    </p>
                  </div>
                  <button
                    style={{
                      ...INTER,
                      background: allDone ? "transparent" : "#000b21",
                      color: allDone ? "#000b21" : "#fff",
                      border: allDone ? "1px solid #000b21" : "none",
                      borderRadius: 0,
                      padding: "8px 14px",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      textTransform: "uppercase" as const,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {locked ? "LOCKED" : allDone ? "REVIEW" : doneCount > 0 ? "RESUME" : "BEGIN"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Decorative watermark */}
        <div style={{ marginTop: 48, display: "flex", justifyContent: "center", opacity: 0.08, pointerEvents: "none" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 80, color: "#000b21" }}>verified_user</span>
        </div>
      </main>

      <BottomNav />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, background: "#fbf9f8" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #eae8e7", borderTopColor: "#000b21", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#44474e", fontSize: 13 }}>Loading your dashboard…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
