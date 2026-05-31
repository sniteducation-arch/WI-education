"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightSlot?: React.ReactNode;
}

export default function TopBar({ title = "MoralEdu Care Upskill Prep", showBack, backHref, rightSlot }: TopBarProps) {
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
        background: "#fff",
        borderBottom: "1px solid #c6c5d2",
        height: 64,
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 16,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {showBack ? (
          <button
            onClick={handleBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e1e3e4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <span className="material-symbols-outlined" style={{ color: "#0d2067", fontSize: 22 }}>arrow_back</span>
          </button>
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/logo.png" alt="MoralEdu Care" width={40} height={40} style={{ objectFit: "contain" }} />
          </div>
        )}
        <h1
          style={{
            fontFamily: "'Manrope', system-ui, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#0d2067",
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>

      {rightSlot || (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#dde1ff",
            border: "1.5px solid #c6c5d2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span className="material-symbols-outlined" style={{ color: "#0d2067", fontSize: 20 }}>person</span>
        </div>
      )}
    </header>
  );
}


