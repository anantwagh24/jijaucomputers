import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { hashPassword, normalizePhone } from "@/lib/auth";
import { getAdminSessionFromReq, getCustomerSessionFromReq } from "@/lib/session";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const adminSession = await getAdminSessionFromReq(req);
    const customerSession = await getCustomerSessionFromReq(req);

    // 1. If Admin: return all orders
    if (adminSession) {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      });
      return NextResponse.json(orders);
    }

    // 2. If Customer: return ONLY their own orders
    if (customerSession) {
      const orders = await prisma.order.findMany({
        where: {
          OR: [
            { userId: customerSession.userId },
            { email: customerSession.email.toLowerCase() },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      });
      return NextResponse.json(orders);
    }

    // Unauthenticated caller: Block access
    return NextResponse.json(
      { error: "Unauthorized: Please log in to view orders." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const orderNumber = generateOrderNumber();

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one item." }, { status: 400 });
    }

    const session = await getCustomerSessionFromReq(req);
    let effectiveUserId = session?.userId || data.userId || undefined;

    // If userId not provided, automatically find or create user by phone/email
    if (!effectiveUserId && data.phone) {
      const cleanPhone = normalizePhone(data.phone);
      const cleanEmail = (data.email || `${cleanPhone}@customer.jijaucomputers.com`).trim().toLowerCase();

      // Look up existing user by phone or email
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
        // Auto-provision user account with a secure random hash
        try {
          const newUser = await prisma.user.create({
            data: {
              name: data.customerName?.trim() || "Valued Customer",
              email: cleanEmail,
              phone: cleanPhone,
              password: hashPassword(crypto.randomBytes(16).toString("hex")),
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

    // 1. SERVER-SIDE PRICING VALIDATION & RECALCULATION
    // Fetch all genuine products from the database
    const productIds = data.items
      .map((it: any) => it.productId || it.product?.id)
      .filter(Boolean);

    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const validatedItems: { productId: string | null; name: string; price: number; quantity: number }[] = [];

    for (const item of data.items) {
      const pId = item.productId || item.product?.id;
      const dbProd = pId ? dbProductMap.get(pId) : null;

      // Use genuine DB price (salePrice if active, otherwise price); fallback to submitted only if custom item
      const unitPrice = dbProd 
        ? (dbProd.salePrice && dbProd.salePrice > 0 ? dbProd.salePrice : dbProd.price)
        : Math.max(0, parseFloat(item.price) || 0);

      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      const itemName = dbProd ? dbProd.name : (item.name || item.product?.name || "Hardware Item");

      calculatedSubtotal += unitPrice * quantity;
      validatedItems.push({
        productId: dbProd ? dbProd.id : null,
        name: itemName,
        price: unitPrice,
        quantity,
      });
    }

    // Validate coupon / discount server-side if provided
    let calculatedDiscount = 0;
    if (data.couponCode) {
      const code = String(data.couponCode).trim().toUpperCase();
      if (code === "JIJAU10" || code === "WELCOME10") {
        calculatedDiscount = Math.round(calculatedSubtotal * 0.10);
      } else if (code === "SAVE8") {
        calculatedDiscount = Math.round(calculatedSubtotal * 0.08);
      } else if (code === "FESTIVE12") {
        calculatedDiscount = Math.round(calculatedSubtotal * 0.12);
      }
    } else if (data.discount) {
      const submittedDiscount = parseFloat(data.discount) || 0;
      calculatedDiscount = Math.min(submittedDiscount, Math.round(calculatedSubtotal * 0.20)); // Cap at 20%
    }

    const calculatedTotal = Math.max(0, calculatedSubtotal - calculatedDiscount);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: effectiveUserId,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        notes: data.notes,
        subtotal: calculatedSubtotal,
        discount: calculatedDiscount,
        tax: 0,
        total: calculatedTotal,
        paymentMode: data.paymentMode || "CASH_ON_DELIVERY",
        status: "PENDING",
        items: {
          create: validatedItems,
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
    // Enforce admin session for order status updates
    const adminSession = await getAdminSessionFromReq(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required to update orders." },
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
