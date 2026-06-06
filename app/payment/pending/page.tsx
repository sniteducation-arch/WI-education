"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

const CASLON: React.CSSProperties = { fontFamily: "'Libre Caslon Text', Georgia, serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };

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

  useEffect(() => {
    if (status === "approved") router.push("/dashboard");
  }, [status, router]);

  if (status === "loading") return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fbf9f8" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #eae8e7", borderTopColor: "#000b21", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (status === "approved") return (
    <div style={page}>
      <div style={{ width: 72, height: 72, background: "#000b21", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#fff", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      </div>
      <h2 style={{ ...CASLON, fontSize: 24, fontWeight: 700, color: "#000b21", marginBottom: 10 }}>Payment Approved!</h2>
      <p style={body}>Your payment has been verified. You now have full access.</p>
      <button onClick={() => router.push("/dashboard")} style={{ ...INTER, marginTop: 24, background: "#000b21", color: "#fff", border: "none", borderRadius: 0, padding: "14px 36px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase" as const }}>
        Go to Dashboard
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (status === "rejected") return (
    <div style={page}>
      <div style={{ width: 72, height: 72, background: "#fff", border: "1px solid #c4c6ce", borderLeft: "3px solid #ba1a1a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#ba1a1a", fontVariationSettings: "'FILL' 1" }}>cancel</span>
      </div>
      <h2 style={{ ...CASLON, fontSize: 24, fontWeight: 700, color: "#ba1a1a", marginBottom: 10 }}>Payment Not Verified</h2>
      <p style={body}>{rejectionReason || "Your payment could not be verified."}</p>
      <p style={{ ...INTER, fontSize: 13, color: "#44474e", marginTop: 8, marginBottom: 28, lineHeight: 1.6 }}>
        Contact <strong>9869400285</strong> on WhatsApp if you believe this is an error.
      </p>
      <button onClick={() => router.push("/payment")} style={{ ...INTER, background: "#000b21", color: "#fff", border: "none", borderRadius: 0, padding: "14px 32px", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase" as const }}>
        Try Payment Again
      </button>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh", background: "#fbf9f8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>

      {/* Icon */}
      <div style={{ width: 72, height: 72, background: "#000b21", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#fff", fontVariationSettings: "'FILL' 1" }}>mark_chat_read</span>
      </div>

      <h2 style={{ ...CASLON, fontSize: 24, fontWeight: 700, color: "#000b21", marginBottom: 8, textAlign: "center" }}>Request Submitted</h2>
      <p style={{ ...INTER, fontSize: 14, color: "#44474e", lineHeight: 1.6, maxWidth: 300, textAlign: "center", marginBottom: 28 }}>
        Contact <strong>9869400285</strong> on WhatsApp, send your payment receipt, and wait for admin approval.
      </p>

      {/* WhatsApp CTA */}
      <div style={{ width: "100%", maxWidth: 380, marginBottom: 16 }}>
        <a
          href="https://wa.me/9779869400285"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#25D366", color: "#fff", padding: "15px 0", width: "100%", textDecoration: "none", borderRadius: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span style={{ ...INTER, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>WHATSAPP +977 9869400285</span>
        </a>
      </div>

      {/* Status tracker */}
      <div style={{ width: "100%", maxWidth: 380, background: "#fff", border: "1px solid #c4c6ce", marginBottom: 16 }}>
        <div style={{ background: "#000b21", padding: "10px 16px" }}>
          <span style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>APPROVAL STATUS</span>
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <StatusRow icon="check_circle" label="Access Request Sent" done />
          <div style={{ width: 2, height: 12, background: "#eae8e7", marginLeft: 10 }} />
          <StatusRow icon="schedule" label="Admin Verification — In Progress" active />
          <div style={{ width: 2, height: 12, background: "#eae8e7", marginLeft: 10 }} />
          <StatusRow icon="lock_open" label="Full Access Unlocked" />
        </div>
      </div>

      {/* Note */}
      <div style={{ width: "100%", maxWidth: 380, background: "#fff", border: "1px solid #c4c6ce", borderLeft: "3px solid #775a19", padding: 14, marginBottom: 20 }}>
        <p style={{ ...INTER, fontSize: 12, color: "#44474e", lineHeight: 1.6 }}>
          <strong style={{ color: "#775a19" }}>What happens next:</strong> After you send your receipt on WhatsApp, admin will approve your account — usually within a few hours. This page updates automatically.
        </p>
      </div>

      <p style={{ ...INTER, fontSize: 11, color: "#75777e", textAlign: "center" }}>
        Your ID: <strong style={{ color: "#000b21" }}>{readableId || uid.slice(0, 8)}</strong>
      </p>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function StatusRow({ icon, label, done, active }: { icon: string; label: string; done?: boolean; active?: boolean }) {
  const INTER_S: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 22, height: 22, background: done ? "#000b21" : "transparent", border: `2px solid ${done ? "#000b21" : active ? "#775a19" : "#c4c6ce"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 13, color: done ? "#fff" : active ? "#775a19" : "#75777e", fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <span style={{ ...INTER_S, fontSize: 13, fontWeight: done || active ? 600 : 400, color: done ? "#000b21" : active ? "#775a19" : "#75777e" }}>{label}</span>
    </div>
  );
}

const page: React.CSSProperties = { minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center", background: "#fbf9f8" };
const body: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14, color: "#44474e", lineHeight: 1.6, maxWidth: 300 };
