import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { getAdminSessionFromReq } from "@/lib/session";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminSessionFromReq(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required." },
        { status: 401 }
      );
    }

    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug: slug,
        logoUrl: data.logoUrl,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const adminSession = await getAdminSessionFromReq(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required." },
        { status: 401 }
      );
    }

    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 });
    }

    const updated = await prisma.brand.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug ? slugify(data.slug) : undefined,
        logoUrl: data.logoUrl,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const adminSession = await getAdminSessionFromReq(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 });
    }

    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
