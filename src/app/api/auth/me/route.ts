import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    if (!userId && !email && !phone) {
      return NextResponse.json({ error: "User identifier required." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(email ? [{ email: email.toLowerCase() }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        createdAt: user.createdAt,
      },
      orders: user.orders,
    });
  } catch (error: any) {
    console.error("Fetch Me Error:", error);
    return NextResponse.json({ error: "Failed to fetch user data." }, { status: 500 });
  }
}
