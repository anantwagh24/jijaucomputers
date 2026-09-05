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

    const cleanUsername = username.trim();

    let admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: cleanUsername.toLowerCase() },
        ],
      },
    });

    // If no admin user exists in DB at all, provision the initial superadmin with a secure bcrypt hash
    if (!admin) {
      const adminCount = await prisma.adminUser.count();
      if (adminCount === 0 && cleanUsername === "admin") {
        const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "adminpassword123";
        if (password === defaultPassword) {
          admin = await prisma.adminUser.create({
            data: {
              username: "admin",
              password: hashPassword(defaultPassword),
              name: "Jijau Store Administrator",
              email: "admin@jijaucomputers.in",
              role: "SUPERADMIN",
            },
          });
        }
      }
      
      if (!admin) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
    }

    // Verify password strictly against bcrypt hash (with fallback hash upgrade)
    const isPasswordValid = verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Upgrade unhashed or legacy password hash to modern bcrypt on successful login
    if (!admin.password.startsWith("$2a$") && !admin.password.startsWith("$2b$")) {
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { password: hashPassword(password) },
      }).catch((err) => console.warn("Admin hash upgrade notice:", err));
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

    // Issue cryptographic HttpOnly Admin Session Cookie
    await setAdminSessionCookie(response, admin);

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
