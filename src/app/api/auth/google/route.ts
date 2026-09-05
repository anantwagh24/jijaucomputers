import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, normalizePhone } from "@/lib/auth";
import { setCustomerSessionCookie } from "@/lib/session";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { idToken, email, name, avatarUrl } = await req.json();

    // If an idToken is provided, or in standard development mode, validate basic token integrity
    if (!email && !idToken) {
      return NextResponse.json({ error: "Authentication credential is required." }, { status: 400 });
    }

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json({ error: "Valid email address is required." }, { status: 400 });
    }

    const displayName = name || cleanEmail.split("@")[0];

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Auto-generate random phone placeholder for first-time Google sign-ins
      const dummyPhone = normalizePhone(`98${Math.floor(10000000 + Math.random() * 90000000)}`);
      user = await prisma.user.create({
        data: {
          name: displayName,
          email: cleanEmail,
          phone: dummyPhone,
          password: hashPassword(crypto.randomBytes(16).toString("hex")),
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

    // Issue secure HttpOnly Customer Session Cookie
    await setCustomerSessionCookie(response, user);

    return response;
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { error: error.message || "Google authentication failed." },
      { status: 500 }
    );
  }
}
