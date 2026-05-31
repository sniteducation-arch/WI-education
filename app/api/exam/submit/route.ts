export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb, admin } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { token, score, cefr, pct, answers, sectionTimes } = await req.json();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await getAdminAuth().verifyIdToken(token);
    const uid = decoded.uid;

    const db = getAdminDb();
    await db.collection("exam_results").add({
      uid,
      score,
      cefr,
      pct,
      answers,
      sectionTimes: sectionTimes || {},
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection("users").doc(uid).set({
      lastExamScore: score,
      lastExamCefr: cefr,
      lastExamPct: pct,
      lastExamAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[exam/submit]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
