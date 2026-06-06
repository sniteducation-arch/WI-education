"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import toast from "react-hot-toast";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());
const H = "'Manrope', system-ui, sans-serif";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) await checkAndRoute(result.user.email || "");
    }).catch(() => {});

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setLoading(false); return; }
      await checkAndRoute(user.email || "");
    });
    return () => unsub();
  }, [router]);

  const checkAndRoute = async (email: string) => {
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
      router.push("/admin/dashboard");
    } else if (email) {
      toast.error("This Gmail is not authorised as admin.");
      await signOut(auth);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSigning(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await checkAndRoute(result.user.email || "");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-blocked") {
        await signInWithRedirect(auth, googleProvider);
      } else if (code !== "auth/popup-closed-by-user") {
        toast.error("Sign-in failed. Try again.");
        setSigning(false);
      } else {
        setSigning(false);
      }
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "4px solid #dde1ff", borderTopColor: "#0d2067", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0d2067", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 36, width: "100%", maxWidth: 360, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/moral-logo.png" alt="Moral Educare" style={{ width: 56, height: 56, objectFit: "contain" }} />
        </div>
        <h1 style={{ fontFamily: H, fontSize: 22, fontWeight: 700, color: "#0d2067", marginBottom: 6 }}>Admin Portal</h1>
        <p style={{ fontSize: 13, color: "#454651", marginBottom: 28 }}>Upskill Prep · Payment Approvals</p>

        <button
          onClick={handleGoogleLogin}
          disabled={signing}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 20px", background: signing ? "#f3f4f5" : "#fff", border: "1px solid #c6c5d2", borderRadius: 9999, cursor: signing ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 700, color: "#191c1d", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", fontFamily: "inherit" }}
        >
          {signing ? (
            <span className="material-symbols-outlined" style={{ fontSize: 20, animation: "spin 1s linear infinite" }}>sync</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {signing ? "Signing in…" : "Sign in with Gmail"}
        </button>

        <p style={{ fontSize: 11, color: "#767682", marginTop: 20 }}>Only authorised admin emails can access this portal.</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
