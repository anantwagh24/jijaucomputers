import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { getAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized: Admin session required." }, { status: 401 });
    }

    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description,
        imageUrl: data.imageUrl,
        iconName: data.iconName || "Monitor",
        order: Number(data.order) || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized: Admin session required." }, { status: 401 });
    }

    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const updated = await prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug ? slugify(data.slug) : undefined,
        description: data.description,
        imageUrl: data.imageUrl,
        iconName: data.iconName,
        order: Number(data.order) || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
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
    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
