import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQuoteNumber } from "@/lib/utils";

export async function GET() {
  try {
    const quotations = await prisma.quotationRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const quoteNumber = generateQuoteNumber();

    const newQuote = await prisma.quotationRequest.create({
      data: {
        quoteNumber,
        customerName: data.customerName,
        companyName: data.companyName,
        phone: data.phone,
        email: data.email,
        type: data.type || "Bulk Order",
        itemsSummary: data.itemsSummary || "",
        message: data.message,
        status: "PENDING",
      },
    });

    return NextResponse.json(newQuote);
  } catch (error) {
    console.error("Error creating quotation:", error);
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await prisma.quotationRequest.update({
      where: { id: data.id },
      data: {
        status: data.status,
        adminNotes: data.adminNotes,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating quotation:", error);
    return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 });
  }
}
