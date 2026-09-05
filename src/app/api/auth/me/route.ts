import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSessionFromReq, getAdminSessionFromReq } from "@/lib/session";

export async function GET(req: Request) {
  try {
    // 1. Authenticate requester via secure cryptographic session
    const customerSession = await getCustomerSessionFromReq(req);
    const adminSession = await getAdminSessionFromReq(req);

    if (!customerSession && !adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to view your profile." },
        { status: 401 }
      );
    }

    // Determine target userId
    const effectiveUserId = customerSession ? customerSession.userId : adminSession?.userId;

    if (!effectiveUserId) {
      return NextResponse.json({ error: "Session identity error." }, { status: 401 });
    }

    // If an admin is requesting, allow looking up user by admin ID or user ID
    let user = await prisma.user.findUnique({
      where: { id: effectiveUserId },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
      },
    });

    // If session belongs to an AdminUser table record, query admin
    if (!user && adminSession) {
      const admin = await prisma.adminUser.findUnique({
        where: { id: adminSession.userId },
      });
      if (admin) {
        return NextResponse.json({
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: "+91 98765 43210",
            avatarUrl: null,
            isVerified: true,
            address: "Admin Headquarters",
            city: "Pune",
            pincode: "411001",
            createdAt: admin.createdAt,
            role: admin.role,
          },
          orders: [],
        });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
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
    return NextResponse.json({ error: "Failed to fetch user profile." }, { status: 500 });
  }
}
