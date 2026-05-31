"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SignupForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !phone || !password) return toast.error("Please fill in all fields.");
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (!agreed) return toast.error("Please accept the Terms & Conditions.");

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const fullName = `${firstName} ${lastName}`.trim();
      await updateProfile(cred.user, { displayName: fullName });
      await sendEmailVerification(cred.user);
      await setDoc(doc(db, "users", cred.user.uid), {
        name: fullName,
        email,
        phone,
        paid: false,
        createdAt: serverTimestamp(),
      });
      toast.success("Verification email sent! Check your inbox.");
      router.push("/verify-email");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        toast.error("Email already registered. Please log in.");
      } else {
        toast.error("Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Name row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>First Name</label>
          <input
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={fullInputStyle}
            autoComplete="given-name"
          />
        </div>
        <div>
          <label style={labelStyle}>Last Name</label>
          <input
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={fullInputStyle}
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>Email Address</label>
        <div style={inputWrap}>
          <span className="material-symbols-outlined" style={iconStyle}>mail</span>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Phone with +977 prefix */}
      <div>
        <label style={labelStyle}>Mobile Phone</label>
        <div style={{ display: "flex" }}>
          <span style={{ display: "flex", alignItems: "center", padding: "0 12px", background: "#f3f4f5", border: "1px solid #c6c5d2", borderRight: "none", borderRadius: "8px 0 0 8px", fontSize: 14, fontWeight: 700, color: "#191c1d" }}>
            +977
          </span>
          <input
            type="tel"
            placeholder="98XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ ...fullInputStyle, borderRadius: "0 8px 8px 0", flex: 1, margin: 0 }}
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label style={labelStyle}>Create Password</label>
        <div style={inputWrap}>
          <span className="material-symbols-outlined" style={iconStyle}>lock</span>
          <input
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            autoComplete="new-password"
          />
        </div>
      </div>

      {/* Terms */}
      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ marginTop: 3, accentColor: "#0d2067", width: 16, height: 16, flexShrink: 0 }}
        />
        <span style={{ fontSize: 13, color: "#454651", lineHeight: 1.5 }}>
          I agree to the{" "}
          <Link href="/terms" target="_blank" style={{ color: "#0d2067", fontWeight: 700 }}>Terms of Service</Link>
          {" "}and{" "}
          <Link href="/terms" target="_blank" style={{ color: "#0d2067", fontWeight: 700 }}>Privacy Policy</Link>.
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          background: loading ? "#93d95e" : "#346b00",
          color: "#fff",
          border: "none",
          borderRadius: 9999,
          padding: "16px 0",
          fontSize: 18,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 4px 12px rgba(52,107,0,0.25)",
          transition: "all 0.2s",
          fontFamily: "inherit",
          marginTop: 4,
        }}
      >
        {loading ? "Creating account…" : "Create Account – NPR 499"}
      </button>

      <p style={{ textAlign: "center", color: "#454651", fontSize: 14 }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToLogin} style={{ color: "#0d2067", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          Log In
        </button>
      </p>
    </form>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "#454651", marginBottom: 6, marginLeft: 4, textTransform: "uppercase", letterSpacing: "0.04em" };
const inputWrap: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, background: "#f8f9fa", border: "1px solid #c6c5d2", borderRadius: 8, padding: "14px 14px" };
const inputStyle: React.CSSProperties = { flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 16, color: "#191c1d", fontFamily: "inherit" };
const fullInputStyle: React.CSSProperties = { width: "100%", background: "#f8f9fa", border: "1px solid #c6c5d2", borderRadius: 8, padding: "14px 14px", fontSize: 16, color: "#191c1d", outline: "none", fontFamily: "inherit" };
const iconStyle: React.CSSProperties = { fontSize: 20, color: "#767682", flexShrink: 0 };
