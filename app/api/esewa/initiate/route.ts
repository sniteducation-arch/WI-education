export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminDb, admin } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 });

    const merchantCode = process.env.ESEWA_MERCHANT_CODE!;
    const secretKey = process.env.ESEWA_SECRET_KEY!;
    const isLive = process.env.ESEWA_IS_LIVE === "true";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const amount = Number(process.env.NEXT_PUBLIC_APP_PRICE || 499);

    const transactionUUID = `ME-${uid}-${Date.now()}`;
    const totalAmount = amount.toFixed(2);

    // HMAC-SHA256 signature — secret key stays on server
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=${merchantCode}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(message)
      .digest("base64");

    // Save pending transaction record
    const db = getAdminDb();
    await db.collection("transactions").doc(transactionUUID).set({
      uid,
      amount,
      status: "pending",
      merchantCode,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const gateway = isLive
      ? "https://epay.esewa.com.np/api/epay/main/v2/form"
      : "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    return NextResponse.json({
      gateway,
      fields: {
        amount: totalAmount,
        tax_amount: "0",
        total_amount: totalAmount,
        transaction_uuid: transactionUUID,
        product_code: merchantCode,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: `${baseUrl}/payment/success`,
        failure_url: `${baseUrl}/payment/failed`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (err) {
    console.error("[esewa/initiate]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
