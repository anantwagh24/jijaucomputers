import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    if (!query) {
      return NextResponse.json({
        orders: [],
        serviceRequests: [],
        customPcRequests: [],
        quotations: [],
      });
    }

    const cleanPhone = normalizePhone(query);
    const cleanEmail = query.toLowerCase();
    const isIdOrNumber = query.toUpperCase();

    // Query across all models in parallel
    const [orders, serviceRequests, customPcRequests, quotations] = await Promise.all([
      // 1. Orders
      prisma.order.findMany({
        where: {
          OR: [
            ...(cleanPhone ? [{ phone: { contains: cleanPhone } }] : []),
            { orderNumber: { contains: isIdOrNumber } },
            { email: { contains: cleanEmail } },
            { customerName: { contains: query } },
          ],
        },
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
      }),

      // 2. Service Requests
      prisma.serviceRequest.findMany({
        where: {
          OR: [
            ...(cleanPhone ? [{ phone: { contains: cleanPhone } }] : []),
            { ticketId: { contains: isIdOrNumber } },
            { email: { contains: cleanEmail } },
            { customerName: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
      }),

      // 3. Custom PC Requests
      prisma.customPcRequest.findMany({
        where: {
          OR: [
            ...(cleanPhone ? [{ phone: { contains: cleanPhone } }] : []),
            { id: { contains: query } },
            { email: { contains: cleanEmail } },
            { customerName: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
      }),

      // 4. Quotations
      prisma.quotationRequest.findMany({
        where: {
          OR: [
            ...(cleanPhone ? [{ phone: { contains: cleanPhone } }] : []),
            { quoteNumber: { contains: isIdOrNumber } },
            { email: { contains: cleanEmail } },
            { customerName: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      orders,
      serviceRequests,
      customPcRequests,
      quotations,
      totalCount: orders.length + serviceRequests.length + customPcRequests.length + quotations.length,
    });
  } catch (error) {
    console.error("Tracking lookup error:", error);
    return NextResponse.json({ error: "Failed to perform tracking search" }, { status: 500 });
  }
}
