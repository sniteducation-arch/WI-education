"use client";
import { usePathname, useRouter } from "next/navigation";

const INTER: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };

const tabs = [
  { label: "PRACTICE", icon: "menu_book",  href: "/dashboard" },
  { label: "RESULTS",  icon: "analytics",  href: "/transcript" },
  { label: "PAYMENTS", icon: "payments",   href: "/payment" },
  { label: "PROFILE",  icon: "person",     href: "/profile" },
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
        background: "#fbf9f8",
        borderTop: "1px solid #c4c6ce",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "stretch", height: 72 }}>
        {tabs.map((tab) => {
          const active = pathname === tab.href || (tab.href === "/dashboard" && pathname.startsWith("/test"));
          return (
            <button
              key={tab.label}
              onClick={() => router.push(tab.href)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                background: "transparent",
                border: "none",
                borderTop: active ? "2px solid #775a19" : "2px solid transparent",
                cursor: "pointer",
                paddingTop: 10,
                transition: "all 0.15s",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: 22,
                  color: active ? "#775a19" : "#44474e",
                  fontVariationSettings: active ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                }}
              >
                {tab.icon}
              </span>
              <span
                style={{
                  ...INTER,
                  fontSize: 9,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#775a19" : "#44474e",
                  letterSpacing: "0.08em",
                  lineHeight: 1,
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
