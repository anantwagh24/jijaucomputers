import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTicketId } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query"); // ticketId or phone
    const ticketId = searchParams.get("ticketId");
    const phone = searchParams.get("phone");

    if (ticketId || phone || query) {
      const searchKey = ticketId || query || "";
      const searchPhone = phone || query || "";

      const requests = await prisma.serviceRequest.findMany({
        where: {
          OR: [
            { ticketId: { contains: searchKey } },
            { phone: { contains: searchPhone } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(requests);
    }

    const allRequests = await prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(allRequests);
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return NextResponse.json({ error: "Failed to fetch service requests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const cleanPhone = (data.phone || "").replace(/[^0-9]/g, "");

    if (!data.customerName || !data.customerName.trim()) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const ticketId = data.ticketId && data.ticketId.trim() ? data.ticketId.trim() : generateTicketId();

    const newRequest = await prisma.serviceRequest.create({
      data: {
        ticketId,
        customerName: data.customerName.trim(),
        phone: cleanPhone,
        email: data.email?.trim() || null,
        deviceType: data.deviceType || "Laptop",
        brand: data.brand || "Standard Brand",
        model: data.model || "Standard Model",
        serialNo: data.serialNo || null,
        issueDesc: data.issueDesc || "Diagnostics & Service Checkup",
        status: data.status || "Received",
        estimatedCost: data.estimatedCost ? parseFloat(data.estimatedCost) : null,
        adminNotes: data.adminNotes || null,
      },
    });

    return NextResponse.json(newRequest);
  } catch (error) {
    console.error("Error creating service request:", error);
    return NextResponse.json({ error: "Failed to create service request" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await prisma.serviceRequest.update({
      where: { id: data.id },
      data: {
        status: data.status,
        adminNotes: data.adminNotes,
        estimatedCost: data.estimatedCost ? parseFloat(data.estimatedCost) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating service request:", error);
    return NextResponse.json({ error: "Failed to update service request" }, { status: 500 });
  }
}
