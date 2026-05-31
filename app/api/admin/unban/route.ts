import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

export async function POST(req: NextRequest) {
  try {
    const { token, targetUid } = await req.json();
    const decoded = await getAdminAuth().verifyIdToken(token);
    const callerEmail = decoded.email?.toLowerCase() ?? "";

    if (!ADMIN_EMAILS.includes(callerEmail)) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    const db = getAdminDb();
    await db.collection("users").doc(targetUid).update({
      banned: false,
      banReason: null,
      deviceMismatchCount: 0,
      deviceFingerprint: null,   // reset device so they can bind a new one
      activeSessionId: null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("unban error:", err);
    return NextResponse.json({ error: "Failed to unban." }, { status: 500 });
  }
}
