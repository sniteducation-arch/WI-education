"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const H = "'Manrope', system-ui, sans-serif";

export default function PaymentPage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [readableId, setReadableId] = useState("");
  const [alreadyPaid, setAlreadyPaid] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setUid(user.uid);
    setName(user.displayName || "Student");
    setEmail(user.email || "");
    (async () => {
      try {
        const { getIdToken } = await import("firebase/auth");
        const token = await getIdToken(user);
        const meRes = await fetch(`/api/user/me?token=${token}`);
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.paid) { setAlreadyPaid(true); setLoading(false); return; }
          if (meData.readableId) {
            setReadableId(meData.readableId);
          } else {
            const createRes = await fetch("/api/user/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uid: user.uid, name: user.displayName || "", email: user.email || "", phone: "" }),
            });
            const createData = await createRes.json();
            setReadableId(createData.readableId || user.uid.slice(0, 8));
          }
        }
        const qrSnap = await getDoc(doc(db, "qr_requests", user.uid));
        if (qrSnap.exists() && qrSnap.data().status === "pending") {
          router.push("/payment/pending"); return;
        }
      } catch { /* continue */ }
      setLoading(false);
    })();
  }, [authLoading, user, router]);

  const handleRequestAccess = async () => {
    if (!agreed) return toast.error("Please accept the Terms & Conditions.");
    setSubmitting(true);
    try {
      const res = await fetch("/api/qr-payment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name, email, note: "", readableId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.method === "client") {
        await setDoc(doc(db, "qr_requests", uid), {
          uid,
          readableId: readableId || uid.slice(0, 8),
          name: name || "Unknown",
          email,
          note: "",
          amount: 499,
          status: "pending",
          submittedAt: serverTimestamp(),
        }, { merge: true });
      }

      router.push("/payment/pending");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "4px solid #dde1ff", borderTopColor: "#0d2067", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (alreadyPaid) return (
    <div style={{ minHeight: "100dvh", background: "#f8f9fa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" }}>
      <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#16a34a", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      </div>
      <h2 style={{ fontFamily: H, fontSize: 26, fontWeight: 800, color: "#0d2067", marginBottom: 10 }}>Your Due Has Been Paid</h2>
      <p style={{ fontSize: 15, color: "#454651", lineHeight: 1.6, maxWidth: 300, marginBottom: 32 }}>
        You already have full access to all 7 practice sets. No further payment is needed.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        style={{ background: "#0d2067", color: "#fff", border: "none", borderRadius: 14, padding: "16px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: H, boxShadow: "0 4px 14px rgba(13,32,103,0.25)" }}
      >
        Go to Dashboard
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh", background: "#f8f9fa" }}>
      <TopBar />
      <main style={{ paddingTop: 80, paddingBottom: 100, paddingLeft: 20, paddingRight: 20 }}>

        {/* Header */}
        <h2 style={{ fontFamily: H, fontSize: 30, fontWeight: 700, color: "#0d2067", letterSpacing: "-0.02em", marginBottom: 6 }}>
          Unlock Full Access
        </h2>
        <p style={{ fontSize: 14, color: "#454651", lineHeight: 1.6, marginBottom: 20 }}>
          Hi {name}! Pay once to unlock all 7 practice sets forever.
        </p>

        {/* What you get */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #c6c5d2", padding: 18, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <span style={{ background: "#abf374", color: "#367000", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 9999, display: "inline-block", marginBottom: 8 }}>FULL ACCESS</span>
              <h3 style={{ fontFamily: H, fontSize: 17, fontWeight: 700, color: "#0d2067" }}>Upskill Preparation for Students</h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: H, fontSize: 26, fontWeight: 800, color: "#0d2067", lineHeight: 1 }}>NPR 499</p>
              <p style={{ fontSize: 11, color: "#454651", marginTop: 3 }}>One-time · No renewal</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #e1e3e4", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {["All 7 complete practice sets", "Reading · Writing · Listening · Speaking", "CEFR grading (A1, A2, B1)", "Full score transcript", "Lifetime access"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 17, color: "#346b00", fontVariationSettings: "'FILL' 1", flexShrink: 0 }}>check_circle</span>
                <span style={{ fontSize: 13, color: "#191c1d" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#1e40af", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>info</span>
            How to get access
          </p>
          <ol style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8, margin: 0 }}>
            <li style={{ fontSize: 13, color: "#1e3a8a", lineHeight: 1.6 }}>Click <strong>Request Access</strong> below to notify our admin.</li>
            <li style={{ fontSize: 13, color: "#1e3a8a", lineHeight: 1.6 }}>
              Contact <strong>9851093948</strong> on WhatsApp to complete your payment of <strong>NPR 499</strong>.
            </li>
            <li style={{ fontSize: 13, color: "#1e3a8a", lineHeight: 1.6 }}>Wait for admin approval — usually within a few hours.</li>
            <li style={{ fontSize: 13, color: "#1e3a8a", lineHeight: 1.6 }}>Your account will be unlocked automatically once approved.</li>
          </ol>
        </div>

        {/* QR Code */}
        <div style={{ background: "#fff", border: "1.5px solid #c6c5d2", borderRadius: 14, padding: 18, marginBottom: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#0d2067", margin: 0 }}>Scan to Pay — NPR 499</p>
          <img src="/qr2.png" alt="Payment QR Code" style={{ width: 200, height: 200, borderRadius: 10, objectFit: "contain" }} />
          <p style={{ fontSize: 12, color: "#454651", margin: 0, textAlign: "center" }}>Scan this QR code with your banking app to send NPR 499</p>
        </div>

        {/* WhatsApp contact highlight */}
        <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 14, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: H, fontSize: 15, fontWeight: 700, color: "#166534", marginBottom: 2 }}>Pay via WhatsApp</p>
            <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>
              Message <strong>9851093948</strong> on WhatsApp to pay NPR 499 and get approved.
            </p>
          </div>
        </div>

        {/* Account sharing warning */}
        <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>⚠️ ONE ACCOUNT, ONE PERSON</p>
          <p style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.6 }}>
            This account is registered to <strong>one person only</strong>. Sharing your account with others is automatically detected and will result in <strong>permanent deletion with no refund</strong>.
          </p>
        </div>

        {/* Terms */}
        <TermsBox agreed={agreed} setAgreed={setAgreed} showTerms={showTerms} setShowTerms={setShowTerms} />

        {/* Request Access button */}
        <button
          onClick={handleRequestAccess}
          disabled={submitting || !agreed}
          style={{
            width: "100%",
            background: submitting || !agreed ? "#e1e3e4" : "#0d2067",
            color: submitting || !agreed ? "#767682" : "#fff",
            border: "none",
            borderRadius: 14,
            padding: "16px 0",
            fontSize: 16,
            fontWeight: 700,
            cursor: submitting || !agreed ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontFamily: "inherit",
            boxShadow: !submitting && agreed ? "0 4px 14px rgba(13,32,103,0.25)" : "none",
            marginBottom: 12,
          }}
        >
          {submitting ? (
            <><span className="material-symbols-outlined" style={{ fontSize: 20, animation: "spin 1s linear infinite" }}>sync</span>Submitting…</>
          ) : (
            <><span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>send</span>Request Access — NPR 499</>
          )}
        </button>
        <p style={{ fontSize: 12, color: "#767682", textAlign: "center", lineHeight: 1.6 }}>
          After requesting, contact <strong>9851093948</strong> on WhatsApp to complete payment and wait for admin approval.
        </p>
      </main>

      <BottomNav />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function TermsBox({ agreed, setAgreed, showTerms, setShowTerms }: {
  agreed: boolean; setAgreed: (v: boolean) => void;
  showTerms: boolean; setShowTerms: (v: boolean) => void;
}) {
  return (
    <div style={{ background: "#f3f4f5", borderRadius: 12, border: "1px solid #e1e3e4", padding: 14, marginBottom: 16 }}>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
          style={{ marginTop: 3, accentColor: "#0d2067", width: 18, height: 18, flexShrink: 0 }} />
        <span style={{ fontFamily: "'Manrope', system-ui", fontSize: 14, fontWeight: 600, color: "#191c1d", lineHeight: 1.4 }}>
          I agree to the Terms & Conditions
        </span>
      </label>
      <button onClick={() => setShowTerms(!showTerms)}
        style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#0d2067", fontSize: 12, fontWeight: 700, marginLeft: 28, marginTop: 6, padding: 0 }}>
        {showTerms ? "Show less" : "Read terms"}
        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{showTerms ? "expand_less" : "expand_more"}</span>
      </button>
      {showTerms && (
        <ul style={{ marginLeft: 28, marginTop: 8, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            "This is a practice tool — it does not guarantee actual exam content.",
            "Payment does not guarantee admission to any Cambridge examination.",
            "Payments are non-refundable once access is activated.",
            "Materials are for individual use only.",
          ].map((t) => (
            <li key={t} style={{ fontSize: 12, color: "#454651", lineHeight: 1.5, fontStyle: "italic" }}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
