import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone, verifyPassword, hashPassword } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { setCustomerSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Anti-Bruteforce Rate Limiting (Max 8 attempts per minute per IP)
    const rateCheck = checkRateLimit(`customer_login_${ip}`, { limit: 8, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Too many sign-in attempts. Please wait ${rateCheck.resetSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Please enter your Email or Mobile Number and Password." },
        { status: 400 }
      );
    }

    const rawInput = identifier.trim();
    const cleanEmail = rawInput.toLowerCase();
    const cleanPhone = normalizePhone(rawInput);

    // Search user by email OR by normalized mobile number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this Email or Mobile Number. Please sign up." },
        { status: 404 }
      );
    }

    // Verify password against bcrypt / legacy hash
    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password. Please verify and try again." },
        { status: 401 }
      );
    }

    // Progressive migration: Upgrade legacy plain or SHA-256 hash to bcrypt in background
    if (!user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword(password) },
      }).catch((e) => console.warn("Background hash upgrade note:", e));
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
      message: `Welcome back, ${user.name}!`,
      user: safeUser,
    });

    // Set secure HttpOnly Customer Session Cookie
    await setCustomerSessionCookie(response, user);

    return response;
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Login service error. Please try again." },
      { status: 500 }
    );
  }
}
