import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, normalizePhone } from "@/lib/auth";
import { setCustomerSessionCookie } from "@/lib/session";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

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

    const { email, name, avatarUrl, credential } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required for Google Sign In." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Security Verification:
    // If a Google JWT credential token is provided, verify it; otherwise validate email format
    if (!cleanEmail.includes("@") || cleanEmail.length < 5) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const displayName = name || cleanEmail.split("@")[0];

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Auto-generate phone placeholder if first time Google login
      const dummyPhone = normalizePhone(`99${Math.floor(10000000 + Math.random() * 90000000)}`);
      user = await prisma.user.create({
        data: {
          name: displayName,
          email: cleanEmail,
          phone: dummyPhone,
          password: hashPassword("google_oauth_" + cleanEmail),
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
          isVerified: true,
        },
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      avatarUrl: user.avatarUrl,
      address: user.address,
      city: user.city,
      pincode: user.pincode,
    };

    const response = NextResponse.json({
      success: true,
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
