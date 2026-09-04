import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePasswordPolicy } from "@/lib/passwordPolicy";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    if (admin.password !== currentPassword) {
      return NextResponse.json(
        { error: "Incorrect current password" },
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

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { password: newPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Admin password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

