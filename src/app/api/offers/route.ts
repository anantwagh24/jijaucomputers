import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized: Admin session required." }, { status: 401 });
    }

    const data = await req.json();
    const offer = await prisma.offer.create({
      data: {
        title: data.title,
        badge: data.badge || "LIMITED TIME",
        description: data.description,
        bannerUrl: data.bannerUrl,
        discountPct: data.discountPct ? parseInt(data.discountPct) : null,
        couponCode: data.couponCode ? data.couponCode.toUpperCase() : null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    return NextResponse.json(offer);
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized: Admin session required." }, { status: 401 });
    }

    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await prisma.offer.update({
      where: { id: data.id },
      data: {
        title: data.title,
        badge: data.badge,
        description: data.description,
        bannerUrl: data.bannerUrl,
        discountPct: data.discountPct ? parseInt(data.discountPct) : null,
        couponCode: data.couponCode ? data.couponCode.toUpperCase() : null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized: Admin session required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.offer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}
