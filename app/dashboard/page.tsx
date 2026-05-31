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

const H = "'Manrope', system-ui, sans-serif";

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
  const overallGrade = avg >= 75 ? "B1" : avg >= 50 ? "A2" : "A1";
  const setsAttempted = Array.from({ length: 7 }, (_, i) => {
    const p = progress[`set${i + 1}`] || {};
    return p.reading !== undefined || p.writing !== undefined || p.listening !== undefined || p.speaking;
  });
  const weeklyPct = Math.round((setsAttempted.filter(Boolean).length / 7) * 100);

  return (
    <div style={{ minHeight: "100dvh", background: "#f8f9fa" }}>
      <TopBar
        rightSlot={
          <div
            onClick={() => router.push("/profile")}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "#dde1ff", border: "1.5px solid #c6c5d2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <span className="material-symbols-outlined" style={{ color: "#0d2067", fontSize: 20 }}>person</span>
          </div>
        }
      />

      <main style={{ paddingTop: 80, paddingBottom: 88, paddingLeft: 20, paddingRight: 20 }}>

        {/* ── Payment banner for free users ── */}
        {!paid && (
          <div style={{ background: "linear-gradient(135deg, #0d2067, #28387e)", borderRadius: 14, padding: 18, marginBottom: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -10, top: -10, opacity: 0.08 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 100, color: "#fff", fontVariationSettings: "'FILL' 1" }}>lock</span>
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <span style={{ background: "#abf374", color: "#367000", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 9999, display: "inline-block", marginBottom: 8 }}>FREE ACCOUNT</span>
              <h3 style={{ fontFamily: H, fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Unlock All 7 Practice Sets</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 14, lineHeight: 1.5 }}>
                Pay once and get full access to Reading, Writing, Listening and Speaking modules.
              </p>
              <button
                onClick={() => router.push("/payment")}
                style={{ background: "#fff", color: "#0d2067", border: "none", borderRadius: 9999, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>payments</span>
                Pay NPR 499 – Unlock Now
              </button>
            </div>
          </div>
        )}

        {/* ── Welcome + CEFR ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#0d2067", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              Welcome back, {name}
            </p>
            <h2 style={{ fontFamily: H, fontSize: 32, fontWeight: 700, color: "#0d2067", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Dashboard
            </h2>
          </div>
          {paid && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#454651", marginBottom: 8 }}>Current Mastery</p>
              <div style={{ display: "flex", gap: 4 }}>
                {(["A1", "A2", "B1"] as const).map((level) => (
                  <div key={level} style={{ padding: "4px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: overallGrade === level ? "#346b00" : "transparent", color: overallGrade === level ? "#fff" : "#767682", border: overallGrade === level ? "none" : "1px solid #c6c5d2" }}>
                    {level}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Achievement card (only for paid users) ── */}
        {paid && (
          <div style={{ background: "#28387e", borderRadius: 12, padding: 20, position: "relative", overflow: "hidden", marginBottom: 24 }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 style={{ fontFamily: H, fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Weekly Goal: Complete All 7 Sets</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 14 }}>
                {setsAttempted.filter(Boolean).length === 7
                  ? "Amazing! You've completed all sets this week!"
                  : `${7 - setsAttempted.filter(Boolean).length} set${7 - setsAttempted.filter(Boolean).length === 1 ? "" : "s"} away from your goal!`}
              </p>
              <div style={{ width: "100%", background: "rgba(255,255,255,0.2)", height: 8, borderRadius: 9999, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#93d95e", borderRadius: 9999, width: `${weeklyPct}%`, transition: "width 0.6s ease" }} />
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>{weeklyPct}% complete</p>
            </div>
            <div style={{ position: "absolute", right: -16, top: -16, opacity: 0.08 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 120, color: "#fff", fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
          </div>
        )}

        {/* ── Full Exam card (paid users only) ── */}
        {paid && (
          <div
            onClick={() => router.push("/full-exam")}
            style={{ background: "linear-gradient(135deg, #0d2067, #1e40af)", borderRadius: 14, padding: 18, marginBottom: 20, cursor: "pointer", position: "relative", overflow: "hidden", border: "2px solid #3b82f6" }}>
            <div style={{ position: "absolute", right: -12, top: -12, opacity: 0.1 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 120, color: "#fff", fontVariationSettings: "'FILL' 1" }}>assignment</span>
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ background: "#abf374", color: "#367000", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 9999 }}>NEW</span>
                <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 9999 }}>PAID ONLY</span>
              </div>
              <h3 style={{ fontFamily: H, fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Full Practice Exam</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 14, lineHeight: 1.5 }}>
                Cambridge UpSkill pattern · 92 minutes · Listening, Reading, Writing & Speaking
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {[["hearing","25 min"],["menu_book","25 min"],["edit_note","30 min"],["record_voice_over","12 min"]].map(([icon, time]) => (
                  <div key={icon} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", gap: 5 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: "#fff" }}>{icon}</span>
                    <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{time}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", color: "#0d2067", borderRadius: 9999, padding: "10px 20px", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                Take Full Exam
              </div>
            </div>
          </div>
        )}

        {/* ── Section header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: H, fontSize: 22, fontWeight: 600, color: "#191c1d" }}>Practice Sets</h3>
          {!paid && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#dc2626", fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>lock</span>
              Locked
            </span>
          )}
        </div>

        {/* ── Bento grid ── */}
        <BentoGrid
          progress={progress}
          paid={paid}
          onSetClick={(id) => {
            if (!paid) {
              toast.error("Please complete payment to access practice sets.");
              router.push("/payment");
            } else {
              router.push(`/test/${id}`);
            }
          }}
        />
      </main>

      <BottomNav />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ── Bento Grid ─────────────────────────────────────── */
function BentoGrid({
  progress, paid, onSetClick,
}: {
  progress: Record<string, SetProgress>;
  paid: boolean;
  onSetClick: (id: number) => void;
}) {
  const setData = [
    { id: 1, label: "Academic Proficiency", featured: true },
    { id: 2, label: "Core Vocabulary" },
    { id: 3, label: "Grammar & Syntax" },
    { id: 4, label: "Listening Mastery" },
    { id: 5, label: "Care Communication", wide: true },
    { id: 6, label: "Public Speaking" },
    { id: 7, label: "Final Mock Test" },
  ];

  const modules = [
    { key: "writing",   icon: "edit_square" },
    { key: "reading",   icon: "menu_book" },
    { key: "listening", icon: "headset_mic" },
    { key: "speaking",  icon: "record_voice_over" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {setData.map((s) => {
        const sp = progress[`set${s.id}`] || {};
        const doneCount = [sp.reading !== undefined, sp.writing !== undefined, sp.listening !== undefined, sp.speaking].filter(Boolean).length;
        const allDone = doneCount === 4;
        const locked = !paid;

        const cardBase: React.CSSProperties = {
          background: "#fff",
          borderRadius: 12,
          cursor: "pointer",
          transition: "box-shadow 0.2s, transform 0.15s",
          border: "1px solid #c6c5d2",
          position: "relative",
          overflow: "hidden",
        };

        if (s.featured) {
          return (
            <div
              key={s.id}
              style={{ ...cardBase, gridColumn: "1 / -1", padding: 16, borderLeft: locked ? "4px solid #c6c5d2" : "4px solid #0d2067" }}
              onClick={() => onSetClick(s.id)}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(13,32,103,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              {locked && <LockOverlay />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ background: "rgba(13,32,103,0.06)", padding: "6px 8px", borderRadius: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: "#0d2067", fontSize: 20, fontVariationSettings: "'FILL' 1" }}>exercise</span>
                </div>
                <span style={{ background: allDone ? "#abf374" : "#dde1ff", color: allDone ? "#367000" : "#0d2067", padding: "3px 8px", borderRadius: 9999, fontSize: 10, fontWeight: 700 }}>
                  {allDone ? "COMPLETED" : paid ? "IN PROGRESS" : "LOCKED"}
                </span>
              </div>
              <h4 style={{ fontFamily: H, fontSize: 18, fontWeight: 600, color: "#0d2067", marginBottom: 4 }}>Practice Set 1</h4>
              <p style={{ fontSize: 13, color: "#454651", marginBottom: 14 }}>{s.label}</p>
              {paid && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
                    {modules.map((m) => (
                      <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 6, color: sp[m.key as keyof SetProgress] !== undefined ? "#0d2067" : "#767682" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{m.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>{m.key}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#f3f4f5", borderRadius: 6, height: 4 }}>
                    <div style={{ height: 4, borderRadius: 6, background: "#0d2067", width: `${(doneCount / 4) * 100}%` }} />
                  </div>
                </>
              )}
              <button style={{ marginTop: 14, width: "100%", background: locked ? "#e1e3e4" : "#0d2067", color: locked ? "#767682" : "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {locked ? "🔒 Unlock to Start" : allDone ? "Review Set" : doneCount > 0 ? "Continue Practice" : "Start Practice"}
              </button>
            </div>
          );
        }

        if (s.wide) {
          return (
            <div
              key={s.id}
              style={{ ...cardBase, gridColumn: "1 / -1", display: "flex" }}
              onClick={() => onSetClick(s.id)}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
            >
              {locked && <LockOverlay />}
              <div style={{ width: "35%", background: "linear-gradient(135deg, #dde1ff, #b9c3ff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#0d2067", opacity: 0.4, fontVariationSettings: "'FILL' 1" }}>menu_book</span>
              </div>
              <div style={{ padding: 16, flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#454651" }}>Set {s.id}</span>
                <h5 style={{ fontFamily: H, fontSize: 18, fontWeight: 600, color: "#0d2067", margin: "4px 0 6px" }}>{s.label}</h5>
                <p style={{ fontSize: 12, color: "#454651", lineHeight: 1.5 }}>Listening, reading and speaking for caregiving scenarios.</p>
              </div>
            </div>
          );
        }

        return (
          <div
            key={s.id}
            style={{ ...cardBase, padding: 16 }}
            onClick={() => onSetClick(s.id)}
            onMouseEnter={(e) => { if (!locked) e.currentTarget.style.borderColor = "#0d2067"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#c6c5d2"; }}
          >
            {locked && <LockOverlay />}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#454651" }}>Set {s.id}</span>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: locked ? "#c6c5d2" : allDone ? "#346b00" : "#c6c5d2", fontVariationSettings: (locked || !allDone) ? "'FILL' 0" : "'FILL' 1" }}>
                {locked ? "lock" : allDone ? "check_circle" : "radio_button_unchecked"}
              </span>
            </div>
            <h5 style={{ fontFamily: H, fontSize: 16, fontWeight: 600, color: "#0d2067", marginBottom: 10 }}>{s.label}</h5>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ height: 3, flex: 1, borderRadius: 9999, background: !locked && i < doneCount ? "#346b00" : "#e1e3e4" }} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Lock overlay ── */
function LockOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(248,249,250,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2, backdropFilter: "blur(1px)", borderRadius: 12,
    }}>
      <div style={{ background: "#fff", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#767682" }}>lock</span>
      </div>
    </div>
  );
}

/* ── Loading ── */
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: "4px solid #dde1ff", borderTopColor: "#0d2067", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#454651", fontSize: 14 }}>Loading your dashboard…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
