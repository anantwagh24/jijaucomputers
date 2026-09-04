import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { hashPassword, normalizePhone } from "@/lib/auth";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const orderNumber = generateOrderNumber();

    let effectiveUserId = data.userId || undefined;

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
        // Update user profile info if blank
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
        // Auto-provision user account so they can track orders anytime
        try {
          const newUser = await prisma.user.create({
            data: {
              name: data.customerName?.trim() || "Valued Customer",
              email: cleanEmail,
              phone: cleanPhone,
              password: hashPassword(cleanPhone), // Default password set to phone number for easy 1st login
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
        subtotal: parseFloat(data.subtotal),
        discount: data.discount ? parseFloat(data.discount) : 0,
        tax: data.tax ? parseFloat(data.tax) : 0,
        total: parseFloat(data.total),
        paymentMode: data.paymentMode || "CASH_ON_DELIVERY",
        status: "PENDING",
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId || item.product?.id,
            name: item.name || item.product?.name,
            price: parseFloat(item.price || item.product?.salePrice || item.product?.price),
            quantity: parseInt(item.quantity) || 1,
          })),
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
