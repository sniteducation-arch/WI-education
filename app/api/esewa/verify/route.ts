export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminDb, admin } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { encodedData } = await req.json();
    if (!encodedData) {
      return NextResponse.json({ success: false, error: "No payment data received" }, { status: 400 });
    }

    // 1. Decode eSewa's base64 response
    let decoded: Record<string, string>;
    try {
      decoded = JSON.parse(Buffer.from(encodedData, "base64").toString("utf-8"));
    } catch {
      return NextResponse.json({ success: false, error: "Invalid payment data format" }, { status: 400 });
    }

    const { transaction_uuid, total_amount, product_code, signed_field_names, signature } = decoded;

    // 2. Verify HMAC signature — proves data came from eSewa
    const secretKey = process.env.ESEWA_SECRET_KEY!;
    const fields = signed_field_names.split(",");
    const message = fields.map((f) => `${f}=${decoded[f]}`).join(",");
    const expectedSig = crypto
      .createHmac("sha256", secretKey)
      .update(message)
      .digest("base64");

    if (signature !== expectedSig) {
      console.error("[esewa/verify] Signature mismatch — possible tampered response");
      return NextResponse.json({ success: false, error: "Signature verification failed" }, { status: 400 });
    }

    // 3. Verify with eSewa's status API (second independent check)
    const isLive = process.env.ESEWA_IS_LIVE === "true";
    const statusBase = isLive
      ? "https://epay.esewa.com.np/api/epay/transaction/status/"
      : "https://rc-epay.esewa.com.np/api/epay/transaction/status/";

    const statusRes = await fetch(
      `${statusBase}?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`,
      { headers: { Accept: "application/json" } }
    );
    const esewaData = await statusRes.json();

    if (esewaData.status !== "COMPLETE") {
      return NextResponse.json({ success: false, error: `eSewa status: ${esewaData.status}` }, { status: 400 });
    }

    // 4. Look up our transaction record
    const db = getAdminDb();
    const txRef = db.collection("transactions").doc(transaction_uuid);
    const txSnap = await txRef.get();

    if (!txSnap.exists) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    const txData = txSnap.data()!;

    // Idempotent — if already processed, return success without double-writing
    if (txData.status === "completed") {
      return NextResponse.json({ success: true, uid: txData.uid, alreadyProcessed: true });
    }

    // 5. Atomic batch: mark transaction complete + unlock user access
    const batch = db.batch();
    batch.update(txRef, {
      status: "completed",
      esewaRefId: esewaData.ref_id || "",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.update(db.collection("users").doc(txData.uid), {
      paid: true,
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      paidAmount: txData.amount,
      transactionId: transaction_uuid,
    });
    await batch.commit();

    return NextResponse.json({ success: true, uid: txData.uid });
  } catch (err) {
    console.error("[esewa/verify]", err);
    return NextResponse.json({ success: false, error: "Server error during verification" }, { status: 500 });
  }
}
