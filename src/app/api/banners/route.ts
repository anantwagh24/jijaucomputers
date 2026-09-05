import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized: Admin session required." }, { status: 401 });
    }

    const data = await req.json();
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        tag: data.tag || "Special Promotion",
        imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1400&auto=format&fit=crop&q=80",
        ctaText: data.ctaText || "Shop Now",
        ctaLink: data.ctaLink || "/products",
        order: Number(data.order) || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
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

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.tag !== undefined) updateData.tag = data.tag;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.ctaText !== undefined) updateData.ctaText = data.ctaText;
    if (data.ctaLink !== undefined) updateData.ctaLink = data.ctaLink;
    if (data.order !== undefined) updateData.order = Number(data.order);
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

    const updated = await prisma.banner.update({
      where: { id: data.id },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
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

    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
