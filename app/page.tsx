"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { isValidEmail, isValidPassword } from "@/lib/validate";

const H = { fontFamily: "'Manrope', system-ui, sans-serif" } as const;

async function handleGoogleUser(user: import("firebase/auth").User) {
  await fetch("/api/user/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid: user.uid, name: user.displayName || "", email: user.email || "", phone: "" }),
  });
  // Navigation handled by the auth-state redirect below
}

export default function AuthPage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Redirect authenticated users to dashboard (works for all sign-in methods)
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  // Handle redirect result when page loads (after signInWithRedirect)
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await handleGoogleUser(result.user);
        }
      })
      .catch((err: { code?: string; message?: string }) => {
        if (err.code && err.code !== "auth/popup-closed-by-user") {
          console.error("Redirect result error:", err.code, err.message);
        }
      });
  }, []);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#f8f9fa" }}>
      {/* Top bar */}
      <header style={{ background: "#fff", borderBottom: "1px solid #c6c5d2", height: 64, display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="MoralEdu Care" style={{ width: 40, height: 40, objectFit: "contain" }} />
        </div>
        <h1 style={{ ...H, fontSize: 20, fontWeight: 700, color: "#0d2067" }}>MoralEdu Care Upskill Prep</h1>
      </header>

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 20px 40px" }}>
        {/* Hero text */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ ...H, fontSize: 30, fontWeight: 800, color: "#0d2067", lineHeight: 1.25, marginBottom: 8 }}>
            Elevate Your Credentials
          </h2>
          <p style={{ fontSize: 15, color: "#454651", lineHeight: 1.6 }}>
            Prepare for the Cambridge UpSkill caregiver assessment with MoralEdu Care Upskill Prep.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", borderBottom: "1px solid #c6c5d2", marginBottom: 24 }}>
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "12px 0",
                fontSize: 17,
                fontWeight: 600,
                background: "none",
                border: "none",
                borderBottom: tab === t ? "2.5px solid #0d2067" : "2.5px solid transparent",
                color: tab === t ? "#0d2067" : "#767682",
                cursor: "pointer",
                marginBottom: -1,
                transition: "color 0.15s",
              }}
            >
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div style={{ background: "#fff", border: "1px solid #c6c5d2", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(13,32,103,0.06)" }}>
          {tab === "login" ? (
            <LoginForm onSwitch={() => setTab("signup")} />
          ) : (
            <SignupForm onSwitch={() => setTab("login")} />
          )}

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#e1e3e4" }} />
            <span style={{ fontSize: 12, color: "#767682", textTransform: "uppercase", letterSpacing: "0.05em" }}>or sign in with</span>
            <div style={{ flex: 1, height: 1, background: "#e1e3e4" }} />
          </div>

          {/* Social buttons */}
          <GoogleBtn router={router} />
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p style={{ fontSize: 12, color: "#767682", marginBottom: 10 }}>© 2026 MoralEdu Care. All Rights Reserved.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            <Link href="/terms" style={{ fontSize: 12, fontWeight: 700, color: "#0d2067" }}>Terms & Conditions</Link>
            <a href="mailto:info@moraleducare.edu.np" style={{ fontSize: 12, fontWeight: 700, color: "#0d2067" }}>Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Google Sign-In Button ────────────────────────────── */
function GoogleBtn({ router }: { router: ReturnType<typeof useRouter> }) {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      // Try popup first (works on desktop)
      const result = await signInWithPopup(auth, googleProvider);
      await handleGoogleUser(result.user);
      // redirect happens via the useEffect auth-state listener
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        // Fallback to redirect (works on mobile & when popups blocked)
        try {
          await signInWithRedirect(auth, googleProvider);
          // Page will reload; result handled in useEffect above
        } catch {
          toast.error("Google sign-in failed. Please try again.");
          setLoading(false);
        }
      } else if (code === "auth/operation-not-allowed") {
        toast.error("Google sign-in is not enabled yet. Please enable it in Firebase Console → Authentication → Sign-in method → Google.");
        setLoading(false);
      } else if (code === "auth/unauthorized-domain") {
        toast.error("This domain is not authorised. Add it in Firebase Console → Authentication → Settings → Authorised domains.");
        setLoading(false);
      } else {
        toast.error("Google sign-in failed. Please try again or use email and password.");
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleGoogle}
      disabled={loading}
      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "13px 16px", background: "#fff", border: "1px solid #c6c5d2", borderRadius: 9999, cursor: loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 700, color: "#191c1d", opacity: loading ? 0.7 : 1, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
    >
      {loading ? (
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#767682", animation: "spin 1s linear infinite" }}>sync</span>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      {loading ? "Signing in…" : "Continue with Gmail"}
    </button>
  );
}

/* ── Login Form ───────────────────────────────────────── */
function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) return toast.error("Please fill in all fields.");
    if (!isValidEmail(trimmedEmail)) return toast.error("Please enter a valid email address.");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
      toast.success("Welcome back!");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        // Check if it's a Google-only account
        try {
          const methods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
          if (methods.includes("google.com") && !methods.includes("password")) {
            toast.error("This account uses Google Sign-In. Please use 'Continue with Google' below.");
          } else {
            toast.error("Invalid email or password.");
          }
        } catch {
          toast.error("Invalid email or password.");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return toast.error("Enter your email first.");
    if (!isValidEmail(trimmed)) return toast.error("Please enter a valid email address.");
    try {
      await sendPasswordResetEmail(auth, trimmed);
      toast.success("Password reset email sent! Check your inbox.");
    } catch {
      toast.error("Could not send reset email. Check the address and try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Field icon="person" label="Email or Mobile" type="text" value={email} onChange={setEmail} placeholder="your@email.com" />
      <div>
        <FieldRaw icon="lock" label="Password" type={showPw ? "text" : "password"} value={password} onChange={setPassword} placeholder="••••••••"
          right={
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#767682" }}>{showPw ? "visibility_off" : "visibility"}</span>
            </button>
          }
        />
        <div style={{ textAlign: "right", marginTop: 6 }}>
          <button type="button" onClick={handleForgot} style={{ background: "none", border: "none", cursor: "pointer", color: "#0d2067", fontSize: 12, fontWeight: 700 }}>
            Forgot password?
          </button>
        </div>
      </div>
      <PrimaryBtn loading={loading} text="Log In" loadingText="Logging in…" />
      <p style={{ textAlign: "center", fontSize: 14, color: "#454651" }}>
        No account?{" "}
        <button type="button" onClick={onSwitch} style={{ background: "none", border: "none", cursor: "pointer", color: "#0d2067", fontWeight: 700, fontSize: 14 }}>Sign Up</button>
      </p>
    </form>
  );
}

/* ── Signup Form ──────────────────────────────────────── */
function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedFirst = firstName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFirst || !trimmedEmail || !trimmedPhone || !password) {
      return toast.error("Please fill in all fields.");
    }
    if (!isValidEmail(trimmedEmail)) {
      return toast.error("Please enter a valid email address.");
    }
    const pwCheck = isValidPassword(password);
    if (!pwCheck.ok) return toast.error(pwCheck.message);
    if (!/^[0-9]{9,10}$/.test(trimmedPhone.replace(/[\s\-()]/g, ""))) {
      return toast.error("Please enter a valid 9–10 digit phone number.");
    }
    if (!agreed) return toast.error("Please accept the Terms & Conditions.");

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const fullName = `${trimmedFirst} ${lastName.trim()}`.trim();
      await updateProfile(cred.user, { displayName: fullName });
      await fetch("/api/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: cred.user.uid, name: fullName, email: trimmedEmail, phone: trimmedPhone }),
      });
      toast.success(`Welcome, ${trimmedFirst}! Your account is ready.`);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        // Detect if it's a Google account and guide user
        try {
          const methods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
          if (methods.includes("google.com")) {
            toast.error("This email is linked to a Google account. Use 'Continue with Google' below to sign in.");
          } else {
            toast.error("Email already registered. Please log in instead.");
          }
        } catch {
          toast.error("Email already registered. Please log in instead.");
        }
      } else if (code === "auth/weak-password") {
        toast.error("Password is too weak. Use at least 8 characters with a number.");
      } else {
        toast.error("Sign up failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <SmallField label="First Name" value={firstName} onChange={setFirstName} placeholder="John" />
        <SmallField label="Last Name" value={lastName} onChange={setLastName} placeholder="Doe" />
      </div>
      <Field icon="mail" label="Email Address" type="email" value={email} onChange={setEmail} placeholder="john@example.com" />
      <div>
        <label style={labelSt}>Mobile Phone</label>
        <div style={{ display: "flex" }}>
          <span style={{ display: "flex", alignItems: "center", padding: "0 12px", background: "#f3f4f5", border: "1px solid #c6c5d2", borderRight: "none", borderRadius: "8px 0 0 8px", fontSize: 14, fontWeight: 700, color: "#191c1d", whiteSpace: "nowrap" }}>
            +977
          </span>
          <input type="tel" placeholder="98XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)}
            style={{ flex: 1, border: "1px solid #c6c5d2", borderLeft: "none", borderRadius: "0 8px 8px 0", padding: "13px 14px", fontSize: 15, outline: "none", background: "#f8f9fa", color: "#191c1d" }} />
        </div>
      </div>
      <Field icon="lock" label="Create Password" type="password" value={password} onChange={setPassword} placeholder="Min. 8 chars + 1 number" />
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginTop: 2 }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
          style={{ marginTop: 3, accentColor: "#0d2067", width: 16, height: 16, flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: "#454651", lineHeight: 1.5 }}>
          I agree to the{" "}
          <Link href="/terms" target="_blank" style={{ color: "#0d2067", fontWeight: 700 }}>Terms of Service</Link>
          {" "}and{" "}
          <Link href="/terms" target="_blank" style={{ color: "#0d2067", fontWeight: 700 }}>Privacy Policy</Link>.
        </span>
      </label>
      <PrimaryBtn loading={loading} text="Create Free Account" loadingText="Creating…" color="#346b00" />
      <p style={{ textAlign: "center", fontSize: 14, color: "#454651" }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} style={{ background: "none", border: "none", cursor: "pointer", color: "#0d2067", fontWeight: 700, fontSize: 14 }}>Log In</button>
      </p>
    </form>
  );
}

