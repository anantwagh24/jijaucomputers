import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
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

    // Verify password
    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password. Please verify and try again." },
        { status: 401 }
      );
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

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: safeUser,
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sign in. Please try again." },
      { status: 500 }
    );
  }
}
