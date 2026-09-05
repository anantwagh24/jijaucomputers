import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromReq, getCustomerSessionFromReq } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "order"; // 'order' or 'service'

    const adminSession = await getAdminSessionFromReq(req);
    const customerSession = await getCustomerSessionFromReq(req);

    const settings = await prisma.websiteSetting.findUnique({
      where: { id: "default" },
    });

    if (type === "service") {
      const service = await prisma.serviceRequest.findFirst({
        where: {
          OR: [{ id }, { ticketId: id }],
        },
      });

      if (!service) {
        return NextResponse.json({ error: "Service ticket not found" }, { status: 404 });
      }

      // If customer session present, verify ownership unless admin
      if (!adminSession && customerSession) {
        const matchesEmail = service.email && service.email.toLowerCase() === customerSession.email.toLowerCase();
        if (!matchesEmail) {
          // Allow customer if phone matches
          const userRecord = await prisma.user.findUnique({ where: { id: customerSession.userId } });
          if (userRecord && userRecord.phone !== service.phone) {
            return NextResponse.json({ error: "Unauthorized access to this invoice." }, { status: 403 });
          }
        }
      }

      return NextResponse.json({
        type: "service",
        data: service,
        settings,
      });
    }

    // Default: Order invoice
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                warranty: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check ownership if user is logged in
    if (!adminSession && customerSession) {
      if (order.userId && order.userId !== customerSession.userId && order.email?.toLowerCase() !== customerSession.email.toLowerCase()) {
        return NextResponse.json({ error: "Unauthorized access to this invoice." }, { status: 403 });
      }
    }

    return NextResponse.json({
      type: "order",
      data: order,
      settings,
    });
  } catch (error) {
    console.error("Error generating invoice payload:", error);
    return NextResponse.json({ error: "Failed to generate invoice data" }, { status: 500 });
  }
}
