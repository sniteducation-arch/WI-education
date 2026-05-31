"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function LoginForm({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const router = useRouter();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credential || !password) return toast.error("Please fill in all fields.");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, credential, password);
      if (!cred.user.emailVerified) {
        toast.error("Please verify your email first.");
        router.push("/verify-email");
        return;
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        toast.error("Invalid email or password.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!credential) return toast.error("Enter your email first.");
    try {
      await sendPasswordResetEmail(auth, credential);
      toast.success("Password reset email sent!");
    } catch {
      toast.error("Could not send reset email.");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Email / Phone */}
      <div>
        <label style={labelStyle}>Email or Mobile Number</label>
        <div style={inputWrap}>
          <span className="material-symbols-outlined" style={iconStyle}>person</span>
          <input
            type="text"
            placeholder="Enter your credentials"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            style={inputStyle}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label style={labelStyle}>Password</label>
        <div style={inputWrap}>
          <span className="material-symbols-outlined" style={iconStyle}>lock</span>
          <input
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            autoComplete="current-password"
          />
          <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <span className="material-symbols-outlined" style={{ ...iconStyle, marginRight: 0 }}>
              {showPw ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
          <button type="button" onClick={handleForgotPassword} style={{ background: "none", border: "none", cursor: "pointer", color: "#0d2067", fontSize: 12, fontWeight: 700, padding: 0 }}>
            Forgot password?
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          background: loading ? "#95a5f2" : "#0d2067",
          color: "#fff",
          border: "none",
          borderRadius: 9999,
          padding: "16px 0",
          fontSize: 18,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 4px 12px rgba(13,32,103,0.25)",
          transition: "all 0.2s",
          fontFamily: "inherit",
        }}
      >
        {loading ? "Logging in…" : "Log In"}
      </button>

      <p style={{ textAlign: "center", color: "#454651", fontSize: 14, marginTop: 4 }}>
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitchToSignup} style={{ color: "#0d2067", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          Sign Up
        </button>
      </p>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#454651",
  marginBottom: 6,
  marginLeft: 4,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};
const inputWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#f8f9fa",
  border: "1px solid #c6c5d2",
  borderRadius: 8,
  padding: "14px 14px",
  transition: "border-color 0.15s",
};
const inputStyle: React.CSSProperties = {
  flex: 1,
  border: "none",
  background: "transparent",
  outline: "none",
  fontSize: 16,
  color: "#191c1d",
  fontFamily: "inherit",
};
const iconStyle: React.CSSProperties = {
  fontSize: 20,
  color: "#767682",
  flexShrink: 0,
};
