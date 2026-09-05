import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { getAdminSession } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session required to edit products." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: slug,
        sku: data.sku,
        description: data.description,
        shortDesc: data.shortDesc,
        price: parseFloat(data.price),
        salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
        stock: parseInt(data.stock) || 0,
        inStock: data.inStock !== undefined ? data.inStock : true,
        warranty: data.warranty,
        isFeatured: Boolean(data.isFeatured),
        isBestseller: Boolean(data.isBestseller),
        isNewArrival: Boolean(data.isNewArrival),
        isTrending: Boolean(data.isTrending),
        isGamingDeal: Boolean(data.isGamingDeal),
        videoUrl: data.videoUrl !== undefined ? data.videoUrl : undefined,
        sliderSeconds: data.sliderSeconds !== undefined ? parseInt(data.sliderSeconds) : undefined,
        specsJson: data.specsJson || null,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
      },
    });

    // Update images if provided
    if (data.images && Array.isArray(data.images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < data.images.length; i++) {
        const imgUrl = typeof data.images[i] === "string" ? data.images[i] : data.images[i].url;
        if (imgUrl) {
          await prisma.productImage.create({
            data: {
              url: imgUrl,
              isPrimary: i === 0,
              order: i,
              productId: id,
            },
          });
        }
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
      },
    });

    return NextResponse.json(fullProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session required to delete products." },
        { status: 401 }
      );
    }

    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
