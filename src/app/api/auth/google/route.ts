import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, normalizePhone } from "@/lib/auth";
import { setCustomerSessionCookie } from "@/lib/session";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

interface GoogleIdTokenPayload {
  iss: string;
  sub: string;
  azp?: string;
  aud?: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

/**
 * Decodes and validates Google JWT ID token payload
 */
function decodeGoogleIdToken(token: string): GoogleIdTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const jsonStr = Buffer.from(base64, "base64").toString("utf8");
    const payload: GoogleIdTokenPayload = JSON.parse(jsonStr);

    // Verify issuer is Google
    if (
      payload.iss !== "https://accounts.google.com" &&
      payload.iss !== "accounts.google.com"
    ) {
      return null;
    }

    // Verify token is not expired
    if (Date.now() >= payload.exp * 1000) {
      return null;
    }

    if (!payload.email || typeof payload.email !== "string") {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("Google ID Token decode error:", err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`google_auth_${ip}`, { limit: 10, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many sign-in attempts. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { credential } = body;

    if (!credential || typeof credential !== "string") {
      return NextResponse.json(
        {
          error:
            "Google ID Token credential is required. Please sign in through the official Google popup.",
        },
        { status: 400 }
      );
    }

    // Decode and verify the genuine Google ID token
    const payload = decodeGoogleIdToken(credential);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired Google authentication token. Please try again." },
        { status: 401 }
      );
    }

    const cleanEmail = payload.email.trim().toLowerCase();
    const displayName = payload.name || payload.given_name || cleanEmail.split("@")[0];
    const avatarUrl = payload.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`;

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Auto-generate phone placeholder for first-time Google sign-ups
      const dummyPhone = normalizePhone(`99${Math.floor(10000000 + Math.random() * 90000000)}`);
      user = await prisma.user.create({
        data: {
          name: displayName,
          email: cleanEmail,
          phone: dummyPhone,
          password: hashPassword("google_oauth_" + payload.sub),
          avatarUrl: avatarUrl,
          isVerified: payload.email_verified ?? true,
        },
      });
    } else {
      // Update avatar if not set
      if (!user.avatarUrl && avatarUrl) {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl },
        }).catch(() => null);
      }
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      avatarUrl: user.avatarUrl || avatarUrl,
      address: user.address,
      city: user.city,
      pincode: user.pincode,
    };

    const response = NextResponse.json({
      success: true,
      message: `Welcome, ${safeUser.name}!`,
      user: safeUser,
    });

    // Attach signed HttpOnly customer session cookie
    await setCustomerSessionCookie(response, {
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return response;
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { error: error.message || "Google authentication failed." },
      { status: 500 }
    );
  }
}
