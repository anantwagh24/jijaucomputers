const SESSION_SECRET = process.env.SESSION_SECRET || "jijau_secure_secret_key_2026_salt_9988";
const ADMIN_COOKIE_NAME = "jijau_admin_session";
const CUSTOMER_COOKIE_NAME = "jijau_customer_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "SUPERADMIN" | "CUSTOMER";
  name?: string;
  exp: number; // Unix timestamp in seconds
}

// Convert string to Uint8Array with regular ArrayBuffer
function strToU8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Base64URL encode
function base64urlEncode(data: Uint8Array | string): string {
  let str: string;
  if (typeof data === "string") {
    str = btoa(unescape(encodeURIComponent(data)));
  } else {
    let binary = "";
    const bytes = new Uint8Array(data);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    str = btoa(binary);
  }
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Base64URL decode
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeURIComponent(escape(atob(base64)));
}

// Web Crypto HMAC-SHA256 signature generator
async function createHmacSha256(data: string, secret: string): Promise<string> {
  const secretBytes = strToU8(secret);
  const dataBytes = strToU8(data);

  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, dataBytes as unknown as BufferSource);
  return base64urlEncode(new Uint8Array(signature));
}

/**
 * Creates an HMAC-SHA256 signed session token (Header.Payload.Signature)
 */
export async function createSessionToken(
  payload: Omit<SessionPayload, "exp">,
  expiresInSeconds: number = 60 * 60 * 24 * 7
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: SessionPayload = { ...payload, exp };

  const payloadB64 = base64urlEncode(JSON.stringify(fullPayload));
  const signature = await createHmacSha256(payloadB64, SESSION_SECRET);

  return `${payloadB64}.${signature}`;
}

/**
 * Cryptographically verifies session token and checks expiry using Web Crypto
 */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSig = await createHmacSha256(payloadB64, SESSION_SECRET);

  if (signature !== expectedSig) {
    return null;
  }

  try {
    const payload: SessionPayload = JSON.parse(base64urlDecode(payloadB64));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Sets secure HttpOnly Admin session cookie on NextResponse
 */
export async function setAdminSessionCookie(
  response: { cookies: { set: Function } },
  admin: { id: string; email: string; name?: string; role?: string }
) {
  const token = await createSessionToken({
    userId: admin.id,
    email: admin.email,
    role: admin.role === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN",
    name: admin.name || "Store Admin",
  }, 60 * 60 * 24 * 7);

  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set("jijau_admin_auth", "true", {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * Sets secure HttpOnly Customer session cookie on NextResponse
 */
export async function setCustomerSessionCookie(
  response: { cookies: { set: Function } },
  user: { id: string; email: string; name?: string }
) {
  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: "CUSTOMER",
    name: user.name || "Customer",
  }, 60 * 60 * 24 * 30);

  response.cookies.set(CUSTOMER_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
}

/**
 * Inspects request and returns verified Admin session, or null
 */
export async function getAdminSessionFromReq(req: Request): Promise<SessionPayload | null> {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|; )${ADMIN_COOKIE_NAME}=([^;]*)`));
  const token = match ? decodeURIComponent(match[1]) : null;
  const session = await verifySessionToken(token);
  if (session && (session.role === "ADMIN" || session.role === "SUPERADMIN")) {
    return session;
  }
  return null;
}

/**
 * Inspects request and returns verified Customer or Admin session, or null
 */
export async function getCustomerSessionFromReq(req: Request): Promise<SessionPayload | null> {
  const cookieHeader = req.headers.get("cookie") || "";

  // 1. Check customer cookie
  const customerMatch = cookieHeader.match(new RegExp(`(?:^|; )${CUSTOMER_COOKIE_NAME}=([^;]*)`));
  const customerToken = customerMatch ? decodeURIComponent(customerMatch[1]) : null;
  const customerSession = await verifySessionToken(customerToken);
  if (customerSession) return customerSession;

  // 2. Admin fallback
  const adminMatch = cookieHeader.match(new RegExp(`(?:^|; )${ADMIN_COOKIE_NAME}=([^;]*)`));
  const adminToken = adminMatch ? decodeURIComponent(adminMatch[1]) : null;
  const adminSession = await verifySessionToken(adminToken);
  if (adminSession) return adminSession;

  return null;
}
