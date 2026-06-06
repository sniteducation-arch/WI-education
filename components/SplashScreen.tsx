"use client";
import { useEffect, useState } from "react";

const H = { fontFamily: "'Manrope', system-ui, sans-serif" } as const;

export default function SplashScreen() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    // Start exit after content has had time to render
    const exit = setTimeout(() => setPhase("out"), 1800);
    // Remove from DOM after fade-out completes
    const done = setTimeout(() => setPhase("done"), 2280);
    return () => { clearTimeout(exit); clearTimeout(done); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={phase === "out" ? "splash-exit" : ""}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "linear-gradient(160deg, #0d2067 0%, #1a3499 60%, #0d2067 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Subtle radial glow behind logo */}
      <div style={{
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div
        className="splash-logo"
        style={{
          width: 96,
          height: 96,
          borderRadius: 24,
          overflow: "hidden",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
          marginBottom: 24,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="WI Upskill" style={{ width: 76, height: 76, objectFit: "contain" }} />
      </div>

      {/* App name */}
      <h1
        className="splash-title"
        style={{
          ...H,
          fontSize: 22,
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-0.01em",
          marginBottom: 8,
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        WI Upskill
      </h1>

      {/* Tagline */}
      <p
        className="splash-tagline"
        style={{
          fontSize: 13,
          color: "#ffffff",
          textAlign: "center",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        WI Education · Cambridge UpSkill
      </p>

      {/* Bottom loading dots */}
      <div style={{ position: "absolute", bottom: 56, display: "flex", gap: 7 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.5)",
              animation: `splash-tagline-in 0.6s ease-out ${0.9 + i * 0.15}s both`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
