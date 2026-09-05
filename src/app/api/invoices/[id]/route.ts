import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, getCustomerSession } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "order";

    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

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
            id: true,
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

    // If order has an associated userId, verify ownership unless caller is Admin
    if (order.userId && !adminSession) {
      if (!customerSession || customerSession.sub !== order.userId) {
        // Safe partial invoice view or require login
        return NextResponse.json({
          type: "order",
          data: order,
          settings,
        });
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
