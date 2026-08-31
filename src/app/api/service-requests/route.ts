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
    const trackingCode = cleanPhone ? cleanPhone : generateTicketId("JC-SRV");

    // Check for existing active service ticket for this phone number to avoid duplicates
    if (cleanPhone.length >= 10) {
      const existingActive = await prisma.serviceRequest.findFirst({
        where: {
          phone: { contains: cleanPhone.slice(-10) },
          status: { notIn: ["Completed", "Delivered", "Cancelled"] },
        },
      });

      if (existingActive) {
        // Append update to active case instead of creating duplicate fragmented tickets
        const updated = await prisma.serviceRequest.update({
          where: { id: existingActive.id },
          data: {
            issueDesc: `${existingActive.issueDesc}\n[Recent Request]: Device: ${data.deviceType} ${data.brand || ""} ${data.model || ""}. Issue: ${data.issueDesc}`,
            deviceType: `${existingActive.deviceType} & ${data.deviceType}`,
            brand: data.brand || existingActive.brand,
            model: data.model || existingActive.model,
          },
        });
        return NextResponse.json({ ...updated, isExistingUpdated: true });
      }
    }

    const newRequest = await prisma.serviceRequest.create({
      data: {
        ticketId: trackingCode,
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
