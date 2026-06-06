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

const CASLON: React.CSSProperties = { fontFamily: "'Libre Caslon Text', Georgia, serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };
const LABEL: React.CSSProperties = { ...INTER, display: "block", fontSize: 12, fontWeight: 600, color: "#44474e", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" };
const INPUT: React.CSSProperties = { width: "100%", padding: "16px", background: "transparent", border: "1px solid #75777e", outline: "none", fontSize: 15, color: "#000b21", borderRadius: 0, fontFamily: "'Inter', system-ui, sans-serif" };
const BTN: React.CSSProperties = { ...INTER, width: "100%", background: "#000b21", color: "#fff", border: "none", borderRadius: 0, padding: "16px 0", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textTransform: "uppercase" };

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
  const [tab, setTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (!authLoading && user) router.push("/dashboard");
  }, [user, authLoading, router]);

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) await handleGoogleUser(result.user);
      })
      .catch((err: { code?: string; message?: string }) => {
        if (err.code && err.code !== "auth/popup-closed-by-user") {
          console.error("Redirect result error:", err.code, err.message);
        }
      });
  }, []);

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#fbf9f8" }}>
      {/* Header */}
      <header style={{ width: "100%", height: 96, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #c4c6ce", background: "#fbf9f8", flexShrink: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="WI Upskill" style={{ height: 48, width: "auto", objectFit: "contain", marginBottom: 8 }} />
          <span style={{ ...CASLON, fontSize: 22, fontWeight: 700, color: "#000b21", letterSpacing: "0.04em" }}>UPSKILL</span>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 20px 40px" }}>
        <div style={{ width: "100%", maxWidth: 448, background: "#ffffff", border: "1px solid #c4c6ce", padding: "28px 24px", position: "relative" }}>
          {/* Watermark */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.03, pointerEvents: "none", overflow: "hidden" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 280, color: "#000b21" }}>school</span>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <h1 style={{ ...CASLON, fontSize: 30, fontWeight: 600, color: "#000b21", textAlign: "center", marginBottom: 28, lineHeight: 1.25 }}>
              Academic Portal
            </h1>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #c4c6ce", marginBottom: 32 }}>
              {(["login", "signup"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, padding: "14px 0", ...INTER,
                    fontSize: 12, fontWeight: 600, letterSpacing: "0.1em",
                    background: "none", border: "none",
                    borderBottom: tab === t ? "2px solid #775a19" : "2px solid transparent",
                    color: tab === t ? "#000b21" : "#44474e",
                    cursor: "pointer", marginBottom: -1,
                    textTransform: "uppercase" as const, transition: "color 0.15s",
                  }}
                >
                  {t === "login" ? "LOG IN" : "SIGN UP"}
                </button>
              ))}
            </div>

            {tab === "login" ? <LoginForm onSwitch={() => setTab("signup")} /> : <SignupForm onSwitch={() => setTab("login")} />}

            {/* Divider */}
            <div style={{ position: "relative", margin: "32px 0 24px" }}>
              <div style={{ borderTop: "1px solid #c4c6ce" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#ffffff", padding: "0 14px" }}>
                <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#44474e", letterSpacing: "0.1em", textTransform: "uppercase" as const, whiteSpace: "nowrap" }}>OR CONTINUE WITH</span>
              </div>
            </div>

            {/* Gmail hint badge */}
            <div style={{ marginBottom: 10, textAlign: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#fed488", color: "#785a1a", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", padding: "3px 10px", borderRadius: 9999 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>auto_awesome</span>
                EASIEST WAY IS VIA GMAIL
              </span>
            </div>

            {/* Social buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <GoogleBtn router={router} />
              <EsewaBtn />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: "32px 20px", borderTop: "1px solid #c4c6ce", background: "#ffffff" }}>
        <div style={{ maxWidth: 448, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: "#000b21" }}>verified_user</span>
            <div>
              <p style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#000b21", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>LEGACY OF EXCELLENCE</p>
              <p style={{ ...INTER, fontSize: 12, color: "#44474e" }}>Securing your academic journey</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const, justifyContent: "center" }}>
            <Link href="/terms" style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#44474e", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>PRIVACY POLICY</Link>
            <Link href="/terms" style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#44474e", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>TERMS OF SERVICE</Link>
            <a href="mailto:snit.education@gmail.com" style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#44474e", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>SUPPORT</a>
          </div>
        </div>
      </footer>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ── Google Sign-In Button ─────────────────────────────── */
function GoogleBtn({ router }: { router: ReturnType<typeof useRouter> }) {
  const [loading, setLoading] = useState(false);

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
          toast.error("Google sign-in failed. Please try again.");
          setLoading(false);
        }
      } else if (code === "auth/operation-not-allowed") {
        toast.error("Google sign-in is not enabled yet. Enable it in Firebase Console.");
        setLoading(false);
      } else if (code === "auth/unauthorized-domain") {
        toast.error("This domain is not authorised. Add it in Firebase Console.");
        setLoading(false);
      } else {
        toast.error("Google sign-in failed. Please try again.");
        setLoading(false);
      }
    }
  };

  void router;

  return (
    <button
      onClick={handleGoogle}
      disabled={loading}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", background: "#fff", border: "1px solid #c4c6ce", borderRadius: 0, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "background 0.15s" }}
      onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#f5f3f3"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
    >
      {loading ? (
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#75777e", animation: "spin 1s linear infinite" }}>sync</span>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      )}
      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: "#000b21", letterSpacing: "0.08em" }}>GOOGLE</span>
    </button>
  );
}

/* ── eSewa Button ──────────────────────────────────────── */
function EsewaBtn() {
  return (
    <button
      onClick={() => toast("Sign in with Google or email first, then go to Payments to pay via eSewa.")}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", background: "#fff", border: "1px solid #c4c6ce", borderRadius: 0, cursor: "pointer", transition: "background 0.15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f3f3"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
    >
      <div style={{ width: 18, height: 18, background: "#60bb46", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1 }}>e</span>
      </div>
      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: "#000b21", letterSpacing: "0.08em" }}>ESEWA</span>
    </button>
  );
}

