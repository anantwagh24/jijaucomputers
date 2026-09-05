import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district");
    const city = searchParams.get("city");
    const search = searchParams.get("search");

    const where: any = { isActive: true };

    if (district && district !== "All") {
      where.district = { contains: district };
    }

    if (city && city !== "All") {
      where.city = { contains: city };
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { city: { contains: q } },
        { village: { contains: q } },
        { district: { contains: q } },
        { productName: { contains: q } },
        { review: { contains: q } },
      ];
    }

    const customers = await prisma.happyCustomer.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    // Get list of unique districts and cities for filters
    const allActive = await prisma.happyCustomer.findMany({
      where: { isActive: true },
      select: { district: true, city: true, village: true },
    });

    const districts = Array.from(new Set(allActive.map((c) => c.district).filter(Boolean)));
    const cities = Array.from(new Set(allActive.map((c) => c.city).filter(Boolean)));

    return NextResponse.json({
      success: true,
      customers,
      filters: {
        districts,
        cities,
      },
    });
  } catch (error) {
    console.error("Fetch happy customers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch happy customer stories" },
      { status: 500 }
    );
  }
}
