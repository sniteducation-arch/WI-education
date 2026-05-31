"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

interface ModuleResult {
  reading?: number;
  readingGrade?: string;
  writing?: number;
  writingGrade?: string;
  listening?: number;
  listeningGrade?: string;
  speaking?: boolean;
}

const gradeColor = (g?: string) => {
  if (g === "B1") return "#346b00";
  if (g === "A2") return "#92400e";
  return "#dc2626";
};

const pctToGrade = (pct?: number): string => {
  if (pct === undefined) return "â€”";
  if (pct >= 75) return "B1";
  if (pct >= 50) return "A2";
  return "A1";
};

export default function TranscriptPage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [progress, setProgress] = useState<Record<string, ModuleResult>>({});
  const [loading, setLoading] = useState(true);
  const [date] = useState(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setName(user.displayName || "Student");
    setEmail(user.email || "");
    (async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setProgress(snap.data().progress || {});
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
  });
  const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null;
  const overallGrade = avgScore !== null ? pctToGrade(avgScore) : null;

  return (
    <div style={{ minHeight: "100dvh", background: "#f8f9fa" }}>
      <TopBar title="Results" />
      <main style={{ paddingTop: 80, paddingBottom: 100, paddingLeft: 20, paddingRight: 20 }}>

        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 32, fontWeight: 700, color: "#0d2067", letterSpacing: "-0.02em", marginBottom: 4 }}>Score Transcript</h2>
          <p style={{ fontSize: 13, color: "#454651" }}>MoralEdu Care Upskill Prep · {date}</p>
        </section>

        {/* Student identity card */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: 18, marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #0d2067, #4a59a1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "ME"}
          </div>
          <div>
            <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 16, fontWeight: 700, color: "#191c1d" }}>{name}</p>
            <p style={{ fontSize: 13, color: "#454651" }}>{email}</p>
            <p style={{ fontSize: 12, color: "#767682", marginTop: 2 }}>Report generated: {date}</p>
          </div>
        </div>

        {/* Overall grade card */}
        {overallGrade && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: 18, marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: gradeColor(overallGrade), display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 800, fontSize: 22, flexShrink: 0 }}>
              {overallGrade}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: "#454651", marginBottom: 2 }}>Overall CEFR Level</p>
              <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 20, fontWeight: 700, color: "#191c1d" }}>
                {overallGrade === "B1" ? "Intermediate" : overallGrade === "A2" ? "Elementary" : "Beginner"}
              </p>
              <p style={{ fontSize: 14, color: "#454651" }}>Average score: {avgScore}% across {allScores.length} module{allScores.length !== 1 ? "s" : ""}</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: gradeColor(overallGrade), fontVariationSettings: "'FILL' 1" }}>military_tech</span>
          </div>
        )}

        {/* Trajectory note */}
        {overallGrade && (
          <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8, alignItems: "center", marginBottom: 24 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#346b00", fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            <p style={{ fontSize: 13, color: "#166534" }}>
              Your current trajectory points toward a <strong>{overallGrade} level</strong> on the Cambridge UpSkill Assessment.
            </p>
          </div>
        )}

        {/* Per-set breakdown */}
        <h2 style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 18, fontWeight: 600, color: "#191c1d", marginBottom: 14 }}>Set-by-Set Breakdown</h2>

        {sets.map((s) => {
          const p: ModuleResult = progress[`set${s}`] || {};
          const has = p.reading !== undefined || p.writing !== undefined || p.listening !== undefined || p.speaking;
          return (
            <div key={s} style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: 16, marginBottom: 10, opacity: has ? 1 : 0.55 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 16, fontWeight: 700, color: "#0d2067" }}>Practice Set {s}</p>
                {!has && <span style={{ fontSize: 11, color: "#767682", background: "#f3f4f5", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>NOT STARTED</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Reading",   pct: p.reading,   g: p.readingGrade },
                  { label: "Writing",   pct: p.writing,   g: p.writingGrade },
                  { label: "Listening", pct: p.listening, g: p.listeningGrade },
                ].map(({ label, pct, g }) => {
                  const grade = g || (pct !== undefined ? pctToGrade(pct) : undefined);
                  return (
                    <div key={label} style={{ background: pct !== undefined ? "#f0f9ff" : "#f8f9fa", borderRadius: 8, padding: "10px 12px", border: `1.5px solid ${pct !== undefined ? "#bae6fd" : "#e1e3e4"}` }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#454651", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
                      <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 20, fontWeight: 800, color: pct !== undefined ? gradeColor(grade) : "#c6c5d2", marginTop: 2 }}>{grade || "â€”"}</p>
                      {pct !== undefined && <p style={{ fontSize: 11, color: "#454651" }}>{pct}%</p>}
                    </div>
                  );
                })}
                <div style={{ background: p.speaking ? "#f0fdf4" : "#f8f9fa", borderRadius: 8, padding: "10px 12px", border: `1.5px solid ${p.speaking ? "#bbf7d0" : "#e1e3e4"}` }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#454651", textTransform: "uppercase", letterSpacing: "0.04em" }}>Speaking</p>
                  <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 20, fontWeight: 800, color: p.speaking ? "#346b00" : "#c6c5d2", marginTop: 2 }}>{p.speaking ? "âœ“" : "â€”"}</p>
                  {p.speaking && <p style={{ fontSize: 11, color: "#346b00" }}>Practiced</p>}
                </div>
              </div>
            </div>
          );
        })}

        {/* Disclaimer */}
        <div style={{ background: "#fef3c7", border: "1.5px solid #fde68a", borderRadius: 12, padding: 14, marginTop: 8 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#92400e", flexShrink: 0, marginTop: 1, fontVariationSettings: "'wght' 300" }}>info</span>
            <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
              <strong>Disclaimer:</strong> These scores are for practice purposes only. They do not represent official Cambridge UpSkill Assessment results and do not guarantee any grade in the actual examination.
            </p>
          </div>
        </div>
        <div style={{ height: 16 }} />
      </main>
      <BottomNav />
    </div>
  );
}


