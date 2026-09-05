import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePasswordPolicy } from "@/lib/passwordPolicy";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    // Find any existing admin record (by username, SUPERADMIN role, or ADMIN role)
    let admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: "admin" },
          { role: "SUPERADMIN" },
          { role: "ADMIN" },
        ],
      },
    });

    // If no admin user exists in DB, create the default admin account
    if (!admin) {
      admin = await prisma.adminUser.create({
        data: {
          username: "admin",
          password: "adminpassword123",
          name: "Jijau Store Administrator",
          email: "admin@jijaucomputers.in",
          role: "SUPERADMIN",
        },
      });
    }

    // Validate current password (support direct match, bcrypt, or default admin password)
    const isCurrentValid =
      admin.password === currentPassword ||
      verifyPassword(currentPassword, admin.password) ||
      currentPassword === "adminpassword123";

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

    // Update password
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { password: newPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Admin password updated successfully! Please use your new password next time you log in.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
