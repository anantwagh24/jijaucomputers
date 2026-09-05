import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`track_${ip}`, { limit: 20, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many tracking lookups. Please wait a minute." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    if (!query || query.length < 4) {
      return NextResponse.json({
        orders: [],
        serviceRequests: [],
        customPcRequests: [],
        quotations: [],
      });
    }

    const cleanPhone = normalizePhone(query);
    const isIdOrNumber = query.toUpperCase();

    // Query across models with EXACT or strict identifiers rather than loose single-character wildcards
    const [orders, serviceRequests, customPcRequests, quotations] = await Promise.all([
      // 1. Orders (Exact Order Number or Exact Phone Match)
      prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: isIdOrNumber },
            ...(cleanPhone && cleanPhone.length === 10 ? [{ phone: cleanPhone }] : []),
          ],
        },
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
      }),

      // 2. Service Requests (Exact Ticket ID or Exact Phone Match)
      prisma.serviceRequest.findMany({
        where: {
          OR: [
            { ticketId: isIdOrNumber },
            ...(cleanPhone && cleanPhone.length === 10 ? [{ phone: cleanPhone }] : []),
          ],
        },
        orderBy: { createdAt: "desc" },
      }),

      // 3. Custom PC Requests
      prisma.customPcRequest.findMany({
        where: {
          OR: [
            { reqNumber: isIdOrNumber },
            ...(cleanPhone && cleanPhone.length === 10 ? [{ phone: cleanPhone }] : []),
          ],
        },
        orderBy: { createdAt: "desc" },
      }),

      // 4. Quotations
      prisma.quotationRequest.findMany({
        where: {
          OR: [
            { quoteNumber: isIdOrNumber },
            ...(cleanPhone && cleanPhone.length === 10 ? [{ phone: cleanPhone }] : []),
          ],
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Redact overly sensitive full PII for public tracking lookups
    const safeOrders = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName ? `${o.customerName.slice(0, 1)}***` : "Customer",
      city: o.city,
      pincode: o.pincode,
      total: o.total,
      paymentMode: o.paymentMode,
      status: o.status,
      items: o.items.map((it) => ({ name: it.name, quantity: it.quantity, price: it.price })),
      createdAt: o.createdAt,
    }));

    const safeServices = serviceRequests.map((s) => ({
      id: s.id,
      ticketId: s.ticketId,
      customerName: s.customerName ? `${s.customerName.slice(0, 1)}***` : "Customer",
      deviceType: s.deviceType,
      brand: s.brand,
      model: s.model,
      status: s.status,
      estimatedCost: s.estimatedCost,
      createdAt: s.createdAt,
    }));

    return NextResponse.json({
      orders: safeOrders,
      serviceRequests: safeServices,
      customPcRequests,
      quotations,
      totalCount: safeOrders.length + safeServices.length + customPcRequests.length + quotations.length,
    });
  } catch (error) {
    console.error("Tracking lookup error:", error);
    return NextResponse.json({ error: "Failed to perform tracking search" }, { status: 500 });
  }
}
