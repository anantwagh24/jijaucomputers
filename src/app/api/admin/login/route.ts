import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { setAdminSessionCookie } from "@/lib/session";

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

    const cleanUser = username.trim();

    let admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: cleanUser },
          { email: cleanUser.toLowerCase() },
        ],
      },
    });

    // If no admin user exists in DB yet (fresh setup), seed initial admin securely
    if (!admin) {
      const defaultAdminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "adminpassword123";
      if (cleanUser === "admin" && password === defaultAdminPassword) {
        admin = await prisma.adminUser.create({
          data: {
            username: "admin",
            password: hashPassword(defaultAdminPassword),
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

    // Verify password securely using bcrypt with fallback to legacy hash
    const isPasswordValid = verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Progressive hash upgrade: If admin password was stored as plaintext or legacy SHA256, upgrade to bcrypt
    if (!admin.password.startsWith("$2a$") && !admin.password.startsWith("$2b$")) {
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { password: hashPassword(password) },
      }).catch((e) => console.warn("Admin hash upgrade notice:", e));
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

    // 2. Set Cryptographically Signed HttpOnly Admin Session Cookie
    await setAdminSessionCookie(response, {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
