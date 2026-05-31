"use client";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { label: "Practice", icon: "exercise", href: "/dashboard" },
  { label: "Results",  icon: "analytics", href: "/transcript" },
  { label: "Payments", icon: "payments",  href: "/payment" },
  { label: "Profile",  icon: "person",    href: "/profile" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        zIndex: 50,
        background: "#fff",
        boxShadow: "0px -4px 12px rgba(13,32,103,0.06)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 72 }}>
        {tabs.map((tab) => {
          const active = pathname === tab.href || (tab.href === "/dashboard" && pathname.startsWith("/test"));
          return (
            <button
              key={tab.label}
              onClick={() => router.push(tab.href)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                background: active ? "#dde1ff" : "transparent",
                border: "none",
                borderRadius: active ? 9999 : 0,
                padding: active ? "6px 18px" : "6px 12px",
                cursor: "pointer",
                transition: "all 0.15s",
                minWidth: 64,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  color: active ? "#0d2067" : "#454651",
                  fontVariationSettings: active ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                }}
              >
                {tab.icon}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 400,
                  color: active ? "#0d2067" : "#454651",
                  lineHeight: 1,
                  fontFamily: "inherit",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}


