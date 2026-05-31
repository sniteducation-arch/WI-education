"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdToken } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

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
  const [paying, setPaying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<"qr" | "esewa">("qr");
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

  // ── QR payment submission ─────────────────────────────────
  const handleQRSubmit = async () => {
    if (!agreed) return toast.error("Please accept the Terms & Conditions.");
    setSubmitting(true);
    try {
      const res = await fetch("/api/qr-payment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, name, email, note, readableId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // If Admin SDK isn't set up yet, write directly from client
      if (data.method === "client") {
        await setDoc(doc(db, "qr_requests", uid), {
          uid,
          readableId: readableId || uid.slice(0, 8),
          name: name || "Unknown",
          email,
          note: note || "",
          amount: 500,
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

  // ── eSewa payment ─────────────────────────────────────────
  const handleEsewa = async () => {
    if (!agreed) return toast.error("Please accept the Terms & Conditions.");
    setPaying(true);
    try {
      const res = await fetch("/api/esewa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.gateway;
      Object.entries(data.fields).forEach(([k, v]) => {
        const i = document.createElement("input");
        i.type = "hidden"; i.name = k; i.value = String(v);
        form.appendChild(i);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Could not connect to eSewa.");
      setPaying(false);
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
              <h3 style={{ fontFamily: H, fontSize: 17, fontWeight: 700, color: "#0d2067" }}>MoralEdu Care Upskill Prep</h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: H, fontSize: 26, fontWeight: 800, color: "#0d2067", lineHeight: 1 }}>NPR 500</p>
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

        {/* Method tabs */}
        <div style={{ display: "flex", background: "#e1e3e4", borderRadius: 10, padding: 4, marginBottom: 16, gap: 4 }}>
          {/* QR tab — active */}
          <button
            onClick={() => setMethod("qr")}
            style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.15s", background: method === "qr" ? "#fff" : "transparent", color: method === "qr" ? "#0d2067" : "#767682", boxShadow: method === "qr" ? "0 1px 4px rgba(0,0,0,0.1)" : "none", fontFamily: "inherit" }}
          >
            📱 QR Code
          </button>

          {/* eSewa tab — coming soon, disabled */}
          <div style={{ flex: 1, position: "relative" }}>
            <button
              disabled
              style={{ width: "100%", padding: "10px 0", border: "none", borderRadius: 8, cursor: "not-allowed", fontWeight: 700, fontSize: 12, background: "transparent", color: "#b0b0b8", fontFamily: "inherit", opacity: 0.7 }}
            >
              💚 eSewa
            </button>
            <span style={{ position: "absolute", top: -6, right: 4, background: "#f59e0b", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 9999, letterSpacing: "0.03em", pointerEvents: "none" }}>
              SOON
            </span>
          </div>
        </div>

        {/* ── QR METHOD ── */}
        {method === "qr" && (
          <div>
            {/* Important instructions */}
            <div style={{ background: "#fff8e1", border: "1.5px solid #fde68a", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>warning</span>
                Before scanning — read carefully
              </p>
              <ol style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  "Scan the QR code below using your bank app or eSewa.",
                  `Pay exactly NPR 500.`,
                  <span key="uid">In the <strong>Remarks / Description</strong> field, type your User ID: <code style={{ background: "#fde68a", padding: "1px 6px", borderRadius: 4, fontSize: 12, wordBreak: "break-all" }}>{readableId}</code></span>,
                  `Come back here and click "I Have Paid via QR".`,
                  "Wait for admin approval (usually within a few hours).",
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>{item}</li>
                ))}
              </ol>
            </div>

            {/* QR Code */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #c6c5d2", padding: "20px 20px 16px", textAlign: "center", marginBottom: 16 }}>
              <p style={{ fontFamily: H, fontSize: 15, fontWeight: 700, color: "#0d2067", marginBottom: 16 }}>
                Scan to Pay — NPR 500
              </p>

              {/* QR image — large, clean, centered */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/qr2.png"
                  alt="Payment QR Code — scan to pay NPR 500"
                  style={{
                    width: 260,
                    height: 260,
                    objectFit: "contain",
                    display: "block",
                    background: "#fff",
                  }}
                />
              </div>

              <p style={{ fontSize: 12, color: "#454651", lineHeight: 1.6 }}>
                Use <strong>eSewa, IME Pay, Khalti</strong> or any bank app to scan.
              </p>
            </div>

            {/* UID reminder box */}
            <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#1e40af", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>badge</span>
                Your unique User ID (copy into payment remarks)
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <code style={{ flex: 1, background: "#fff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "10px 12px", fontSize: 14, color: "#1e3a8a", fontWeight: 700, letterSpacing: "0.03em" }}>
                  {readableId}
                </code>
                <button
                  onClick={() => { navigator.clipboard.writeText(readableId); toast.success("User ID copied!"); }}
                  style={{ background: "#1e40af", border: "none", borderRadius: 8, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#fff" }}>content_copy</span>
                </button>
              </div>
            </div>

            {/* Optional note */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#454651", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                Transaction Note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Paid via eSewa, transaction ref #12345..."
                rows={2}
                style={{ width: "100%", background: "#fff", border: "1px solid #c6c5d2", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#191c1d", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>

            {/* Account sharing warning */}
            <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>⚠️ ONE ACCOUNT, ONE PERSON</p>
              <p style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.6 }}>
                This account is registered to <strong>one person only</strong>. Sharing your account with others is automatically detected and will result in <strong>permanent deletion with no refund</strong>.
              </p>
            </div>

            {/* Terms */}
            <TermsBox agreed={agreed} setAgreed={setAgreed} showTerms={showTerms} setShowTerms={setShowTerms} />

            {/* Submit button */}
            <button
              onClick={handleQRSubmit}
              disabled={submitting || !agreed}
              style={{ width: "100%", background: submitting || !agreed ? "#e1e3e4" : "#0d2067", color: submitting || !agreed ? "#767682" : "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 16, fontWeight: 700, cursor: submitting || !agreed ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "inherit", boxShadow: !submitting && agreed ? "0 4px 14px rgba(13,32,103,0.25)" : "none", marginBottom: 12 }}>
              {submitting ? (
                <><span className="material-symbols-outlined" style={{ fontSize: 20, animation: "spin 1s linear infinite" }}>sync</span>Submitting…</>
              ) : (
                <><span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>check_circle</span>I Have Paid via QR Code</>
              )}
            </button>
            <p style={{ fontSize: 12, color: "#767682", textAlign: "center" }}>
              Your request will be reviewed by an admin. Access is granted after approval.
            </p>
          </div>
        )}

        {/* ── ESEWA METHOD (kept for future) ── */}
        {method === "esewa" && (
          <div>
            <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>
                <strong>Instant activation</strong> — eSewa payments are verified automatically. Access is unlocked immediately after payment.
              </p>
            </div>

            {/* Account sharing warning */}
            <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>⚠️ ONE ACCOUNT, ONE PERSON</p>
              <p style={{ fontSize: 12, color: "#7f1d1d", lineHeight: 1.6 }}>
                This account is registered to <strong>one person only</strong>. Sharing your account with others is automatically detected and will result in <strong>permanent deletion with no refund</strong>.
              </p>
            </div>

            <TermsBox agreed={agreed} setAgreed={setAgreed} showTerms={showTerms} setShowTerms={setShowTerms} />

            <button
              onClick={handleEsewa}
              disabled={paying || !agreed}
              style={{ width: "100%", background: paying || !agreed ? "#e1e3e4" : "#60BB46", color: paying || !agreed ? "#767682" : "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 16, fontWeight: 700, cursor: paying || !agreed ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: !paying && agreed ? "0 4px 14px rgba(96,187,70,0.35)" : "none", fontFamily: "inherit", marginBottom: 12 }}>
              {paying ? (
                <><span className="material-symbols-outlined" style={{ fontSize: 20, animation: "spin 1s linear infinite" }}>sync</span>Redirecting…</>
              ) : (
                <><span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>Pay NPR 499 with eSewa</>
              )}
            </button>
            <p style={{ fontSize: 12, color: "#767682", textAlign: "center" }}>
              You will be redirected to eSewa&apos;s secure payment page.
            </p>
          </div>
        )}
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
            "QR payments require admin verification before access is granted.",
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
