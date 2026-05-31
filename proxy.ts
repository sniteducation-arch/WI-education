import { NextRequest, NextResponse } from "next/server";

// ── In-memory rate limiter (best-effort per worker) ───────────────────────────
// For multi-region production: replace with Upstash Redis
const hits = new Map<string, { count: number; reset: number }>();
let reqCount = 0;

function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  // Periodically clean expired entries to prevent memory leak
  if (++reqCount % 2000 === 0) {
    for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
  }
  const rec = hits.get(key);
  if (!rec || now > rec.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  return ++rec.count > limit;
}

// ── Suspicious User-Agent patterns (scanners, exploit tools) ─────────────────
const BLOCKED_UA = /sqlmap|nikto|nmap|masscan|zgrab|dirbuster|gobuster|nuclei|acunetix|nessus/i;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Block path traversal ──────────────────────────────────────────────────
  if (pathname.includes("..") || /(%2e){2}/i.test(pathname) || pathname.includes("%00")) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // ── Block known scanner User-Agents ──────────────────────────────────────
  const ua = req.headers.get("user-agent") ?? "";
  if (BLOCKED_UA.test(ua)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ── Rate limiting ─────────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  let limited = false;

  if (pathname.startsWith("/api/writing/") || pathname.startsWith("/api/speaking/")) {
    // AI evaluation routes — 8 per minute (generous for a student submitting a test)
    limited = rateLimit(`ai:${ip}`, 8, 60_000);
  } else if (pathname.startsWith("/api/user/check-device")) {
    // Device check — 20 per minute
    limited = rateLimit(`dev:${ip}`, 20, 60_000);
  } else if (pathname.startsWith("/api/user/") || pathname === "/") {
    // Auth & user routes — 30 per minute
    limited = rateLimit(`auth:${ip}`, 30, 60_000);
  } else if (pathname.startsWith("/api/admin/")) {
    // Admin routes — 60 per minute
    limited = rateLimit(`adm:${ip}`, 60, 60_000);
  } else if (pathname.startsWith("/api/")) {
    // Other API routes — 60 per minute
    limited = rateLimit(`api:${ip}`, 60, 60_000);
  }

  if (limited) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static assets and Next internals
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.svg$|.*\\.ico$|.*\\.mp3$).*)",
  ],
};
