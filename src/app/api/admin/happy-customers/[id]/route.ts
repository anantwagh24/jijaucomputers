import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await prisma.happyCustomer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error("Admin get happy customer error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      city,
      village,
      district,
      phone,
      productName,
      photoUrl,
      review,
      rating,
      purchaseDate,
      isFeatured,
      isActive,
      order,
    } = body;

    const data: any = {};
    if (name !== undefined) data.name = name.trim();
    if (city !== undefined) data.city = city.trim();
    if (village !== undefined) data.village = village ? village.trim() : null;
    if (district !== undefined) data.district = district ? district.trim() : "Jalna";
    if (phone !== undefined) data.phone = phone ? phone.trim() : null;
    if (productName !== undefined) data.productName = productName.trim();
    if (photoUrl !== undefined) data.photoUrl = photoUrl.trim();
    if (review !== undefined) data.review = review ? review.trim() : null;
    if (rating !== undefined) data.rating = typeof rating === "number" ? rating : parseInt(rating) || 5;
    if (purchaseDate !== undefined) data.purchaseDate = purchaseDate ? purchaseDate.trim() : null;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (order !== undefined) data.order = typeof order === "number" ? order : parseInt(order) || 0;

    const customer = await prisma.happyCustomer.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    console.error("Admin update happy customer error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.happyCustomer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Customer deleted successfully" });
  } catch (error: any) {
    console.error("Admin delete happy customer error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}
