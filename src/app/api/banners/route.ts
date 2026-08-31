import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const data = await req.json();
    const banner = await prisma.banner.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        tag: data.tag || "Special Promotion",
        imageUrl: data.imageUrl,
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
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await prisma.banner.update({
      where: { id: data.id },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        tag: data.tag,
        imageUrl: data.imageUrl,
        ctaText: data.ctaText,
        ctaLink: data.ctaLink,
        order: Number(data.order) || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
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
