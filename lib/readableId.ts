import { doc, runTransaction, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Generates and saves a readable ID like "User-Priya-00001"
// Uses a Firestore transaction to keep the counter atomic (no duplicates)
export async function ensureReadableId(uid: string, name: string): Promise<string> {
  const userRef = doc(db, "users", uid);
  const counterRef = doc(db, "meta", "userCounter");

  let readableId = "";

  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef);

    // Already has one — return it
    if (userSnap.exists() && userSnap.data()?.readableId) {
      readableId = userSnap.data()!.readableId;
      return;
    }

    // Increment global counter atomically
    const counterSnap = await tx.get(counterRef);
    const current = counterSnap.exists() ? (counterSnap.data()!.count || 0) : 0;
    const next = current + 1;

    const firstName = (name || "User")
      .split(" ")[0]
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 12) || "User";

    readableId = `User-${firstName}-${String(next).padStart(5, "0")}`;

    tx.set(counterRef, { count: next }, { merge: true });
    tx.update(userRef, { readableId });
  });

  return readableId;
}
