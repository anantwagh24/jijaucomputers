import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    let settings = await prisma.websiteSetting.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.websiteSetting.create({
        data: { id: "default" },
      });
    }

    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required to update website settings." },
        { status: 401 }
      );
    }

    const data = await req.json();

    const updated = await prisma.websiteSetting.upsert({
      where: { id: "default" },
      update: {
        storeName: data.storeName,
        tagline: data.tagline,
        logoUrl: data.logoUrl,
        darkLogoUrl: data.darkLogoUrl,
        faviconUrl: data.faviconUrl,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
        address: data.address,
        googleMapsUrl: data.googleMapsUrl,
        openingHours: data.openingHours,
        gstin: data.gstin,
        upiId: data.upiId,
        upiName: data.upiName,
        facebookUrl: data.facebookUrl,
        instagramUrl: data.instagramUrl,
        youtubeUrl: data.youtubeUrl,
        linkedinUrl: data.linkedinUrl,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        branchesJson: typeof data.branchesJson === "string" ? data.branchesJson : JSON.stringify(data.branchesJson || []),
        invoiceTerms: data.invoiceTerms,
        invoiceBankDetails: data.invoiceBankDetails,
        invoiceHsnCode: data.invoiceHsnCode,
        invoiceNotes: data.invoiceNotes,
      },
      create: {
        id: "default",
        ...data,
        branchesJson: typeof data.branchesJson === "string" ? data.branchesJson : JSON.stringify(data.branchesJson || []),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
