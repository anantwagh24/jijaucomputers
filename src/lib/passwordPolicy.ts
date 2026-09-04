/**
 * Production-Ready Password Policy & Mobile Validation for Jijau Computers
 */

// Common weak / breached passwords blocklist
export const COMMON_WEAK_PASSWORDS = new Set([
  "password",
  "password123",
  "password1234",
  "12345678",
  "123456789",
  "1234567890",
  "admin123",
  "admin@123",
  "administrator",
  "qwerty123",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "welcome123",
  "welcome@123",
  "iloveyou",
  "letmein123",
  "jijau123",
  "jijau@123",
  "jijaucomputers",
  "computer123",
  "laptop123",
  "gaming123",
  "gaming@123",
  "pass@123",
  "p@ssword",
  "p@ssw0rd",
  "root1234",
  "default123",
  "master123",
]);

export interface PasswordRuleChecks {
  minLength: boolean; // >= 8 chars
  hasUppercase: boolean; // At least 1 [A-Z]
  hasLowercase: boolean; // At least 1 [a-z]
  hasNumber: boolean; // At least 1 [0-9]
  hasSpecialChar: boolean; // At least 1 special char
  noUserData: boolean; // Does not contain name, email, or phone
  notCommon: boolean; // Not in weak password blocklist
  isStrongLength: boolean; // >= 16 chars (Strong Passphrase)
}

export interface PasswordValidationResult {
  isValid: boolean;
  level: "WEAK" | "STANDARD" | "STRONG";
  score: number; // 0 to 100
  label: string;
  color: string;
  barColor: string;
  checks: PasswordRuleChecks;
  errors: string[];
}

/**
 * Normalizes Indian Phone Numbers:
 * Handles +91, 91, leading 0, spaces, dashes.
 * Returns clean 10-digit number.
 */
export function normalizePhone(input: string): string {
  if (!input) return "";
  let digits = input.replace(/\D/g, "");

  // If 13 digits starting with 091 (rare) -> strip 091
  if (digits.length === 13 && digits.startsWith("091")) {
    digits = digits.slice(3);
  }
  // If 12 digits starting with 91 -> strip 91
  else if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }
  // If 11 digits starting with 0 -> strip 0
  else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits;
}

/**
 * Validates Indian Mobile Number:
 * Must be EXACTLY 10 digits and start with 6, 7, 8, or 9.
 */
export function validateIndianMobile(rawPhone: string): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const clean = normalizePhone(rawPhone);

  if (!clean) {
    return { valid: false, normalized: "", error: "Mobile number is required." };
  }

  // Check length
  if (clean.length !== 10) {
    return {
      valid: false,
      normalized: clean,
      error: `Mobile number must be exactly 10 digits (currently ${clean.length} digits).`,
    };
  }

  // Check valid Indian mobile starting digits (6, 7, 8, 9)
  if (!/^[6-9]\d{9}$/.test(clean)) {
    return {
      valid: false,
      normalized: clean,
      error: "Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9.",
    };
  }

  return { valid: true, normalized: clean };
}

/**
 * Validates Password against Security Policies
 */
export function validatePasswordPolicy(
  password: string,
  userContext?: { name?: string; email?: string; phone?: string }
): PasswordValidationResult {
  const errors: string[] = [];
  const pwd = password || "";

  // 1. Checks
  const minLength = pwd.length >= 8;
  const isStrongLength = pwd.length >= 16;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasLowercase = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`§±]/.test(pwd);

  // 2. Blocklist Check
  const lowerPwd = pwd.toLowerCase().trim();
  const notCommon = !COMMON_WEAK_PASSWORDS.has(lowerPwd);

  // 3. User Context Check (does not contain name, email username, phone)
  let noUserData = true;
  if (userContext) {
    const { name, email, phone } = userContext;

    // Check name tokens (>= 3 chars)
    if (name) {
      const nameTokens = name
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length >= 3);
      for (const token of nameTokens) {
        if (lowerPwd.includes(token)) {
          noUserData = false;
          errors.push(`Password must not contain your name ("${token}").`);
          break;
        }
      }
    }

    // Check email prefix
    if (email && noUserData) {
      const emailPrefix = email.split("@")[0]?.toLowerCase();
      if (emailPrefix && emailPrefix.length >= 3 && lowerPwd.includes(emailPrefix)) {
        noUserData = false;
        errors.push(`Password must not contain your email address prefix.`);
      }
    }

    // Check phone number
    if (phone && noUserData) {
      const cleanPhone = normalizePhone(phone);
      if (cleanPhone.length >= 6 && lowerPwd.includes(cleanPhone.slice(-6))) {
        noUserData = false;
        errors.push("Password must not contain parts of your mobile number.");
      }
    }
  }

  // 4. Compile Errors for missing core rules
  if (!minLength) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!hasUppercase) {
    errors.push("Password must contain at least 1 uppercase letter (A-Z).");
  }
  if (!hasLowercase) {
    errors.push("Password must contain at least 1 lowercase letter (a-z).");
  }
  if (!hasNumber) {
    errors.push("Password must contain at least 1 number (0-9).");
  }
  if (!hasSpecialChar) {
    errors.push("Password must contain at least 1 special character (e.g. @, #, $, %, !).");
  }
  if (!notCommon) {
    errors.push("This password is too common or easily guessable. Please choose a more secure password.");
  }

  // 5. Calculate Score (0 - 100)
  let score = 0;
  if (pwd.length >= 8) score += 20;
  if (pwd.length >= 12) score += 15;
  if (pwd.length >= 16) score += 15;
  if (hasUppercase) score += 10;
  if (hasLowercase) score += 10;
  if (hasNumber) score += 10;
  if (hasSpecialChar) score += 10;
  if (noUserData && notCommon && pwd.length >= 8) score += 10;

  score = Math.min(100, Math.max(0, score));

  // Determine standard vs strong
  const meetsStandard =
    minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar &&
    noUserData &&
    notCommon;

  const meetsStrong = meetsStandard && (isStrongLength || score >= 85);

  let level: "WEAK" | "STANDARD" | "STRONG" = "WEAK";
  let label = "Weak";
  let color = "text-rose-400";
  let barColor = "bg-rose-500";

  if (meetsStrong) {
    level = "STRONG";
    label = "Strong Passphrase (Excellent)";
    color = "text-indigo-400";
    barColor = "bg-gradient-to-r from-emerald-500 to-indigo-500";
  } else if (meetsStandard) {
    level = "STANDARD";
    label = "Standard Secure Password";
    color = "text-emerald-400";
    barColor = "bg-emerald-500";
  } else if (score >= 50) {
    level = "WEAK";
    label = "Medium (Missing Requirements)";
    color = "text-amber-400";
    barColor = "bg-amber-500";
  } else {
    level = "WEAK";
    label = "Very Weak";
    color = "text-rose-400";
    barColor = "bg-rose-500";
  }

  const checks: PasswordRuleChecks = {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    noUserData,
    notCommon,
    isStrongLength,
  };

  return {
    isValid: meetsStandard,
    level,
    score,
    label,
    color,
    barColor,
    checks,
    errors,
  };
}
