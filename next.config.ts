import type { NextConfig } from "next";

// NOTE: CSP is intentionally omitted — Firebase Auth + Google OAuth use many
// dynamic endpoints that break under a strict CSP. The other headers below
// cover the most critical attack vectors (clickjacking, MIME sniffing, etc.).
// If you add a CDN like Cloudflare in front, its WAF handles the rest.

const securityHeaders = [
  // Prevents clickjacking — stops your app being embedded in an iframe
  { key: "X-Frame-Options", value: "DENY" },
  // Prevents MIME type sniffing attacks
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Legacy XSS filter for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Don't leak the full URL in the Referer header to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Enforce HTTPS for 2 years (only active in production with a real domain)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Disable unused browser APIs that could be abused
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), interest-cohort=(), payment=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // Disable x-powered-by header (don't advertise Next.js version)
  poweredByHeader: false,
};

export default nextConfig;
