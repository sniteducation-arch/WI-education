"use client";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function FailedPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
      <div style={{ background: "#fee2e2", borderRadius: "50%", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <XCircle size={44} color="#dc2626" />
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#dc2626", marginBottom: 12 }}>Payment Failed</h1>
      <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
        Something went wrong with your payment.<br />Please try again.
      </p>
      <button
        onClick={() => router.push("/payment")}
        style={{ background: "linear-gradient(135deg, #1e3a8a, #3b5fc0)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}
      >
        Try Again
      </button>
    </div>
  );
}
