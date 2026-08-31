import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

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

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: slug,
        sku: data.sku || undefined,
        description: data.description,
        shortDesc: data.shortDesc,
        price: parseFloat(data.price),
        salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
        stock: parseInt(data.stock) || 0,
        inStock: data.inStock !== undefined ? data.inStock : true,
        warranty: data.warranty || "1 Year Brand Warranty",
        isFeatured: Boolean(data.isFeatured),
        isBestseller: Boolean(data.isBestseller),
        isNewArrival: Boolean(data.isNewArrival),
        isTrending: Boolean(data.isTrending),
        isGamingDeal: Boolean(data.isGamingDeal),
        videoUrl: data.videoUrl || null,
        sliderSeconds: data.sliderSeconds ? parseInt(data.sliderSeconds) : 5,
        specsJson: data.specsJson || null,
        categoryId: data.categoryId,
        brandId: data.brandId || null,
      },
    });

    // Save images
    if (data.images && Array.isArray(data.images)) {
      for (let i = 0; i < data.images.length; i++) {
        const imgUrl = typeof data.images[i] === "string" ? data.images[i] : data.images[i].url;
        if (imgUrl) {
          await prisma.productImage.create({
            data: {
              url: imgUrl,
              isPrimary: i === 0,
              order: i,
              productId: product.id,
            },
          });
        }
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
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
