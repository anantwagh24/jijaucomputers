import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession, getAdminSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const customerSession = await getCustomerSession(req);
    const adminSession = await getAdminSession(req);

    if (!customerSession && !adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Active session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    // If caller is Admin, allow inspecting requestedUserId.
    // If caller is Customer, they can ONLY inspect their own sub/userId.
    let targetUserId: string;
    if (adminSession && requestedUserId) {
      targetUserId = requestedUserId;
    } else if (customerSession) {
      targetUserId = customerSession.sub;
    } else if (adminSession) {
      targetUserId = requestedUserId || adminSession.sub;
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
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
