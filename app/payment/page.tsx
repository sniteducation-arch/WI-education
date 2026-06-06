"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

const CASLON: React.CSSProperties = { fontFamily: "'Libre Caslon Text', Georgia, serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };

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
          uid, readableId: readableId || uid.slice(0, 8),
          name: name || "Unknown", email, note: "", amount: 1500,
          status: "pending", submittedAt: serverTimestamp(),
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
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fbf9f8" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #eae8e7", borderTopColor: "#000b21", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (alreadyPaid) return (
    <div style={{ minHeight: "100dvh", background: "#fbf9f8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, border: "1px solid #c4c6ce", background: "#eae8e7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#000b21", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      </div>
      <h2 style={{ ...CASLON, fontSize: 24, fontWeight: 700, color: "#000b21", marginBottom: 10 }}>Your Due Has Been Paid</h2>
      <p style={{ ...INTER, fontSize: 14, color: "#44474e", lineHeight: 1.6, maxWidth: 300, marginBottom: 32 }}>
        You already have full access to all 7 practice sets.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        style={{ ...INTER, background: "#000b21", color: "#fff", border: "none", borderRadius: 0, padding: "14px 36px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase" as const }}
      >
        GO TO DASHBOARD
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh", background: "#fbf9f8" }}>
      <TopBar />
      <main style={{ paddingTop: 80, paddingBottom: 100, paddingLeft: 20, paddingRight: 20 }}>

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ ...CASLON, fontSize: 28, fontWeight: 700, color: "#000b21", letterSpacing: "-0.01em", marginBottom: 6 }}>
            Finalize Secure Payment
          </h1>
          <p style={{ ...INTER, fontSize: 14, color: "#44474e", lineHeight: 1.6 }}>
            Hi {name}! Complete your transaction to gain immediate access to all practice sets.
          </p>
        </div>

        {/* Enrollment summary */}
        <div style={{ background: "#ffffff", border: "1px solid #c4c6ce", padding: 20, marginBottom: 16 }}>
          <h2 style={{ ...CASLON, fontSize: 18, fontWeight: 600, color: "#000b21", borderBottom: "1px solid #c4c6ce", paddingBottom: 12, marginBottom: 16 }}>Enrollment Summary</h2>
          <div style={{ marginBottom: 16 }}>
            <p style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#775a19", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 4 }}>COURSE PACK</p>
            <h3 style={{ ...CASLON, fontSize: 16, fontWeight: 600, color: "#000b21", marginBottom: 4 }}>WI Upskill Mock Test</h3>
            <p style={{ ...INTER, fontSize: 12, color: "#44474e", lineHeight: 1.5 }}>Full digital access to 7 practice sets with 4 modules each (Reading, Writing, Listening, Speaking).</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ ...INTER, fontSize: 13, color: "#44474e" }}>Standard Tuition</span>
              <span style={{ ...INTER, fontSize: 13, color: "#44474e" }}>NPR 1,500</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ ...INTER, fontSize: 13, color: "#44474e" }}>Platform Fee</span>
              <span style={{ ...INTER, fontSize: 13, color: "#775a19", fontWeight: 600 }}>Waived</span>
            </div>
            <div style={{ borderTop: "1px solid #c4c6ce", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#000b21", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>TOTAL DUE</span>
              <span style={{ ...CASLON, fontSize: 22, fontWeight: 700, color: "#000b21" }}>NPR 1,500</span>
            </div>
          </div>
        </div>

        {/* Payment instructions card */}
        <div style={{ background: "#ffffff", border: "1px solid #c4c6ce", overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: "#000b21", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#fff" }}>phone_in_talk</span>
            <span style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>HOW TO PAY</span>
          </div>
          <div style={{ padding: 20 }}>
            <ol style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                <>Open eSewa or any mobile banking app.</>,
                <>Send <strong>NPR 1,500</strong> to <strong>9869400285</strong> (WI Education).</>,
                "Take a screenshot of your payment receipt.",
                <>Message <strong>9869400285</strong> on WhatsApp with your receipt and registered email.</>,
                "The admin will approve your account within a few hours.",
              ].map((step, i) => (
                <li key={i} style={{ ...INTER, fontSize: 13, color: "#44474e", lineHeight: 1.6 }}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* WhatsApp contact */}
        <div style={{ background: "#f5f3f3", border: "1px solid #c4c6ce", padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "#25D366", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <p style={{ ...INTER, fontSize: 13, fontWeight: 700, color: "#000b21", marginBottom: 2 }}>Pay via WhatsApp</p>
            <p style={{ ...INTER, fontSize: 12, color: "#44474e", lineHeight: 1.5 }}>
              Message <strong>9869400285</strong> on WhatsApp to pay NPR 1,500 and get approved.
            </p>
          </div>
        </div>

        {/* Account warning */}
        <div style={{ background: "#fff", border: "1px solid #c4c6ce", borderLeft: "3px solid #ba1a1a", padding: 14, marginBottom: 16 }}>
          <p style={{ ...INTER, fontSize: 11, fontWeight: 700, color: "#ba1a1a", marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>⚠ ONE ACCOUNT, ONE PERSON</p>
          <p style={{ ...INTER, fontSize: 12, color: "#44474e", lineHeight: 1.6 }}>
            This account is registered to <strong>one person only</strong>. Account sharing is automatically detected and results in <strong>permanent deletion with no refund</strong>.
          </p>
        </div>

        {/* Terms */}
        <div style={{ background: "#f5f3f3", border: "1px solid #c4c6ce", padding: 14, marginBottom: 16 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: 3, accentColor: "#000b21", width: 15, height: 15, flexShrink: 0 }} />
            <span style={{ ...INTER, fontSize: 13, color: "#1b1c1c", lineHeight: 1.5 }}>
              I hereby acknowledge that this purchase is non-refundable and agree to the institutional academic integrity policy.
            </span>
          </label>
          <button
            onClick={() => setShowTerms(!showTerms)}
            style={{ ...INTER, display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: "#775a19", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginLeft: 25, marginTop: 8, padding: 0 }}
          >
            {showTerms ? "SHOW LESS" : "LEARN MORE"}{" "}
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{showTerms ? "expand_less" : "expand_more"}</span>
          </button>
          {showTerms && (
            <ul style={{ marginLeft: 25, marginTop: 8, paddingLeft: 14, display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                "This is a practice tool — it does not guarantee actual exam content.",
                "Payment does not guarantee admission to any official examination.",
                "Payments are non-refundable once access is activated.",
                "Materials are for individual use only.",
              ].map((t) => (
                <li key={t} style={{ ...INTER, fontSize: 12, color: "#44474e", lineHeight: 1.5, fontStyle: "italic" }}>{t}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Request Access button */}
        <button
          onClick={handleRequestAccess}
          disabled={submitting || !agreed}
          style={{
            ...INTER,
            width: "100%",
            background: submitting || !agreed ? "#eae8e7" : "#000b21",
            color: submitting || !agreed ? "#75777e" : "#fff",
            border: "none",
            borderRadius: 0,
            padding: "16px 0",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            cursor: submitting || !agreed ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textTransform: "uppercase" as const,
            marginBottom: 12,
          }}
        >
          {submitting ? (
            <><span className="material-symbols-outlined" style={{ fontSize: 18, animation: "spin 1s linear infinite" }}>sync</span>SUBMITTING…</>
          ) : (
            <>CONFIRM & REQUEST ACCESS <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span></>
          )}
        </button>
        <p style={{ ...INTER, fontSize: 12, color: "#44474e", textAlign: "center", lineHeight: 1.6 }}>
          After requesting, contact <strong>9869400285</strong> on WhatsApp to complete payment.
        </p>
      </main>

      <BottomNav />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
