import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required." }, { status: 401 });
    }

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

    if (!data.name || !data.phone || !data.message) {
      return NextResponse.json({ error: "Name, phone, and message are required." }, { status: 400 });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email ? data.email.trim().toLowerCase() : null,
        subject: data.subject || "General Enquiry",
        message: data.message.trim(),
        productName: data.productName || null,
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
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required." }, { status: 401 });
    }

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
