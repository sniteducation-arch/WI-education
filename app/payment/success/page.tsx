"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Status = "verifying" | "success" | "failed";

function SuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const encodedData = params.get("data");
    if (!encodedData) {
      setStatus("failed");
      setErrorMsg("No payment data received from eSewa.");
      return;
    }

    // Send the encoded token to our server for verification
    fetch("/api/esewa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encodedData }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.success) {
          setStatus("success");
          setTimeout(() => router.push("/dashboard"), 3000);
        } else {
          setStatus("failed");
          setErrorMsg(result.error || "Payment could not be verified.");
        }
      })
      .catch(() => {
        setStatus("failed");
        setErrorMsg("Network error during verification. Please contact support.");
      });
  }, [params, router]);

  if (status === "verifying") {
    return (
      <div style={centeredPage}>
        <div style={{ width: 56, height: 56, border: "5px solid #dde1ff", borderTopColor: "#0d2067", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 24 }} />
        <h2 style={title}>Verifying Payment…</h2>
        <p style={sub}>Please wait. Do not close this page.</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div style={centeredPage}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 44, color: "#16a34a", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h2 style={{ ...title, color: "#16a34a" }}>Payment Confirmed!</h2>
        <p style={sub}>All 7 practice sets are now unlocked. Welcome to WI Upskill Mock Test!</p>
        <p style={{ marginTop: 20, fontSize: 13, color: "#767682" }}>Redirecting to dashboard…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={centeredPage}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 44, color: "#dc2626", fontVariationSettings: "'FILL' 1" }}>cancel</span>
      </div>
      <h2 style={{ ...title, color: "#dc2626" }}>Verification Failed</h2>
      <p style={sub}>{errorMsg}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28, width: "100%", maxWidth: 300 }}>
        <button
          onClick={() => router.push("/payment")}
          style={{ background: "#0d2067", color: "#fff", border: "none", borderRadius: 9999, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          style={{ background: "#fff", color: "#0d2067", border: "1px solid #c6c5d2", borderRadius: 9999, padding: "13px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          Back to Dashboard
        </button>
      </div>
      <p style={{ marginTop: 20, fontSize: 12, color: "#767682", textAlign: "center" }}>
        If you were charged, contact us at snit.education@gmail.com
      </p>
    </div>
  );
}

const centeredPage: React.CSSProperties = {
  minHeight: "100dvh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 24px",
  textAlign: "center",
  background: "#f8f9fa",
};
const title: React.CSSProperties = { fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 24, fontWeight: 700, color: "#191c1d", marginBottom: 10 };
const sub: React.CSSProperties = { fontSize: 15, color: "#454651", lineHeight: 1.6, maxWidth: 300 };

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