/* ── Login Form ────────────────────────────────────────── */
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
      toast.success("Password reset email sent!");
    } catch {
      toast.error("Could not send reset email.");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label style={LABEL}>EMAIL OR MOBILE</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. scholar@university.edu" style={INPUT} />
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ ...LABEL, marginBottom: 0 }}>PASSWORD</label>
          <button type="button" onClick={handleForgot} style={{ ...INTER, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, color: "#775a19", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>FORGOT PASSWORD?</button>
        </div>
        <div style={{ position: "relative" }}>
          <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ ...INPUT, paddingRight: 48 }} />
          <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#44474e" }}>{showPw ? "visibility_off" : "visibility"}</span>
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} style={{ ...BTN, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "SIGNING IN…" : <>{`SECURE ACCESS `}<span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span></>}
      </button>
      <p style={{ ...INTER, textAlign: "center", fontSize: 13, color: "#44474e" }}>
        No account?{" "}
        <button type="button" onClick={onSwitch} style={{ ...INTER, background: "none", border: "none", cursor: "pointer", color: "#775a19", fontWeight: 700, fontSize: 13 }}>Sign Up</button>
      </p>
    </form>
  );
}

/* ── Signup Form ───────────────────────────────────────── */
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
    if (!trimmedFirst || !trimmedEmail || !trimmedPhone || !password) return toast.error("Please fill in all fields.");
    if (!isValidEmail(trimmedEmail)) return toast.error("Please enter a valid email address.");
    const pwCheck = isValidPassword(password);
    if (!pwCheck.ok) return toast.error(pwCheck.message);
    if (!/^[0-9]{9,10}$/.test(trimmedPhone.replace(/[\s\-()]/g, ""))) return toast.error("Please enter a valid 9–10 digit phone number.");
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
        try {
          const methods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
          if (methods.includes("google.com")) {
            toast.error("This email is linked to a Google account. Use 'Continue with Google' below.");
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
    <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={LABEL}>FULL NAME</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" style={INPUT} />
        </div>
        <div>
          <label style={LABEL}>LAST NAME</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" style={INPUT} />
        </div>
      </div>
      <div>
        <label style={LABEL}>ACADEMIC EMAIL</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="scholar@university.edu" style={INPUT} />
      </div>
      <div>
        <label style={LABEL}>MOBILE PHONE</label>
        <div style={{ display: "flex" }}>
          <span style={{ display: "flex", alignItems: "center", padding: "0 12px", background: "#f5f3f3", border: "1px solid #75777e", borderRight: "none", fontSize: 13, fontWeight: 700, color: "#000b21", whiteSpace: "nowrap" }}>+977</span>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" style={{ ...INPUT, flex: 1, borderLeft: "none" }} />
        </div>
      </div>
      <div>
        <label style={LABEL}>CHOOSE PASSWORD</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" style={INPUT} />
      </div>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 3, accentColor: "#000b21", width: 15, height: 15, flexShrink: 0 }} />
        <span style={{ ...INTER, fontSize: 12, color: "#44474e", lineHeight: 1.5 }}>
          I agree to the{" "}
          <Link href="/terms" target="_blank" style={{ color: "#775a19", fontWeight: 700 }}>Terms of Service</Link>
          {" "}and{" "}
          <Link href="/terms" target="_blank" style={{ color: "#775a19", fontWeight: 700 }}>Privacy Policy</Link>.
        </span>
      </label>
      <button type="submit" disabled={loading} style={{ ...BTN, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "CREATING…" : "CREATE ACCOUNT"}
      </button>
      <p style={{ ...INTER, textAlign: "center", fontSize: 13, color: "#44474e" }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} style={{ ...INTER, background: "none", border: "none", cursor: "pointer", color: "#775a19", fontWeight: 700, fontSize: 13 }}>Log In</button>
      </p>
    </form>
  );
}
