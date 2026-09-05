import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getAdminSession } from "@/lib/session";

function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const clean = phone.replace(/\D/g, "");
  if (clean.length >= 10) {
    return clean.slice(0, 2) + "******" + clean.slice(-2);
  }
  return "******";
}

function maskName(name: string | null | undefined): string {
  if (!name) return "Customer";
  const parts = name.trim().split(" ");
  if (parts.length > 1) {
    return `${parts[0]} ${parts[1].charAt(0)}.`;
  }
  return parts[0];
}

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

    if (!query || query.length < 3) {
      return NextResponse.json({
        orders: [],
        serviceRequests: [],
        customPcRequests: [],
        quotations: [],
      });
    }

    const adminSession = await getAdminSession(req);
    const cleanPhone = normalizePhone(query);
    const isIdOrNumber = query.toUpperCase();

    // Query across models with exact matching on identifiers
    const [orders, serviceRequests, customPcRequests, quotations] = await Promise.all([
      // 1. Orders
      prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: isIdOrNumber },
            ...(cleanPhone ? [{ phone: cleanPhone }] : []),
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
            { ticketId: isIdOrNumber },
            ...(cleanPhone ? [{ phone: cleanPhone }] : []),
          ],
        },
        orderBy: { createdAt: "desc" },
      }),

      // 3. Custom PC Requests
      prisma.customPcRequest.findMany({
        where: {
          OR: [
            { reqNumber: isIdOrNumber },
            ...(cleanPhone ? [{ phone: cleanPhone }] : []),
          ],
        },
        orderBy: { createdAt: "desc" },
      }),

      // 4. Quotations
      prisma.quotationRequest.findMany({
        where: {
          OR: [
            { quoteNumber: isIdOrNumber },
            ...(cleanPhone ? [{ phone: cleanPhone }] : []),
          ],
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // If caller is NOT Admin, mask PII in tracking response
    const safeOrders = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: adminSession ? o.customerName : maskName(o.customerName),
      phone: adminSession ? o.phone : maskPhone(o.phone),
      city: o.city,
      status: o.status,
      paymentMode: o.paymentMode,
      total: o.total,
      createdAt: o.createdAt,
      items: o.items.map((it) => ({
        name: it.name,
        quantity: it.quantity,
      })),
    }));

    const safeServices = serviceRequests.map((s) => ({
      id: s.id,
      ticketId: s.ticketId,
      customerName: adminSession ? s.customerName : maskName(s.customerName),
      deviceType: s.deviceType,
      brand: s.brand,
      model: s.model,
      issueDesc: s.issueDesc,
      status: s.status,
      estimatedCost: s.estimatedCost,
      createdAt: s.createdAt,
    }));

    const safeCustomPcs = customPcRequests.map((c) => ({
      id: c.id,
      reqNumber: c.reqNumber,
      customerName: adminSession ? c.customerName : maskName(c.customerName),
      purpose: c.purpose,
      budget: c.budget,
      status: c.status,
      totalEst: c.totalEst,
      createdAt: c.createdAt,
    }));

    const safeQuotes = quotations.map((q) => ({
      id: q.id,
      quoteNumber: q.quoteNumber,
      customerName: adminSession ? q.customerName : maskName(q.customerName),
      type: q.type,
      status: q.status,
      createdAt: q.createdAt,
    }));

    return NextResponse.json({
      orders: safeOrders,
      serviceRequests: safeServices,
      customPcRequests: safeCustomPcs,
      quotations: safeQuotes,
      totalCount: safeOrders.length + safeServices.length + safeCustomPcs.length + safeQuotes.length,
    });
  } catch (error) {
    console.error("Tracking lookup error:", error);
    return NextResponse.json({ error: "Failed to perform tracking search" }, { status: 500 });
  }
}
