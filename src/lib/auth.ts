import crypto from "crypto";

export function normalizePhone(phone: string): string {
  if (!phone) return "";
  // Remove all non-digits
  let digits = phone.replace(/\D/g, "");
  // Remove leading 0 if 11 digits (e.g. 09420418389 -> 9420418389)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  // Remove country code 91 if 12 digits (e.g. 919420418389 -> 9420418389)
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  return digits;
}

export function hashPassword(password: string): string {
  const salt = "jijau_secure_salt_2026";
  return crypto.createHash("sha256").update(password + salt).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
