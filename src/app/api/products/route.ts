import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { getAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const newArrival = searchParams.get("newArrival");
    const gaming = searchParams.get("gaming");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStockOnly = searchParams.get("inStockOnly");
    const sort = searchParams.get("sort") || "newest";
    const limit = searchParams.get("limit");

    const where: any = {};

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (bestseller === "true") {
      where.isBestseller = true;
    }

    if (newArrival === "true") {
      where.isNewArrival = true;
    }

    if (gaming === "true") {
      where.isGamingDeal = true;
    }

    if (inStockOnly === "true") {
      where.inStock = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { shortDesc: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-low") {
      orderBy = { price: "asc" };
    } else if (sort === "price-high") {
      orderBy = { price: "desc" };
    } else if (sort === "popular") {
      orderBy = { isBestseller: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit ? parseInt(limit) : undefined,
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Admin session required to create products." },
        { status: 401 }
      );
    }

    const data = await req.json();
    if (!data.name || !data.price) {
      return NextResponse.json(
        { error: "Product title and price are required." },
        { status: 400 }
      );
    }

    // Ensure categoryId is valid
    let categoryId = data.categoryId;
    if (!categoryId) {
      const firstCat = await prisma.category.findFirst();
      if (firstCat) categoryId = firstCat.id;
      else {
        return NextResponse.json(
          { error: "Please create at least one category before adding products." },
          { status: 400 }
        );
      }
    }

    // Generate unique slug
    let baseSlug = data.slug ? slugify(data.slug) : slugify(data.name);
    if (!baseSlug) baseSlug = "product-" + Date.now();
    let finalSlug = baseSlug;

    const existingSlug = await prisma.product.findUnique({
      where: { slug: finalSlug },
    });
    if (existingSlug) {
      finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        slug: finalSlug,
        sku: data.sku?.trim() || undefined,
        description: data.description || data.name,
        shortDesc: data.shortDesc || null,
        price: parseFloat(data.price) || 0,
        salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
        stock: parseInt(data.stock) || 0,
        inStock: data.inStock !== undefined ? Boolean(data.inStock) : true,
        warranty: data.warranty || "1 Year Brand Warranty",
        isFeatured: Boolean(data.isFeatured),
        isBestseller: Boolean(data.isBestseller),
        isNewArrival: Boolean(data.isNewArrival),
        isTrending: Boolean(data.isTrending),
        isGamingDeal: Boolean(data.isGamingDeal),
        videoUrl: data.videoUrl || null,
        sliderSeconds: data.sliderSeconds ? parseInt(data.sliderSeconds) : 5,
        specsJson: data.specsJson || null,
        categoryId: categoryId,
        brandId: data.brandId || null,
      },
    });

    // Save images (handle both data.images array and data.imageUrl string)
    const rawImages = Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : (data.imageUrl ? [data.imageUrl] : []);

    for (let i = 0; i < rawImages.length; i++) {
      const imgUrl = typeof rawImages[i] === "string" ? rawImages[i] : rawImages[i]?.url;
      if (imgUrl && typeof imgUrl === "string" && imgUrl.trim() !== "") {
        await prisma.productImage.create({
          data: {
            url: imgUrl.trim(),
            isPrimary: i === 0,
            order: i,
            productId: product.id,
          },
        });
      }
    }

    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        brand: true,
        images: true,
      },
    });

    return NextResponse.json(fullProduct);
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
