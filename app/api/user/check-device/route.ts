import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { token, fingerprint, sessionId } = await req.json();
    if (!token || !fingerprint || !sessionId) {
      return NextResponse.json({ status: "ok" }); // don't block on bad input
    }

    // Verify token
    let uid: string;
    try {
      const decoded = await getAdminAuth().verifyIdToken(token);
      uid = decoded.uid;
    } catch {
      return NextResponse.json({ status: "ok" });
    }

    const db = getAdminDb();
    const ref = db.collection("users").doc(uid);
    const snap = await ref.get();

    if (!snap.exists) return NextResponse.json({ status: "ok" });

    const data = snap.data()!;

    // Already banned
    if (data.banned === true) {
      return NextResponse.json({ status: "banned", reason: data.banReason ?? "Account sharing detected." });
    }

    const stored = data.deviceFingerprint as string | undefined;
    const mismatchCount = (data.deviceMismatchCount as number) || 0;

    if (!stored) {
      // First login — register this device and session
      await ref.update({ deviceFingerprint: fingerprint, activeSessionId: sessionId, deviceMismatchCount: 0 });
      return NextResponse.json({ status: "ok" });
    }

    if (stored === fingerprint) {
      // Same device — update session ID (kicks out any other concurrent session)
      await ref.update({ activeSessionId: sessionId });
      return NextResponse.json({ status: "ok" });
    }

    // Different device detected — flag as suspicious, never auto-ban
    // Admin reviews and manually bans from the dashboard
    const newCount = mismatchCount + 1;
    await ref.update({
      deviceMismatchCount: newCount,
      activeSessionId: sessionId,
      suspicious: true,
    });
    return NextResponse.json({ status: "warning" });

  } catch (err) {
    console.error("check-device error:", err);
    return NextResponse.json({ status: "ok" }); // fail open — don't punish for server errors
  }
}
