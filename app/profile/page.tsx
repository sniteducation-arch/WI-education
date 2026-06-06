"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import toast from "react-hot-toast";

const CASLON: React.CSSProperties = { fontFamily: "'Libre Caslon Text', Georgia, serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };

export default function ProfilePage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paidAt, setPaidAt] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    setName(user.displayName || "Student");
    setEmail(user.email || "");
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          setPhone(d.phone || "");
          if (d.paidAt?.toDate) setPaidAt(d.paidAt.toDate().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
        }
      } catch { /* non-critical */ }
      setLoading(false);
    })();
  }, [authLoading, user, router]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out.");
    router.push("/");
  };

  if (loading) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fbf9f8" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #eae8e7", borderTopColor: "#000b21", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "100dvh", background: "#fbf9f8" }}>
      <TopBar title="Profile" />
      <main style={{ paddingTop: 80, paddingBottom: 100, paddingLeft: 20, paddingRight: 20 }}>

        {/* Avatar + name */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, background: "#000b21", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <span style={{ ...CASLON, fontSize: 26, fontWeight: 700, color: "#fff" }}>{initials || "WI"}</span>
          </div>
          <h2 style={{ ...CASLON, fontSize: 22, fontWeight: 700, color: "#000b21", marginBottom: 4 }}>{name}</h2>
          <p style={{ ...INTER, fontSize: 13, color: "#44474e" }}>{email}</p>
          {paidAt && (
            <span style={{ display: "inline-block", marginTop: 10, background: "#000b21", color: "#fff", ...INTER, fontSize: 10, fontWeight: 700, padding: "4px 14px", letterSpacing: "0.08em" }}>
              PAID · {paidAt}
            </span>
          )}
        </div>

        {/* Info cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 24, border: "1px solid #c4c6ce" }}>
          {[
            { icon: "person", label: "FULL NAME", value: name },
            { icon: "mail", label: "EMAIL ADDRESS", value: email },
            { icon: "phone", label: "MOBILE NUMBER", value: phone || "Not provided" },
            { icon: "school", label: "COURSE", value: "WI Upskill Mock Test" },
          ].map((item, idx, arr) => (
            <div key={item.label} style={{ background: "#fff", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, borderBottom: idx < arr.length - 1 ? "1px solid #eae8e7" : "none" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#000b21", flexShrink: 0 }}>{item.icon}</span>
              <div>
                <p style={{ ...INTER, fontSize: 10, fontWeight: 600, color: "#44474e", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 3 }}>{item.label}</p>
                <p style={{ ...INTER, fontSize: 14, color: "#000b21", fontWeight: 500 }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {[
            { icon: "receipt_long", label: "View Score Transcript", href: "/transcript" },
            { icon: "gavel", label: "Terms & Conditions", href: "/terms" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              style={{ background: "#fff", border: "1px solid #c4c6ce", borderRadius: 0, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left", width: "100%" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#000b21" }}>{item.icon}</span>
              <span style={{ flex: 1, ...INTER, fontSize: 14, fontWeight: 600, color: "#000b21" }}>{item.label}</span>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#75777e" }}>chevron_right</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ width: "100%", background: "#fff", border: "1px solid #c4c6ce", borderRadius: 0, padding: "14px 0", ...INTER, fontSize: 13, fontWeight: 700, color: "#ba1a1a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "0.06em", textTransform: "uppercase" as const }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
          Log Out
        </button>
      </main>
      <BottomNav />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
