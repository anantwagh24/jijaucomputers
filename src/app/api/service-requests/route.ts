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

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const trackingPhone = cleanPhone.slice(-10);

    // Block duplicate active registrations for the same mobile number
    const existingActive = await prisma.serviceRequest.findFirst({
      where: {
        phone: { contains: trackingPhone },
        status: { notIn: ["Completed", "Delivered", "Cancelled"] },
      },
    });

    if (existingActive) {
      return NextResponse.json(
        {
          error: `An active service ticket (#${trackingPhone}) is already open for this mobile number with status "${existingActive.status}". Duplicate registration is not allowed. You can track this device status directly using your phone number.`,
          existingTicket: existingActive,
        },
        { status: 400 }
      );
    }

    const newRequest = await prisma.serviceRequest.create({
      data: {
        ticketId: trackingPhone, // Ticket number is strictly the mobile number
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        deviceType: data.deviceType,
        brand: data.brand,
        model: data.model,
        serialNo: data.serialNo,
        issueDesc: data.issueDesc,
        status: "Received",
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
