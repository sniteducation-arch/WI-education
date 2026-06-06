"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdToken } from "firebase/auth";
import { useAuth } from "@/components/AuthProvider";
import { FULL_EXAM_SECTIONS, TOTAL_EXAM_MINUTES } from "@/lib/full-exam-data";

const H = "'Manrope', system-ui, sans-serif";

export default function FullExamLanding() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [paid, setPaid] = useState<boolean | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    (async () => {
      try {
        const token = await getIdToken(user);
        const res = await fetch(`/api/user/me?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          setPaid(data.paid || false);
        }
      } catch { setPaid(false); }
    })();
  }, [authLoading, user, router]);

  if (paid === null) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "4px solid #dde1ff", borderTopColor: "#0d2067", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!paid) return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center", background: "#f8f9fa" }}>
      <span className="material-symbols-outlined" style={{ fontSize: 56, color: "#0d2067", marginBottom: 16, fontVariationSettings: "'FILL' 1" }}>lock</span>
      <h2 style={{ fontFamily: H, fontSize: 24, fontWeight: 700, color: "#0d2067", marginBottom: 10 }}>Full Exam — Paid Users Only</h2>
      <p style={{ fontSize: 15, color: "#454651", marginBottom: 28, maxWidth: 300, lineHeight: 1.6 }}>
        Purchase the Upskill Preparation for Students pack to unlock the full Cambridge UpSkill practice exam.
      </p>
      <button onClick={() => router.push("/payment")}
        style={{ background: "#0d2067", color: "#fff", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: H }}>
        Unlock — NPR 500
      </button>
      <button onClick={() => router.push("/dashboard")}
        style={{ marginTop: 12, background: "none", border: "none", cursor: "pointer", color: "#767682", fontSize: 14, fontWeight: 600 }}>
        Back to Dashboard
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh", background: "#f8f9fa" }}>
      {/* Header */}
      <header style={{ background: "#0d2067", padding: "20px 20px 24px" }}>
        <button onClick={() => router.push("/dashboard")}
          style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontFamily: "inherit" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Dashboard
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#abf374", fontVariationSettings: "'FILL' 1" }}>assignment</span>
          <h1 style={{ fontFamily: H, fontSize: 22, fontWeight: 800, color: "#fff" }}>Full Practice Exam</h1>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
          Cambridge UpSkill pattern · {TOTAL_EXAM_MINUTES} minutes · All 4 modules
        </p>
      </header>

      <div style={{ padding: "20px 20px 100px" }}>
        {/* Time + section overview */}
        <div style={{ background: "#fff8e1", border: "1.5px solid #fde68a", borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>schedule</span>
            Exam Duration: {TOTAL_EXAM_MINUTES} Minutes
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {FULL_EXAM_SECTIONS.map((sec) => (
              <div key={sec.id} style={{ background: sec.bg, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: sec.color }}>{sec.icon}</span>
                <div>
                  <p style={{ fontFamily: H, fontSize: 13, fontWeight: 700, color: sec.color }}>{sec.title}</p>
                  <p style={{ fontSize: 11, color: "#767682" }}>{sec.durationMinutes} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #c6c5d2", padding: 16, marginBottom: 20 }}>
          <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#0d2067", marginBottom: 12 }}>Before You Begin — Read Carefully</p>
          {[
            ["timer", "Once started, the exam timer cannot be paused or stopped."],
            ["block", "You cannot go back to a previous section once it is submitted."],
            ["wifi_off", "Do not close the browser tab or navigate away during the exam."],
            ["volume_off", "Find a quiet place with no distractions before starting."],
            ["headset_mic", "Listening passages are shown as transcripts (real test uses audio)."],
            ["edit_note", "Writing and speaking answers are self-assessed against a model answer."],
          ].map(([icon, text]) => (
            <div key={icon} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#dc2626", flexShrink: 0, marginTop: 1 }}>{icon}</span>
              <p style={{ fontSize: 13, color: "#454651", lineHeight: 1.5 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Official exam tips from CIIN */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #c6c5d2", padding: 16, marginBottom: 20 }}>
          <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#0d2067", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#0d2067" }}>lightbulb</span>
            Official Tips (from CIIN)
          </p>
          {[
            { label: "Reading", color: "#0d2067", tips: ["Look for capital letters and numbers — they are often the answer to Who/Where/When.", "Answer the easy ones first. Even if you don't know a word, guess from the surrounding text."] },
            { label: "Writing", color: "#7c3aed", tips: ["Keep it simple (Subject-Verb-Object). Example: I like my job. It is important.", "Use linking words: and, but, because, also, first, then.", "Address EVERY point in the prompt."] },
            { label: "Speaking", color: "#065f46", tips: ["Do NOT rush. Speak slowly and clearly.", "For READ ALOUD: follow punctuation — pause at commas, stop at full stops.", "For LONG TURN: answer ALL the points in the instruction."] },
            { label: "Listening", color: "#92400e", tips: ["Read the questions first, then listen for the answers.", "Be careful with words like 'Where' and 'When' before answering."] },
          ].map((sec) => (
            <div key={sec.label} style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: sec.color, marginBottom: 4 }}>{sec.label}</p>
              {sec.tips.map((tip, i) => (
                <p key={i} style={{ fontSize: 12, color: "#454651", lineHeight: 1.5, marginBottom: 3, paddingLeft: 12, borderLeft: `2px solid ${sec.color}22` }}>• {tip}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Section details */}
        <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#191c1d", marginBottom: 12 }}>What to Expect</p>
        {FULL_EXAM_SECTIONS.map((sec) => {
          const totalQ = sec.parts.reduce((s, p) => s + p.questions.length, 0);
          return (
            <div key={sec.id} style={{ background: "#fff", borderRadius: 12, border: `1px solid ${sec.bg}`, padding: 14, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: sec.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: sec.color }}>{sec.icon}</span>
                </div>
                <div>
                  <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: sec.color }}>{sec.title}</p>
                  <p style={{ fontSize: 12, color: "#767682" }}>{sec.durationMinutes} min · {sec.parts.length} parts · {totalQ} questions</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#454651", lineHeight: 1.5 }}>{sec.overview}</p>
            </div>
          );
        })}

        {/* Confirm checkbox */}
        <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12, padding: 14, marginBottom: 20, marginTop: 10 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)}
              style={{ marginTop: 2, accentColor: "#dc2626", width: 18, height: 18, flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#dc2626", lineHeight: 1.5 }}>
              I understand that once the exam starts I cannot pause, go back, or restart. I have {TOTAL_EXAM_MINUTES} minutes available right now.
            </span>
          </label>
        </div>

        <button
          onClick={() => setShowWarning(true)}
          disabled={!checked}
          style={{ width: "100%", background: checked ? "#0d2067" : "#e1e3e4", color: checked ? "#fff" : "#767682", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 16, fontWeight: 700, cursor: checked ? "pointer" : "not-allowed", fontFamily: H, boxShadow: checked ? "0 4px 14px rgba(13,32,103,0.25)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>assignment</span>
          Begin Full Exam
        </button>
      </div>

      {/* Final warning modal */}
      {showWarning && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth: 340, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#dc2626", fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h2 style={{ fontFamily: H, fontSize: 20, fontWeight: 800, color: "#191c1d", marginBottom: 10 }}>
              You cannot go back
            </h2>
            <p style={{ fontSize: 14, color: "#454651", lineHeight: 1.6, marginBottom: 20 }}>
              The exam will start immediately and run for <strong>{TOTAL_EXAM_MINUTES} minutes</strong>. Sections auto-advance when time runs out. Are you ready?
            </p>
            <button
              onClick={() => router.push("/full-exam/test")}
              style={{ width: "100%", background: "#dc2626", color: "#fff", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 10, fontFamily: H }}>
              Yes — Start Exam Now
            </button>
            <button
              onClick={() => setShowWarning(false)}
              style={{ width: "100%", background: "#f3f4f5", color: "#454651", border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: H }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
