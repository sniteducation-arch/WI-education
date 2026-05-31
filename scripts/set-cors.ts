import { readFileSync } from "fs";
import { resolve } from "path";
import admin from "firebase-admin";

(function loadEnv() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
    for (const line of content.split("\n")) {
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  } catch {}
})();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

async function main() {
  const bucket = admin.storage().bucket();
  await bucket.setCorsConfiguration([
    {
      origin: ["*"],
      method: ["GET", "HEAD"],
      responseHeader: ["Content-Type", "Content-Length", "Accept-Ranges", "Content-Range"],
      maxAgeSeconds: 3600,
    },
  ]);
  console.log("CORS configured on bucket:", bucket.name);
}

main().catch(console.error);
