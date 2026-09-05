import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, normalizePhone } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
              { city: { contains: search } },
            ],
          }
        : undefined,
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            paymentMode: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const enrichedUsers = users.map((u) => {
      const totalSpent = u.orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatarUrl: u.avatarUrl,
        isVerified: u.isVerified,
        address: u.address,
        city: u.city || "Pune",
        pincode: u.pincode,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        ordersCount: u.orders.length,
        totalSpent,
        recentOrders: u.orders.slice(0, 5),
      };
    });

    // Summary KPIs
    const totalUsers = users.length;
    const verifiedUsers = users.filter((u) => u.isVerified).length;
    const totalSpendAll = enrichedUsers.reduce((sum, u) => sum + u.totalSpent, 0);
    const totalOrdersCount = enrichedUsers.reduce((sum, u) => sum + u.ordersCount, 0);

    return NextResponse.json({
      users: enrichedUsers,
      stats: {
        totalUsers,
        verifiedUsers,
        totalSpendAll,
        totalOrdersCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.phone) {
      return NextResponse.json(
        { error: "Customer name and phone number are required." },
        { status: 400 }
      );
    }

    const cleanPhone = normalizePhone(data.phone);
    const cleanEmail = (data.email || `${cleanPhone}@customer.jijaucomputers.com`).trim().toLowerCase();

    // Check existing
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ phone: cleanPhone }, { email: cleanEmail }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `User with phone ${cleanPhone} or email ${cleanEmail} already exists.` },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password: hashPassword(data.password || cleanPhone),
        address: data.address?.trim() || null,
        city: data.city?.trim() || "Pune",
        pincode: data.pincode?.trim() || null,
        isVerified: data.isVerified !== undefined ? Boolean(data.isVerified) : true,
      },
    });

    return NextResponse.json(newUser);
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updateData: any = {
      name: data.name?.trim(),
      email: data.email?.trim()?.toLowerCase(),
      address: data.address?.trim() || null,
      city: data.city?.trim() || "Pune",
      pincode: data.pincode?.trim() || null,
      isVerified: data.isVerified !== undefined ? Boolean(data.isVerified) : undefined,
    };

    if (data.phone) {
      updateData.phone = normalizePhone(data.phone);
    }

    if (data.password) {
      updateData.password = hashPassword(data.password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: data.id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
