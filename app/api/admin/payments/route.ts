export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

function isAdmin(email: string) {
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());
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
    const snap = await db.collection("qr_requests").orderBy("submittedAt", "desc").get();
    const requests = snap.docs.map((d) => {
      const data = d.data();
      return {
        uid: d.id,
        ...data,
        submittedAt: data.submittedAt?.toDate?.()?.toISOString() || null,
        approvedAt: data.approvedAt?.toDate?.()?.toISOString() || null,
        rejectedAt: data.rejectedAt?.toDate?.()?.toISOString() || null,
      };
    });

    // Suspicious / banned accounts (flagged by device mismatch or manually banned)
    const usersSnap = await db.collection("users")
      .where("suspicious", "==", true)
      .get();
    const suspiciousAccounts = usersSnap.docs.map((d) => {
      const data = d.data();
      return {
        uid: d.id,
        name: data.name || "Unknown",
        email: data.email || "",
        banned: data.banned ?? false,
        banReason: data.banReason ?? "",
        deviceMismatchCount: data.deviceMismatchCount ?? 0,
      };
    });

    return NextResponse.json({ requests, suspiciousAccounts });
  } catch (err) {
    console.error("[admin/payments]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
