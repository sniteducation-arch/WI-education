"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

const H = "'Manrope', system-ui, sans-serif";

export default function PendingPage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "loading">("loading");
  const [rejectionReason, setRejectionReason] = useState("");
  const [uid, setUid] = useState("");
  const [readableId, setReadableId] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }

    setUid(user.uid);
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) setReadableId(snap.data().readableId || user.uid.slice(0, 8));
    }).catch(() => {});

    const unsub = onSnapshot(doc(db, "qr_requests", user.uid), (snap) => {
      if (!snap.exists()) { setStatus("pending"); return; }
      const data = snap.data();
      setStatus(data.status);
      if (data.rejectionReason) setRejectionReason(data.rejectionReason);
    });

    const userUnsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists() && snap.data().paid) router.push("/dashboard");
    });

    return () => { unsub(); userUnsub(); };
  }, [authLoading, user, router]);

  // Redirect as soon as status flips to "approved" (fallback if users listener is slow)
  useEffect(() => {
    if (status === "approved") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "4px solid #dde1ff", borderTopColor: "#0d2067", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (status === "approved") return (
    <div style={page}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 44, color: "#16a34a", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      </div>
      <h2 style={{ ...heading, color: "#16a34a" }}>Payment Approved!</h2>
      <p style={body}>Your payment has been verified. You now have full access.</p>
      <button
        onClick={() => router.push("/dashboard")}
        style={{ marginTop: 24, background: "#16a34a", color: "#fff", border: "none", borderRadius: 9999, padding: "14px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 12px rgba(22,163,74,0.3)" }}
      >
        Go to Dashboard
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (status === "rejected") return (
    <div style={page}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 44, color: "#dc2626", fontVariationSettings: "'FILL' 1" }}>cancel</span>
      </div>
      <h2 style={{ ...heading, color: "#dc2626" }}>Payment Not Verified</h2>
      <p style={body}>{rejectionReason || "Your payment could not be verified."}</p>
      <p style={{ fontSize: 13, color: "#454651", marginTop: 8, marginBottom: 28 }}>
        Please contact <strong>info@moraleducare.edu.np</strong> if you believe this is an error.
      </p>
      <button onClick={() => router.push("/payment")}
        style={{ background: "#0d2067", color: "#fff", border: "none", borderRadius: 9999, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        Try Payment Again
      </button>
    </div>
  );

  // Pending state
  return (
    <div style={page}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, animation: "pulse 2s ease-in-out infinite" }}>
        <span className="material-symbols-outlined" style={{ fontSize: 44, color: "#16a34a", fontVariationSettings: "'FILL' 1" }}>mark_chat_read</span>
      </div>

      <h2 style={heading}>Request Submitted!</h2>
      <p style={body}>
        To buy the app, please contact <strong>9869400285</strong> on WhatsApp and wait for approval.
      </p>

      {/* WhatsApp contact card — primary action */}
      <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 14, padding: 16, maxWidth: 340, width: "100%", marginTop: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 15, fontWeight: 700, color: "#166534" }}>Contact Admin on WhatsApp</p>
            <p style={{ fontSize: 12, color: "#166534" }}>Pay NPR 499 and get approved</p>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.6, marginBottom: 14 }}>
          Message <strong>9869400285</strong> on WhatsApp, send your payment of <strong>NPR 499</strong>, and wait for the admin to approve your account.
        </p>

        <a
          href="https://wa.me/9779869400285"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "#25D366",
            color: "#fff",
            borderRadius: 9999,
            padding: "14px 0",
            fontSize: 15,
            fontWeight: 700,
            textDecoration: "none",
            width: "100%",
            boxShadow: "0 4px 12px rgba(37,211,102,0.35)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp +977 9869400285
        </a>
      </div>

      {/* Status card */}
      <div style={{ background: "#fff", border: "1px solid #c6c5d2", borderRadius: 14, padding: 18, width: "100%", maxWidth: 340, marginBottom: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <StatusRow icon="check_circle" color="#346b00" label="Access Request Sent" done />
          <div style={{ width: 2, height: 16, background: "#e1e3e4", marginLeft: 11 }} />
          <StatusRow icon="schedule" color="#f59e0b" label="Admin Verification" done={false} active />
          <div style={{ width: 2, height: 16, background: "#e1e3e4", marginLeft: 11 }} />
          <StatusRow icon="lock_open" color="#767682" label="Full Access Unlocked" done={false} />
        </div>
      </div>

      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 14, maxWidth: 340, width: "100%", marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
          <strong>What happens next:</strong> After you contact admin on WhatsApp and pay, your account will be approved — usually within a few hours. This page updates automatically.
        </p>
      </div>

      <p style={{ fontSize: 12, color: "#767682", textAlign: "center" }}>
        Your User ID: <code style={{ background: "#f3f4f5", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>{readableId || uid.slice(0, 8)}</code>
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>
    </div>
  );
}

function StatusRow({ icon, color, label, done, active }: { icon: string; color: string; label: string; done: boolean; active?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? "#dcfce7" : active ? "#fef3c7" : "#f3f4f5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `2px solid ${done ? "#16a34a" : active ? "#f59e0b" : "#e1e3e4"}` }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, color: done ? "#16a34a" : active ? "#f59e0b" : "#767682", fontVariationSettings: done || active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: active || done ? 600 : 400, color: done ? "#16a34a" : active ? "#92400e" : "#767682" }}>{label}</span>
      {active && <span style={{ fontSize: 10, background: "#fef3c7", color: "#92400e", fontWeight: 700, padding: "2px 6px", borderRadius: 9999 }}>IN PROGRESS</span>}
    </div>
  );
}

const page: React.CSSProperties = { minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center", background: "#f8f9fa" };
const heading: React.CSSProperties = { fontFamily: H, fontSize: 24, fontWeight: 700, color: "#0d2067", marginBottom: 10 };
const body: React.CSSProperties = { fontSize: 15, color: "#454651", lineHeight: 1.6, maxWidth: 300 };
