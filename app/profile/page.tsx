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
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "4px solid #dde1ff", borderTopColor: "#0d2067", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ minHeight: "100dvh", background: "#f8f9fa" }}>
      <TopBar title="Profile" />
      <main style={{ paddingTop: 80, paddingBottom: 100, paddingLeft: 20, paddingRight: 20 }}>

        {/* Avatar + name */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #0d2067, #4a59a1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: "'Manrope', system-ui, sans-serif" }}>
            {initials || "ME"}
          </div>
          <h2 style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 22, fontWeight: 700, color: "#0d2067", marginBottom: 4 }}>{name}</h2>
          <p style={{ fontSize: 14, color: "#454651" }}>{email}</p>
          {paidAt && (
            <span style={{ display: "inline-block", marginTop: 8, background: "#abf374", color: "#367000", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 9999 }}>
              âœ“ PAID Â· {paidAt}
            </span>
          )}
        </div>

        {/* Info cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {[
            { icon: "person", label: "Full Name", value: name },
            { icon: "mail", label: "Email Address", value: email },
            { icon: "phone", label: "Mobile Number", value: phone || "Not provided" },
            { icon: "school", label: "Course", value: "Upskill Preparation for Students" },
          ].map((item) => (
            <div key={item.label} style={{ background: "#fff", borderRadius: 12, border: "1px solid #c6c5d2", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#dde1ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#0d2067" }}>{item.icon}</span>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#454651", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontSize: 15, color: "#191c1d", fontWeight: 500 }}>{item.value}</p>
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
              style={{ background: "#fff", border: "1px solid #c6c5d2", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left", width: "100%" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#0d2067" }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#191c1d" }}>{item.label}</span>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#c6c5d2" }}>chevron_right</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ width: "100%", background: "#fff", border: "1.5px solid #fca5a5", borderRadius: 12, padding: "14px 0", fontSize: 16, fontWeight: 700, color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
          Log Out
        </button>
      </main>
      <BottomNav />
    </div>
  );
}


