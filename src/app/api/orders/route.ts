import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

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

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId || undefined,
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
