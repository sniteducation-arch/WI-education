export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

function isAdmin(email: string) {
  const raw = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const admins = raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email.toLowerCase());
}

// GET /api/admin/payments?token=<firebase-id-token>
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await getAdminAuth().verifyIdToken(token);
    if (!isAdmin(decoded.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getAdminDb();

    // Payment requests
    let requests: unknown[] = [];
    try {
      const snap = await db.collection("qr_requests").orderBy("submittedAt", "desc").get();
      requests = snap.docs.map((d) => {
        const data = d.data();
        return {
          uid: d.id,
          ...data,
          submittedAt: data.submittedAt?.toDate?.()?.toISOString() || null,
          approvedAt: data.approvedAt?.toDate?.()?.toISOString() || null,
          rejectedAt: data.rejectedAt?.toDate?.()?.toISOString() || null,
        };
      });
    } catch (e) {
      console.error("[admin/payments] qr_requests fetch failed:", e);
    }

    // Suspicious / banned accounts
    let suspiciousAccounts: unknown[] = [];
    try {
      const usersSnap = await db.collection("users").where("suspicious", "==", true).get();
      suspiciousAccounts = usersSnap.docs.map((d) => {
        const data = d.data();
        return {
          uid: d.id,
          name: data.name || "Unknown",
          email: data.email || "",
          banned: data.banned ?? false,
          banReason: data.banReason ?? "",
          deviceMismatchCount: data.deviceMismatchCount ?? 0,
          lastSuspiciousAt: data.lastSuspiciousAt?.toDate?.()?.toISOString() || null,
        };
      });
    } catch (e) {
      console.error("[admin/payments] suspicious fetch failed:", e);
    }

    // Admin notifications (new registrations + suspicious events)
    let adminNotifications: unknown[] = [];
    try {
      const notifSnap = await db.collection("admin_notifications")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();
      adminNotifications = notifSnap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        };
      });
    } catch (e) {
      console.error("[admin/payments] notifications fetch failed:", e);
    }

    return NextResponse.json({ requests, suspiciousAccounts, adminNotifications });
  } catch (err) {
    console.error("[admin/payments]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
