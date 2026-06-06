"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setEmail(user.email || "");
    if (user.emailVerified) router.push("/payment");
  }, [authLoading, user, router]);

  const checkVerification = async () => {
    setChecking(true);
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      toast.success("Email verified! Redirectingâ€¦");
      router.push("/payment");
    } else {
      toast.error("Not yet verified. Check your inbox.");
    }
    setChecking(false);
  };

  const resendEmail = async () => {
    if (!auth.currentUser) return;
    setResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email resent!");
    } catch {
      toast.error("Please wait before resending.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      {/* Top bar */}
      <header style={{ background: "#fff", borderBottom: "1px solid #c6c5d2", height: 64, display: "flex", alignItems: "center", paddingLeft: 20, gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="WI Upskill" style={{ width: 40, height: 40, objectFit: "contain" }} />
        </div>
        <h1 style={{ fontFamily: "'Libre Caslon Text', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#000b21" }}>WI Upskill Mock Test</h1>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" }}>
        {/* Icon */}
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dde1ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#0d2067", fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
        </div>

        <h2 style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 28, fontWeight: 700, color: "#0d2067", marginBottom: 12 }}>Check Your Email</h2>
        <p style={{ fontSize: 15, color: "#454651", lineHeight: 1.6, marginBottom: 6 }}>
          We sent a verification link to:
        </p>
        <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 700, color: "#191c1d", fontSize: 16, marginBottom: 28 }}>{email}</p>
        <p style={{ fontSize: 13, color: "#454651", lineHeight: 1.6, marginBottom: 36, maxWidth: 300 }}>
          Click the link in the email, then press the button below to continue.
        </p>

        <button
          onClick={checkVerification}
          disabled={checking}
          style={{ width: "100%", maxWidth: 340, background: checking ? "#95a5f2" : "#0d2067", color: "#fff", border: "none", borderRadius: 9999, padding: "16px 0", fontSize: 17, fontWeight: 700, cursor: checking ? "not-allowed" : "pointer", marginBottom: 12, boxShadow: checking ? "none" : "0 4px 14px rgba(13,32,103,0.25)", fontFamily: "inherit" }}
        >
          {checking ? "Checkingâ€¦" : "I've Verified My Email"}
        </button>

        <button
          onClick={resendEmail}
          disabled={resending}
          style={{ width: "100%", maxWidth: 340, background: "#fff", color: "#0d2067", border: "1px solid #c6c5d2", borderRadius: 9999, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: resending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
          {resending ? "Sendingâ€¦" : "Resend Email"}
        </button>

        <p style={{ marginTop: 24, fontSize: 12, color: "#767682" }}>
          Check your spam/junk folder if you don&apos;t see it.
        </p>
      </div>
    </div>
  );
}


