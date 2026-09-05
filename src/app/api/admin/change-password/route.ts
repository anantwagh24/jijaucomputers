import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePasswordPolicy } from "@/lib/passwordPolicy";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { getAdminSessionFromReq } from "@/lib/session";

export async function POST(req: Request) {
  try {
    // 1. Enforce verified Admin cryptographic session
    const session = await getAdminSessionFromReq(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Valid administrator session required." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || !currentPassword) {
      return NextResponse.json(
        { error: "Current password and new password are both required." },
        { status: 400 }
      );
    }

    // Find authenticated admin user
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.userId },
    }) || await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: "admin" },
          { email: session.email },
        ],
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Administrator account not found." }, { status: 404 });
    }

    // 2. Validate current password strictly against stored bcrypt hash (no hardcoded bypass)
    const isCurrentValid = verifyPassword(currentPassword, admin.password);

    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Incorrect current password. Please try again." },
        { status: 401 }
      );
    }

    // 3. Enforce Strong Password Policy
    const pwdValidation = validatePasswordPolicy(newPassword, {
      name: admin.name,
      email: admin.email,
    });

    if (!pwdValidation.isValid) {
      return NextResponse.json(
        {
          error: pwdValidation.errors[0] || "New password does not meet security requirements.",
          details: pwdValidation.errors,
        },
        { status: 400 }
      );
    }

    // 4. Securely hash new password with bcrypt (10 rounds) before saving
    const secureHash = hashPassword(newPassword);

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { password: secureHash },
    });

    return NextResponse.json({
      success: true,
      message: "Admin password updated and securely hashed with bcrypt!",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
