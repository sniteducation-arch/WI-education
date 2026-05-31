import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

export async function POST(req: NextRequest) {
  try {
    const { token, targetUid, reason } = await req.json();
    const decoded = await getAdminAuth().verifyIdToken(token);
    const callerEmail = decoded.email?.toLowerCase() ?? "";

    if (!ADMIN_EMAILS.includes(callerEmail)) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
    }

    await getAdminDb().collection("users").doc(targetUid).update({
      banned: true,
      banReason: reason || "Account sharing detected. Banned by admin.",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("ban error:", err);
    return NextResponse.json({ error: "Failed to ban." }, { status: 500 });
  }
}
