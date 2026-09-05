import { NextResponse, type NextRequest } from "next/server";

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.JWT_SECRET ||
  "jijau_super_secure_session_secret_2026_98a7b6c5d4e3f2";

const ADMIN_COOKIE_NAME = "jijau_admin_session";
const CUSTOMER_COOKIE_NAME = "jijau_customer_session";

export interface SessionPayload {
  sub: string; // User ID
  role: "ADMIN" | "SUPERADMIN" | "CUSTOMER";
  email: string;
  name: string;
  exp: number; // Expiration timestamp in ms
  iat: number; // Issued at timestamp in ms
}

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf8").toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64url").toString("utf8");
  }
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return atob(base64);
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token using Web Crypto API.
 */
export async function signSessionToken(
  payload: Omit<SessionPayload, "iat" | "exp">,
  expiresInDays = 7
): Promise<string> {
  const iat = Date.now();
  const exp = iat + expiresInDays * 24 * 60 * 60 * 1000;
  const fullPayload: SessionPayload = { ...payload, iat, exp };

  const dataStr = base64UrlEncode(JSON.stringify(fullPayload));
  const enc = new TextEncoder();
  const key = await getHmacKey(SESSION_SECRET);
  const signatureBuffer = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(dataStr));
  const signature = bufferToBase64Url(signatureBuffer);

  return `${dataStr}.${signature}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 session token using Web Crypto API.
 */
export async function verifySessionToken(token: string | null | undefined): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [dataStr, signature] = parts;
  const enc = new TextEncoder();

  try {
    const key = await getHmacKey(SESSION_SECRET);
    const expectedSigBuffer = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(dataStr));
    const expectedSignature = bufferToBase64Url(expectedSigBuffer);

    if (signature !== expectedSignature) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(base64UrlDecode(dataStr));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Attaches signed Admin session cookie to NextResponse.
 */
export async function setAdminSessionCookie(
  response: NextResponse,
  user: { id: string; email: string; name: string; role?: string }
) {
  const token = await signSessionToken(
    {
      sub: user.id,
      role: (user.role as any) === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN",
      email: user.email,
      name: user.name,
    },
    7
  );

  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Clear legacy plaintext cookie if present
  response.cookies.set("jijau_admin_auth", "", { path: "/", maxAge: 0 });

  return response;
}

/**
 * Attaches signed Customer session cookie to NextResponse.
 */
export async function setCustomerSessionCookie(
  response: NextResponse,
  user: { id: string; email: string; name: string }
) {
  const token = await signSessionToken(
    {
      sub: user.id,
      role: "CUSTOMER",
      email: user.email,
      name: user.name,
    },
    30
  );

  response.cookies.set(CUSTOMER_COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}

/**
 * Extracts and verifies Admin session from incoming Request or NextRequest.
 */
export async function getAdminSession(req: Request | NextRequest): Promise<SessionPayload | null> {
  let token: string | undefined;

  if ("cookies" in req && typeof (req as NextRequest).cookies?.get === "function") {
    const cookie = (req as NextRequest).cookies.get(ADMIN_COOKIE_NAME);
    if (cookie) token = cookie.value;
  }

  if (!token) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const cookies = parseCookies(cookieHeader);
      token = cookies[ADMIN_COOKIE_NAME];
    }
  }

  if (!token) return null;

  const session = await verifySessionToken(token);
  if (session && (session.role === "ADMIN" || session.role === "SUPERADMIN")) {
    return session;
  }
  return null;
}

/**
 * Extracts and verifies Customer session from incoming Request or NextRequest.
 */
export async function getCustomerSession(req: Request | NextRequest): Promise<SessionPayload | null> {
  let token: string | undefined;

  if ("cookies" in req && typeof (req as NextRequest).cookies?.get === "function") {
    const cookie = (req as NextRequest).cookies.get(CUSTOMER_COOKIE_NAME);
    if (cookie) token = cookie.value;
  }

  if (!token) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const cookies = parseCookies(cookieHeader);
      token = cookies[CUSTOMER_COOKIE_NAME];
    }
  }

  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Clears authentication session cookies on logout.
 */
export function clearSessionCookies(response: NextResponse, type: "admin" | "customer" | "all" = "all") {
  if (type === "admin" || type === "all") {
    response.cookies.set(ADMIN_COOKIE_NAME, "", { path: "/", maxAge: 0 });
    response.cookies.set("jijau_admin_auth", "", { path: "/", maxAge: 0 });
  }
  if (type === "customer" || type === "all") {
    response.cookies.set(CUSTOMER_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  }
  return response;
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const list: Record<string, string> = {};
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    if (parts.length === 2) {
      list[parts[0].trim()] = decodeURIComponent(parts[1].trim());
    }
  });
  return list;
}
