import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePcReqNumber } from "@/lib/utils";

export async function GET() {
  try {
    const requests = await prisma.customPcRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching custom pc requests:", error);
    return NextResponse.json({ error: "Failed to fetch custom pc requests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const reqNumber = generatePcReqNumber();

    const newRequest = await prisma.customPcRequest.create({
      data: {
        reqNumber,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email,
        budget: data.budget,
        purpose: data.purpose || "Gaming",
        cpuPref: data.cpuPref,
        gpuPref: data.gpuPref,
        ramPref: data.ramPref,
        storagePref: data.storagePref,
        cabinetPref: data.cabinetPref,
        notes: data.notes,
        totalEst: data.totalEst ? parseFloat(data.totalEst) : undefined,
        status: "PENDING",
      },
    });

    return NextResponse.json(newRequest);
  } catch (error) {
    console.error("Error creating custom pc request:", error);
    return NextResponse.json({ error: "Failed to create custom pc request" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updated = await prisma.customPcRequest.update({
      where: { id: data.id },
      data: {
        status: data.status,
        adminNotes: data.adminNotes,
        totalEst: data.totalEst ? parseFloat(data.totalEst) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating custom pc request:", error);
    return NextResponse.json({ error: "Failed to update custom pc request" }, { status: 500 });
  }
}
