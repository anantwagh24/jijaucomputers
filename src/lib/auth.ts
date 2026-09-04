import bcrypt from "bcryptjs";
import crypto from "crypto";
export { normalizePhone, validateIndianMobile, validatePasswordPolicy } from "./passwordPolicy";

const BCRYPT_SALT_ROUNDS = 10;
const LEGACY_SALT = "jijau_secure_salt_2026";

/**
 * Hashes password securely using bcrypt with 10 salt rounds.
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Verifies password against bcrypt hash, with fallback to legacy sha256.
 */
export function verifyPassword(password: string, hash: string): boolean {
  if (!password || !hash) return false;

  // 1. Check bcrypt hash (standard format starts with $2a$ or $2b$)
  if (hash.startsWith("$2a$") || hash.startsWith("$2b$")) {
    try {
      return bcrypt.compareSync(password, hash);
    } catch {
      return false;
    }
  }

  // 2. Fallback check for legacy SHA-256 hashes
  const legacyHash = crypto.createHash("sha256").update(password + LEGACY_SALT).digest("hex");
  return legacyHash === hash;
}

