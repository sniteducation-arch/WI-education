"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import toast from "react-hot-toast";

const CASLON: React.CSSProperties = { fontFamily: "'Libre Caslon Text', Georgia, serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };

async function handleGoogleUser(user: import("firebase/auth").User) {
  await fetch("/api/user/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid: user.uid, name: user.displayName || "", email: user.email || "", phone: "" }),
  });
}

export default function AuthPage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.push("/dashboard");
  }, [user, authLoading, router]);

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) await handleGoogleUser(result.user);
      })
      .catch((err: { code?: string }) => {
        if (err.code && err.code !== "auth/popup-closed-by-user") {
          toast.error("Sign-in failed. Please try again.");
        }
      });
  }, []);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleGoogleUser(result.user);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch {
          toast.error("Sign-in failed. Please try again.");
          setLoading(false);
        }
      } else if (code === "auth/unauthorized-domain") {
        toast.error("Domain not authorised. Contact support.");
        setLoading(false);
      } else {
        toast.error("Sign-in failed. Please try again.");
        setLoading(false);
      }
    }
  };

  if (authLoading) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fbf9f8" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #eae8e7", borderTopColor: "#000b21", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#fbf9f8" }}>

      {/* Header */}
      <header style={{ width: "100%", height: 96, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #c4c6ce", background: "#fbf9f8", flexShrink: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="WI Upskill" style={{ height: 48, width: "auto", objectFit: "contain", marginBottom: 8 }} />
          <span style={{ ...CASLON, fontSize: 22, fontWeight: 700, color: "#000b21", letterSpacing: "0.04em" }}>WI UPSKILL</span>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

          {/* Card */}
          <div style={{ width: "100%", background: "#fff", border: "1px solid #c4c6ce", padding: "40px 32px", textAlign: "center" }}>
            <h1 style={{ ...CASLON, fontSize: 26, fontWeight: 700, color: "#000b21", marginBottom: 8 }}>
              Academic Portal
            </h1>
            <p style={{ ...INTER, fontSize: 13, color: "#44474e", lineHeight: 1.6, marginBottom: 36 }}>
              IELTS Mock Test Practice &mdash; A1 to B1
            </p>

            {/* Google Button */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "16px 20px",
                background: loading ? "#f5f3f3" : "#fff",
                border: "1px solid #c4c6ce",
                borderRadius: 0,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "#f5f3f3"; e.currentTarget.style.borderColor = "#000b21"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#c4c6ce"; }}
            >
              {loading ? (
                <>
                  <div style={{ width: 20, height: 20, border: "2px solid #eae8e7", borderTopColor: "#000b21", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                  <span style={{ ...INTER, fontSize: 14, fontWeight: 600, color: "#44474e", letterSpacing: "0.04em" }}>Signing in…</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span style={{ ...INTER, fontSize: 14, fontWeight: 600, color: "#000b21", letterSpacing: "0.04em" }}>Continue with Gmail</span>
                </>
              )}
            </button>

            <p style={{ ...INTER, fontSize: 11, color: "#75777e", marginTop: 20, lineHeight: 1.6 }}>
              By continuing, you agree to our{" "}
              <Link href="/terms" style={{ color: "#775a19", fontWeight: 600 }}>Terms & Conditions</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: "24px 20px", borderTop: "1px solid #c4c6ce", background: "#fff", textAlign: "center" }}>
        <p style={{ ...INTER, fontSize: 11, color: "#75777e" }}>
          WI Education Global Pvt. Ltd. &nbsp;&middot;&nbsp;{" "}
          <a href="mailto:snit.education@gmail.com" style={{ color: "#44474e" }}>snit.education@gmail.com</a>
        </p>
      </footer>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