/* ── Shared field components ──────────────────────────── */
const labelSt: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "#454651", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" };
const wrapSt: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, background: "#f8f9fa", border: "1px solid #c6c5d2", borderRadius: 8, padding: "13px 14px" };
const inSt: React.CSSProperties = { flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 15, color: "#191c1d" };

function Field({ icon, label, type, value, onChange, placeholder }: { icon: string; label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label style={labelSt}>{label}</label>
      <div style={wrapSt}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#767682", flexShrink: 0 }}>{icon}</span>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inSt} />
      </div>
    </div>
  );
}

function FieldRaw({ icon, label, type, value, onChange, placeholder, right }: { icon: string; label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string; right?: React.ReactNode }) {
  return (
    <div>
      <label style={labelSt}>{label}</label>
      <div style={wrapSt}>
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#767682", flexShrink: 0 }}>{icon}</span>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inSt} />
        {right}
      </div>
    </div>
  );
}

function SmallField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label style={labelSt}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: "#f8f9fa", border: "1px solid #c6c5d2", borderRadius: 8, padding: "13px 14px", fontSize: 15, color: "#191c1d", outline: "none" }} />
    </div>
  );
}

function PrimaryBtn({ loading, text, loadingText, color = "#0d2067" }: { loading: boolean; text: string; loadingText: string; color?: string }) {
  return (
    <button type="submit" disabled={loading}
      style={{ width: "100%", background: loading ? "#c6c5d2" : color, color: "#fff", border: "none", borderRadius: 9999, padding: "15px 0", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : `0 4px 14px ${color}55`, transition: "all 0.2s", marginTop: 4 }}>
      {loading ? loadingText : text}
    </button>
  );
}
