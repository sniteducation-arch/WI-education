export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

// GET /api/user/me?token=<firebase-id-token>
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await getAdminAuth().verifyIdToken(token);
    const uid = decoded.uid;

    const db = getAdminDb();
    const snap = await db.collection("users").doc(uid).get();

    if (!snap.exists) {
      return NextResponse.json({ paid: false, readableId: "", progress: {}, name: decoded.name || "" });
    }

    const data = snap.data()!;
    return NextResponse.json({
      paid: data.paid || false,
      readableId: data.readableId || "",
      progress: data.progress || {},
      name: data.name || decoded.name || "",
    });
  } catch (err) {
    console.error("[user/me]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
