import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, normalizePhone } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, avatarUrl } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required for Google Sign In." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = name || cleanEmail.split("@")[0];

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Auto-generate phone placeholder if first time Google login
      const dummyPhone = normalizePhone(`99${Math.floor(10000000 + Math.random() * 90000000)}`);
      user = await prisma.user.create({
        data: {
          name: displayName,
          email: cleanEmail,
          phone: dummyPhone,
          password: hashPassword("google_oauth_auth_user"),
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
          isVerified: true,
        },
      });
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
      user: safeUser,
    });
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    return NextResponse.json(
      { error: error.message || "Google authentication failed." },
      { status: 500 }
    );
  }
}
