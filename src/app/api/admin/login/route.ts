import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Anti-Bruteforce Rate Limiting (Max 5 attempts per 60 seconds per IP)
    const rateCheck = checkRateLimit(`admin_login_${ip}`, { limit: 5, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Too many login attempts. For security reasons, please wait ${rateCheck.resetSeconds} seconds.` },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Support both direct match and bcrypt hashed admin password
    const isPasswordValid = admin.password === password || verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

    // 2. Set Admin Session Cookie with Security Flags
    response.cookies.set("jijau_admin_auth", "true", {
      path: "/",
      httpOnly: false, // Accessible by frontend middleware / state
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
