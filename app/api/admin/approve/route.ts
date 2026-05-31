export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb, admin } from "@/lib/firebase-admin";

function isAdmin(email: string) {
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());
  return admins.includes(email.toLowerCase());
}

// POST /api/admin/approve
// Body: { token, targetUid }
export async function POST(req: NextRequest) {
  try {
    const { token, targetUid } = await req.json();
    if (!token || !targetUid) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const decoded = await getAdminAuth().verifyIdToken(token);
    if (!isAdmin(decoded.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getAdminDb();
    const batch = db.batch();

    // Mark request approved
    batch.update(db.collection("qr_requests").doc(targetUid), {
      status: "approved",
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      approvedBy: decoded.email,
    });

    // Unlock the user's account (set+merge so it works even if doc is missing)
    batch.set(db.collection("users").doc(targetUid), {
      paid: true,
      paymentMethod: "qr",
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      paidAmount: 500,
    }, { merge: true });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/approve]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
