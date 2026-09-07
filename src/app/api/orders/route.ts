import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { hashPassword, normalizePhone } from "@/lib/auth";
import { getAdminSession, getCustomerSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    const customerSession = await getCustomerSession(req);

    if (!adminSession && !customerSession) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to view your orders." },
        { status: 401 }
      );
    }

    // Admin can see all orders; Customer can only see their own orders
    let whereClause: any = {};
    if (!adminSession) {
      const user = await prisma.user.findUnique({ where: { id: customerSession!.sub } });
      const userPhone = user?.phone ? normalizePhone(user.phone) : "";
      const userEmail = user?.email?.toLowerCase().trim();

      whereClause = {
        OR: [
          { userId: customerSession!.sub },
          ...(userPhone ? [{ phone: userPhone }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });
    return NextResponse.json(orders, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const customerSession = await getCustomerSession(req);

    if (!data.customerName || !data.phone || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { error: "Missing required order information (Name, Phone, Items)." },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const cleanPhone = normalizePhone(data.phone);
    const cleanEmail = (data.email || `${cleanPhone}@customer.jijaucomputers.com`).trim().toLowerCase();

    let effectiveUserId = customerSession ? customerSession.sub : data.userId || undefined;

    // If guest user without session, associate or auto-provision
    if (!effectiveUserId && cleanPhone) {
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: cleanPhone },
            ...(data.email ? [{ email: cleanEmail }] : []),
          ],
        },
      });

      if (user) {
        effectiveUserId = user.id;
        if (!user.address && data.address) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              address: data.address,
              city: data.city || user.city,
              pincode: data.pincode || user.pincode,
            },
          }).catch(() => null);
        }
      } else {
        try {
          const newUser = await prisma.user.create({
            data: {
              name: data.customerName?.trim() || "Valued Customer",
              email: cleanEmail,
              phone: cleanPhone,
              password: hashPassword("Customer@" + cleanPhone.slice(-4)),
              address: data.address || null,
              city: data.city || null,
              pincode: data.pincode || null,
              isVerified: true,
            },
          });
          effectiveUserId = newUser.id;
        } catch (uErr) {
          console.warn("Auto-user creation skipped:", uErr);
        }
      }
    }

    // ==========================================
    // SERVER-SIDE PRICING CALCULATION & INTEGRITY
    // ==========================================
    // Extract item IDs to fetch authentic unit prices from database
    const itemProductIds = data.items
      .map((it: any) => it.productId || it.product?.id)
      .filter(Boolean);

    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: itemProductIds },
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const validatedOrderItems = data.items.map((item: any) => {
      const pId = item.productId || item.product?.id;
      const dbProduct = pId ? productMap.get(pId) : null;
      const quantity = Math.max(1, parseInt(item.quantity) || 1);

      // Use verified DB price if available, otherwise fallback to item.price
      const verifiedUnitPrice = dbProduct
        ? (dbProduct.salePrice !== null && dbProduct.salePrice !== undefined ? dbProduct.salePrice : dbProduct.price)
        : (parseFloat(item.price) || 0);

      const itemName = dbProduct ? dbProduct.name : (item.name || item.product?.name || "Product Item");

      calculatedSubtotal += verifiedUnitPrice * quantity;

      return {
        productId: pId || null,
        name: itemName,
        price: verifiedUnitPrice,
        quantity,
      };
    });

    // Server-side discount & tax calculation
    let calculatedDiscount = 0;
    if (data.couponCode) {
      const cleanCoupon = String(data.couponCode).toUpperCase().trim();
      if (cleanCoupon === "JIJAU10" || cleanCoupon === "WELCOME10") {
        calculatedDiscount = calculatedSubtotal * 0.10;
      } else if (cleanCoupon === "DIWALI8" || cleanCoupon === "GAMING8") {
        calculatedDiscount = calculatedSubtotal * 0.08;
      } else if (cleanCoupon === "SUPER12") {
        calculatedDiscount = calculatedSubtotal * 0.12;
      }
    } else if (data.discount) {
      const clientDiscount = parseFloat(data.discount) || 0;
      // Cap discount to prevent negative or arbitrary totals
      calculatedDiscount = Math.min(clientDiscount, calculatedSubtotal * 0.20);
    }

    const calculatedTotal = Math.max(0, calculatedSubtotal - calculatedDiscount);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: effectiveUserId || null,
        customerName: data.customerName.trim(),
        phone: cleanPhone,
        email: data.email?.trim() || null,
        address: data.address?.trim() || "Store Pickup",
        city: data.city?.trim() || "",
        pincode: data.pincode?.trim() || "",
        notes: data.notes?.trim() || null,
        subtotal: calculatedSubtotal,
        discount: calculatedDiscount,
        tax: 0,
        total: calculatedTotal,
        paymentMode: data.paymentMode || "CASH_ON_DELIVERY",
        status: "PENDING",
        items: {
          create: validatedOrderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required to update orders." },
        { status: 401 }
      );
    }

    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await prisma.order.update({
      where: { id: data.id },
      data: {
        status: data.status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
