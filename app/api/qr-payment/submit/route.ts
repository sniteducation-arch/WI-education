export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

// POST /api/qr-payment/submit
// Saves QR payment request using the Firebase Client SDK via a helper
// (no Admin SDK needed — user is already authenticated client-side)
export async function POST(req: NextRequest) {
  try {
    const { uid, name, email, note, readableId } = await req.json();
    if (!uid || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use Firebase Admin if credentials are available, otherwise return success
    // and let the client write directly (handled in the payment page)
    try {
      const { getAdminDb, admin } = await import("@/lib/firebase-admin");
      const db = getAdminDb();

      const existing = await db.collection("qr_requests").doc(uid).get();
      if (existing.exists && existing.data()?.status === "approved") {
        return NextResponse.json({ error: "Account already approved" }, { status: 400 });
      }

      await db.collection("qr_requests").doc(uid).set({
        uid,
        readableId: readableId || uid.slice(0, 8),
        name: name || "Unknown",
        email,
        note: note || "",
        amount: 500,
        status: "pending",
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      return NextResponse.json({ success: true, method: "admin" });
    } catch {
      // Admin SDK not configured — tell client to write directly
      return NextResponse.json({ success: true, method: "client" });
    }
  } catch (err) {
    console.error("[qr-payment/submit]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
