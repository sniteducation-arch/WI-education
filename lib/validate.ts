// Shared input validation utilities used by API routes

export function sanitize(val: unknown, maxLen = 500): string {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
}

export function isValidEmail(email: string): boolean {
  // RFC 5321 practical regex — rejects obvious non-emails
  const re = /^[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[a-zA-Z]{2,}$/;
  return re.test(email) && email.length <= 254;
}

export function isValidPassword(password: string): { ok: boolean; message: string } {
  if (password.length < 8) return { ok: false, message: "Password must be at least 8 characters." };
  if (!/[0-9]/.test(password)) return { ok: false, message: "Password must contain at least one number." };
  return { ok: true, message: "" };
}

export function isValidFirebaseUid(uid: string): boolean {
  return typeof uid === "string" && /^[a-zA-Z0-9]{20,128}$/.test(uid);
}

export function isValidPhone(phone: string): boolean {
  return /^[0-9]{9,10}$/.test(phone.replace(/[\s\-()]/g, ""));
}

// Strips HTML/script tags to prevent stored XSS in text fields
export function stripTags(val: string): string {
  return val.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "");
}
