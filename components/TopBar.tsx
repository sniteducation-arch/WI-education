"use client";
import { useRouter } from "next/navigation";

const CASLON: React.CSSProperties = { fontFamily: "'Libre Caslon Text', Georgia, serif" };

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightSlot?: React.ReactNode;
}

export default function TopBar({ title = "Upskill", showBack, backHref, rightSlot }: TopBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        zIndex: 50,
        background: "#fbf9f8",
        borderBottom: "1px solid #c4c6ce",
        height: 64,
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {showBack ? (
          <button
            onClick={handleBack}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span className="material-symbols-outlined" style={{ color: "#000b21", fontSize: 22 }}>arrow_back</span>
          </button>
        ) : (
          <span className="material-symbols-outlined" style={{ color: "#000b21", fontSize: 22 }}>school</span>
        )}
        <h1 style={{ ...CASLON, fontSize: 20, fontWeight: 700, color: "#000b21", margin: 0 }}>
          {title}
        </h1>
      </div>

      {rightSlot || (
        <div
          style={{
            width: 34,
            height: 34,
            border: "1px solid #c4c6ce",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#eae8e7",
          }}
        >
          <span className="material-symbols-outlined" style={{ color: "#000b21", fontSize: 18 }}>person</span>
        </div>
      )}
    </header>
  );
}
