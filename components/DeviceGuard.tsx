"use client";
import { useEffect, useRef, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getIdToken, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";

// ── Fingerprint ───────────────────────────────────────────────────────────────
function getFingerprint(): string {
  if (typeof navigator === "undefined") return ""; // SSR guard
  const parts = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    navigator.hardwareConcurrency ?? 0,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");
  let h = 5381;
  for (let i = 0; i < parts.length; i++) {
    h = Math.imul(h, 31) + parts.charCodeAt(i) | 0;
  }
  return Math.abs(h).toString(36);
}

// ── Session ID — localStorage so it survives app restarts / TWA background kills
function getSessionId(): string {
  if (typeof window === "undefined") return ""; // SSR guard
  try {
    let id = localStorage.getItem("_sid");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("_sid", id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

const WHATSAPP_NUMBER = "9779800000000"; // ← replace with your WhatsApp number

// ── Banned screen ─────────────────────────────────────────────────────────────
function BannedScreen({ reason }: { reason: string }) {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello, my MoralEdu Care account has been suspended. I would like to appeal. My email is: ")}`;
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, textAlign: "center", background: "#fff" }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🚫</div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "#dc2626", marginBottom: 10 }}>Account Suspended</h2>
      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, maxWidth: 300, marginBottom: 20 }}>{reason}</p>
      <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 12, padding: 14, maxWidth: 300, marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: "#7f1d1d", lineHeight: 1.6 }}>
          Account sharing violates our Terms of Service. If you believe this is an error, contact us to appeal.
        </p>
      </div>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "flex", alignItems: "center", gap: 8, background: "#22c55e", color: "#fff", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none", marginBottom: 12 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.119 1.522 5.847L0 24l6.335-1.51A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.853 0-3.587-.5-5.084-1.373l-.364-.214-3.762.897.951-3.671-.236-.38A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        Contact Admin on WhatsApp
      </a>
      <button
        onClick={() => signOut(auth)}
        style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 12, padding: "11px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
      >
        Sign Out
      </button>
    </div>
  );
}

// ── Guard component ───────────────────────────────────────────────────────────
export default function DeviceGuard({ children }: { children: ReactNode }) {
  const { user, authLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [banned, setBanned] = useState(false);
  const [banReason, setBanReason] = useState("");
  const sessionId = useRef(getSessionId());
  const checkedRef = useRef(false);
  const unsubRef = useRef<(() => void) | null>(null);

  // Skip guard for admin pages
  const isAdminPage = pathname?.startsWith("/admin");

  useEffect(() => {
    if (authLoading || !user || isAdminPage) return;
    if (checkedRef.current) return;
    checkedRef.current = true;

    (async () => {
      try {
        const token = await getIdToken(user);
        const fingerprint = getFingerprint();
        // Ensure session ID is populated on client (was "" during SSR)
        if (!sessionId.current) sessionId.current = getSessionId();
        const sid = sessionId.current;

        const res = await fetch("/api/user/check-device", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, fingerprint, sessionId: sid }),
        });
        const data = await res.json();

        if (data.status === "banned") {
          setBanReason(data.reason ?? "Your account has been suspended.");
          setBanned(true);
          return;
        }

        if (data.status === "warning") {
          toast.error(
            "⚠️ Account sharing detected. Your account will be permanently banned if this happens again.",
            { duration: 8000 }
          );
        }

        // ── Session listener (concurrent login detection) ────────────────────
        // Skip the first snapshot — fires immediately before our write propagates.
        // Use a 5-second grace window before acting on session changes so that
        // a TWA restart or brief background kill doesn't falsely log the user out.
        let initialSnapshotDone = false;
        let logoutTimer: ReturnType<typeof setTimeout> | null = null;

        unsubRef.current = onSnapshot(doc(db, "users", user.uid), (snap) => {
          if (!initialSnapshotDone) { initialSnapshotDone = true; return; }
          const d = snap.data();
          if (!d) return;

          // Admin banned mid-session — act immediately
          if (d.banned === true) {
            setBanReason(d.banReason ?? "Your account has been suspended.");
            setBanned(true);
            return;
          }

          // Another session detected — wait 5 seconds before logging out.
          // If the same session ID reappears (e.g. TWA restart re-registered),
          // cancel the pending logout.
          if (d.activeSessionId && d.activeSessionId !== sid) {
            if (logoutTimer) return; // already counting down
            logoutTimer = setTimeout(() => {
              // Re-read current snapshot value before acting
              const currentSid = d.activeSessionId;
              if (currentSid && currentSid !== sid) {
                signOut(auth);
                toast.error("Your account was signed in on another device. You have been logged out.", { duration: 6000 });
                router.push("/");
              }
              logoutTimer = null;
            }, 5000);
          } else {
            // Session IDs match again — cancel any pending logout
            if (logoutTimer) { clearTimeout(logoutTimer); logoutTimer = null; }
          }
        });
      } catch {
        // Fail silently — never block user for network errors
      }
    })();

    return () => { unsubRef.current?.(); };
  }, [user, authLoading, isAdminPage]);

  // Reset check when user logs out / changes
  useEffect(() => {
    if (!user) {
      checkedRef.current = false;
      unsubRef.current?.();
      unsubRef.current = null;
      setBanned(false);
    }
  }, [user]);

  if (banned) return <BannedScreen reason={banReason} />;
  return <>{children}</>;
}
