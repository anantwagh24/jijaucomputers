import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePasswordPolicy } from "@/lib/passwordPolicy";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { getAdminSession, setAdminSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getAdminSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session required." },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    // Find the logged-in admin user from database
    const admin = await prisma.adminUser.findUnique({
      where: { id: session.sub },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin account not found." },
        { status: 404 }
      );
    }

    // Validate current password securely
    const isCurrentValid = verifyPassword(currentPassword, admin.password);

    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Incorrect current password. Please try again." },
        { status: 401 }
      );
    }

    // Enforce Password Policy for Admin
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

    // Hash the new password with bcrypt
    const hashedNewPassword = hashPassword(newPassword);

    // Update password in database
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { password: hashedNewPassword },
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin password updated successfully! Please use your new password next time you log in.",
    });

    // Refresh session cookie
    await setAdminSessionCookie(response, {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    return response;
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
