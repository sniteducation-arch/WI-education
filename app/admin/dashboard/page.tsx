"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

const H = "'Manrope', system-ui, sans-serif";
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

interface Request {
  uid: string;
  readableId: string;
  name: string;
  email: string;
  note: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
}

interface SuspiciousAccount {
  uid: string;
  name: string;
  email: string;
  banned: boolean;
  banReason: string;
  deviceMismatchCount: number;
  lastSuspiciousAt: string | null;
}

interface AdminNotification {
  id: string;
  type: "new_user" | "suspicious_login";
  uid: string;
  name: string;
  email: string;
  phone?: string;
  readableId?: string;
  deviceMismatchCount?: number;
  createdAt: string | null;
  read: boolean;
}

type Filter = "pending" | "approved" | "rejected" | "all";
type AdminTab = "payments" | "suspicious" | "notifications";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("notifications");
  const [requests, setRequests] = useState<Request[]>([]);
  const [suspiciousAccounts, setSuspiciousAccounts] = useState<SuspiciousAccount[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [token, setToken] = useState("");
  const [actionUid, setActionUid] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingUid, setRejectingUid] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      const freshToken = await getIdToken(auth.currentUser);
      const res = await fetch(`/api/admin/payments?token=${freshToken}`);
      if (!res.ok) { toast.error("Failed to load requests."); return; }
      const data = await res.json();
      setRequests(data.requests || []);
      setSuspiciousAccounts(data.suspiciousAccounts || []);
      setAdminNotifications(data.adminNotifications || []);
    } catch {
      toast.error("Failed to load requests.");
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/admin"); return; }
      if (!ADMIN_EMAILS.includes((user.email || "").toLowerCase())) {
        await signOut(auth);
        router.push("/admin");
        return;
      }
      setAdminEmail(user.email || "");
      setToken("ready");
      await fetchRequests();
      setLoading(false);
    });
    return () => unsub();
  }, [router, fetchRequests]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => fetchRequests(), 30000);
    return () => clearInterval(interval);
  }, [token, fetchRequests]);

  const handleApprove = async (uid: string) => {
    setActionUid(uid);
    try {
      if (!auth.currentUser) throw new Error("Not signed in");
      const freshToken = await getIdToken(auth.currentUser);
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: freshToken, targetUid: uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Payment approved! User now has full access.");
      await fetchRequests();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Approval failed.");
    } finally {
      setActionUid(null);
    }
  };

  const handleReject = async (uid: string) => {
    setActionUid(uid);
    try {
      if (!auth.currentUser) throw new Error("Not signed in");
      const freshToken = await getIdToken(auth.currentUser);
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: freshToken, targetUid: uid, reason: rejectReason || "Payment could not be verified." }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Request rejected.");
      setRejectingUid(null);
      setRejectReason("");
      await fetchRequests();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Rejection failed.");
    } finally {
      setActionUid(null);
    }
  };

  const handleBan = async (uid: string) => {
    setActionUid(uid);
    try {
      if (!auth.currentUser) throw new Error("Not signed in");
      const freshToken = await getIdToken(auth.currentUser);
      const res = await fetch("/api/admin/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: freshToken, targetUid: uid, reason: "Account sharing detected. Banned by admin." }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Account banned. User will be signed out immediately.");
      await fetchRequests();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Ban failed.");
    } finally {
      setActionUid(null);
    }
  };

  const handleUnban = async (uid: string) => {
    setActionUid(uid);
    try {
      if (!auth.currentUser) throw new Error("Not signed in");
      const freshToken = await getIdToken(auth.currentUser);
      const res = await fetch("/api/admin/unban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: freshToken, targetUid: uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Account unbanned. Device binding reset.");
      await fetchRequests();
    } catch (err: unknown) {
      toast.error((err as Error).message || "Unban failed.");
    } finally {
      setActionUid(null);
    }
  };

  const filtered = requests.filter((r) => filter === "all" ? true : r.status === filter);
  const counts = { pending: requests.filter((r) => r.status === "pending").length, approved: requests.filter((r) => r.status === "approved").length, rejected: requests.filter((r) => r.status === "rejected").length };

  if (loading) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d2067" }}>
      <div style={{ width: 40, height: 40, border: "4px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh", background: "#f8f9fa" }}>
      {/* Admin top bar */}
      <header style={{ background: "#0d2067", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>ADMIN PORTAL</p>
          <h1 style={{ fontFamily: H, fontSize: 18, fontWeight: 700, color: "#fff" }}>
            {activeTab === "payments" ? "Payment Approvals" : activeTab === "suspicious" ? "Suspicious Accounts" : "Admin Alerts"}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{adminEmail}</span>
          <button onClick={async () => { await signOut(auth); router.push("/admin"); }}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main tab switcher */}
      <div style={{ display: "flex", background: "#0d2067", padding: "0 16px 14px", gap: 6 }}>
        {([
          ["notifications", "🔔 Alerts"],
          ["payments", "💳 Payments"],
          ["suspicious", "🚨 Suspicious"],
        ] as [AdminTab, string][]).map(([tab, label]) => {
          const badge = tab === "suspicious" ? suspiciousAccounts.length
            : tab === "notifications" ? adminNotifications.filter((n) => !n.read).length
            : 0;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: "9px 0", borderRadius: 9999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: activeTab === tab ? "#fff" : "rgba(255,255,255,0.15)", color: activeTab === tab ? "#0d2067" : "#fff", fontFamily: "inherit", position: "relative" }}>
              {label}
              {badge > 0 && (
                <span style={{ position: "absolute", top: -4, right: 6, background: "#ef4444", color: "#fff", borderRadius: 9999, fontSize: 10, fontWeight: 800, padding: "1px 5px" }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── NOTIFICATIONS TAB ───────────────────────────────────────── */}
      {activeTab === "notifications" && (
        <div style={{ padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
          {adminNotifications.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#767682" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>🔔</p>
              <p style={{ fontSize: 15 }}>No notifications yet</p>
            </div>
          )}
          {adminNotifications.map((n) => (
            <div key={n.id} style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${n.type === "suspicious_login" ? "#fde68a" : "#bbf7d0"}`, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <p style={{ fontFamily: H, fontSize: 14, fontWeight: 700, color: "#191c1d" }}>
                    {n.type === "new_user" ? "🆕 New Registration" : "⚠️ Suspicious Login"}
                  </p>
                  <p style={{ fontSize: 12, color: "#454651", marginTop: 2 }}>{n.name} — {n.email}</p>
                </div>
                <span style={{ fontSize: 10, color: "#767682", whiteSpace: "nowrap" }}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleString("en-GB") : "—"}
                </span>
              </div>
              <div style={{ background: "#f8f9fa", borderRadius: 8, padding: 10, fontSize: 12, color: "#454651", display: "flex", flexDirection: "column", gap: 4 }}>
                {n.readableId && <DetailRow label="User ID" value={n.readableId} />}
                {n.phone && <DetailRow label="Phone" value={n.phone} />}
                {n.type === "suspicious_login" && n.deviceMismatchCount !== undefined && (
                  <DetailRow label="Mismatch #" value={`${n.deviceMismatchCount} different device(s)`} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SUSPICIOUS ACCOUNTS TAB ─────────────────────────────────── */}
      {activeTab === "suspicious" && (
        <div style={{ padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
          {suspiciousAccounts.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#767682" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>✅</p>
              <p style={{ fontSize: 15 }}>No suspicious accounts detected</p>
            </div>
          )}
          {suspiciousAccounts.map((a) => (
            <div key={a.uid} style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${a.banned ? "#fecaca" : "#fde68a"}`, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <p style={{ fontFamily: H, fontSize: 15, fontWeight: 700, color: "#191c1d" }}>{a.name}</p>
                  <p style={{ fontSize: 12, color: "#454651" }}>{a.email}</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 9999, background: a.banned ? "#fee2e2" : "#fef3c7", color: a.banned ? "#dc2626" : "#92400e" }}>
                  {a.banned ? "BANNED" : "WARNING"}
                </span>
              </div>
              <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 10, marginBottom: 12 }}>
                <DetailRow label="Mismatch Count" value={`${a.deviceMismatchCount} device(s) detected`} />
                {a.banned && a.banReason && <DetailRow label="Reason" value={a.banReason} />}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {!a.banned && (
                  <button
                    onClick={() => handleBan(a.uid)}
                    disabled={actionUid === a.uid}
                    style={{ flex: 1, background: actionUid === a.uid ? "#e1e3e4" : "#dc2626", color: actionUid === a.uid ? "#767682" : "#fff", border: "none", borderRadius: 9999, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: actionUid === a.uid ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                  >
                    {actionUid === a.uid ? "Banning…" : "🚫 Ban Account"}
                  </button>
                )}
                {a.banned && (
                  <button
                    onClick={() => handleUnban(a.uid)}
                    disabled={actionUid === a.uid}
                    style={{ flex: 1, background: actionUid === a.uid ? "#e1e3e4" : "#16a34a", color: actionUid === a.uid ? "#767682" : "#fff", border: "none", borderRadius: 9999, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: actionUid === a.uid ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                  >
                    {actionUid === a.uid ? "Unbanning…" : "✓ Unban Account"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PAYMENTS TAB ─────────────────────────────────────────────── */}
      {activeTab === "payments" && <>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "16px 16px 0" }}>
        {[
          { label: "Pending", count: counts.pending, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
          { label: "Approved", count: counts.approved, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
          { label: "Rejected", count: counts.rejected, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
        ].map((s) => (
          <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 12, padding: 12, textAlign: "center" }}>
            <p style={{ fontFamily: H, fontSize: 24, fontWeight: 800, color: s.color }}>{s.count}</p>
            <p style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, padding: "14px 16px", overflowX: "auto" }}>
        {(["pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "8px 16px", borderRadius: 9999, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: filter === f ? "#0d2067" : "#e1e3e4", color: filter === f ? "#fff" : "#454651", whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {f !== "all" ? `(${counts[f as keyof typeof counts]})` : `(${requests.length})`}
          </button>
        ))}
        <button onClick={() => fetchRequests()} style={{ padding: "8px 14px", borderRadius: 9999, border: "1px solid #c6c5d2", cursor: "pointer", fontSize: 12, fontWeight: 600, background: "#fff", color: "#0d2067", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", marginLeft: "auto", flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>refresh</span>
          Refresh
        </button>
      </div>

      {/* Requests list */}
      <div style={{ padding: "0 16px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#767682" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, display: "block", marginBottom: 12 }}>inbox</span>
            <p style={{ fontSize: 15 }}>No {filter === "all" ? "" : filter} requests</p>
          </div>
        )}

        {filtered.map((r) => (
          <div key={r.uid} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${r.status === "pending" ? "#fde68a" : r.status === "approved" ? "#bbf7d0" : "#fecaca"}`, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <p style={{ fontFamily: H, fontSize: 16, fontWeight: 700, color: "#191c1d" }}>{r.name}</p>
                <p style={{ fontSize: 13, color: "#454651" }}>{r.email}</p>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 9999,
                background: r.status === "pending" ? "#fef3c7" : r.status === "approved" ? "#dcfce7" : "#fee2e2",
                color: r.status === "pending" ? "#92400e" : r.status === "approved" ? "#16a34a" : "#dc2626",
              }}>
                {r.status.toUpperCase()}
              </span>
            </div>

            {/* Details */}
            <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 12, marginBottom: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              <DetailRow label="User ID" value={r.readableId || r.uid.slice(0, 8)} />
              <DetailRow label="Amount" value={`NPR ${r.amount}`} />
              <DetailRow label="Submitted" value={r.submittedAt ? new Date(r.submittedAt).toLocaleString("en-GB") : "—"} />
              {r.note && <DetailRow label="Note" value={r.note} />}
              {r.approvedAt && <DetailRow label="Approved" value={new Date(r.approvedAt).toLocaleString("en-GB")} />}
            </div>

            {/* Action buttons — only for pending */}
            {r.status === "pending" && (
              <div>
                {rejectingUid === r.uid ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <input
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection (optional)"
                      style={{ width: "100%", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 12px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { setRejectingUid(null); setRejectReason(""); }}
                        style={{ flex: 1, background: "#f3f4f5", border: "none", borderRadius: 9999, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        Cancel
                      </button>
                      <button onClick={() => handleReject(r.uid)} disabled={actionUid === r.uid}
                        style={{ flex: 1, background: "#dc2626", color: "#fff", border: "none", borderRadius: 9999, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        {actionUid === r.uid ? "Rejecting…" : "Confirm Reject"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setRejectingUid(r.uid)}
                      style={{ flex: 1, background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 9999, padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      Reject
                    </button>
                    <button onClick={() => handleApprove(r.uid)} disabled={actionUid === r.uid}
                      style={{ flex: 2, background: actionUid === r.uid ? "#e1e3e4" : "#16a34a", color: actionUid === r.uid ? "#767682" : "#fff", border: "none", borderRadius: 9999, padding: "11px 0", fontSize: 14, fontWeight: 700, cursor: actionUid === r.uid ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      {actionUid === r.uid ? "Approving…" : <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>Approve Payment</>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      </> /* end payments tab */}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
      <span style={{ fontSize: 12, color: "#767682", fontWeight: 600, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: "#191c1d", fontFamily: mono ? "monospace" : "inherit", textAlign: "right", wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}
