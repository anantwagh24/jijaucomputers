import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        subject: data.subject || "General Enquiry",
        message: data.message,
        productName: data.productName,
        status: "NEW",
      },
    });

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await prisma.enquiry.update({
      where: { id: data.id },
      data: {
        status: data.status,
        adminNotes: data.adminNotes,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}
