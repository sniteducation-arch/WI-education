export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, admin } from "@/lib/firebase-admin";
import { sanitize, isValidEmail, isValidFirebaseUid, stripTags } from "@/lib/validate";

// POST /api/user/create
// Called after signup to assign a readable User ID
// Format: User-Firstname-00001
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const uid = sanitize(body.uid, 128);
    const name = stripTags(sanitize(body.name, 100));
    const email = sanitize(body.email, 254).toLowerCase();
    const phone = sanitize(body.phone, 20);

    if (!isValidFirebaseUid(uid)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const db = getAdminDb();

    // Check if user already has a readableId
    const userSnap = await db.collection("users").doc(uid).get();
    if (userSnap.exists && userSnap.data()?.readableId) {
      return NextResponse.json({ readableId: userSnap.data()!.readableId });
    }

    // Atomically increment the global user counter
    const counterRef = db.collection("meta").doc("userCounter");
    const newCount = await db.runTransaction(async (tx) => {
      const snap = await tx.get(counterRef);
      const current = snap.exists ? (snap.data()!.count || 0) : 0;
      const next = current + 1;
      tx.set(counterRef, { count: next }, { merge: true });
      return next;
    });

    // Build readable ID: User-Firstname-00001
    const firstName = (name || "User").split(" ")[0].replace(/[^a-zA-Z]/g, "") || "User";
    const paddedCount = String(newCount).padStart(5, "0");
    const readableId = `User-${firstName}-${paddedCount}`;

    // Save/update user doc — never overwrite paid status
    const existing = await db.collection("users").doc(uid).get();
    const docData: Record<string, unknown> = {
      name: name || "",
      email: email || "",
      phone: phone || "",
      readableId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    if (!existing.exists) docData.paid = false;
    await db.collection("users").doc(uid).set(docData, { merge: true });

    return NextResponse.json({ readableId });
  } catch (err) {
    console.error("[user/create]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
