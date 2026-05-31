export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb, admin } from "@/lib/firebase-admin";

function isAdmin(email: string) {
  const raw = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const admins = raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email.toLowerCase());
}

// POST /api/admin/reject
// Body: { token, targetUid, reason }
export async function POST(req: NextRequest) {
  try {
    const { token, targetUid, reason } = await req.json();
    if (!token || !targetUid) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const decoded = await getAdminAuth().verifyIdToken(token);
    if (!isAdmin(decoded.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getAdminDb();
    await db.collection("qr_requests").doc(targetUid).update({
      status: "rejected",
      rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
      rejectedBy: decoded.email,
      rejectionReason: reason || "Payment could not be verified.",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/reject]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
