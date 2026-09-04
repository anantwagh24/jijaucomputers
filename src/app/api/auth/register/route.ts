import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validateIndianMobile, validatePasswordPolicy } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Please provide Full Name, Email, Mobile Number, and Password." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Strict Indian Mobile Validation (exactly 10 digits starting with 6-9)
    const phoneValidation = validateIndianMobile(phone);
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { error: phoneValidation.error || "Invalid mobile number. Please provide a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }
    const cleanPhone = phoneValidation.normalized;

    // 2. Strict Password Policy Validation (Standard & Strong requirements)
    const pwdValidation = validatePasswordPolicy(password, {
      name,
      email: cleanEmail,
      phone: cleanPhone,
    });

    if (!pwdValidation.isValid) {
      return NextResponse.json(
        {
          error: pwdValidation.errors[0] || "Password does not meet security requirements.",
          details: pwdValidation.errors,
          checks: pwdValidation.checks,
        },
        { status: 400 }
      );
    }

    // Check duplicate by email
    const existingEmailUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmailUser) {
      return NextResponse.json(
        { error: `An account with email (${cleanEmail}) already exists. Please sign in.` },
        { status: 409 }
      );
    }

    // Check duplicate by phone
    const existingPhoneUser = await prisma.user.findUnique({
      where: { phone: cleanPhone },
    });
    if (existingPhoneUser) {
      return NextResponse.json(
        { error: `An account with mobile number (${cleanPhone}) already exists. Please sign in.` },
        { status: 409 }
      );
    }

    // Create user with secure bcrypt hash
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password: hashPassword(password),
        isVerified: true,
      },
    });

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      isVerified: newUser.isVerified,
      avatarUrl: newUser.avatarUrl,
      address: newUser.address,
      city: newUser.city,
      pincode: newUser.pincode,
    };

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user: safeUser,
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
