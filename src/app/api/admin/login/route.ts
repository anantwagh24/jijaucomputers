import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Anti-Bruteforce Rate Limiting (Max 10 attempts per 60 seconds per IP)
    const rateCheck = checkRateLimit(`admin_login_${ip}`, { limit: 10, windowSeconds: 60 });
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

    const defaultAdminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "adminpassword123";
    const isMasterReset =
      (username.trim().toLowerCase() === "admin" || username.trim().toLowerCase() === "admin@jijaucomputers.in") &&
      password === defaultAdminPassword;

    let admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: username.trim() },
          { email: username.trim() },
          { username: "admin" },
        ],
      },
    });

    if (!admin) {
      if (isMasterReset) {
        admin = await prisma.adminUser.create({
          data: {
            username: "admin",
            password: defaultAdminPassword,
            name: "Jijau Store Administrator",
            email: "admin@jijaucomputers.in",
            role: "SUPERADMIN",
          },
        });
      } else {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
    }

    // Support both direct match, bcrypt hashed password, and master default reset
    const isPasswordValid =
      isMasterReset ||
      admin.password === password ||
      verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // If master reset password was used and db had drifted, sync it
    if (isMasterReset && admin.password !== defaultAdminPassword) {
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { password: defaultAdminPassword },
      });
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
      httpOnly: false,
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
