import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StandaloneServiceInvoiceView from "./StandaloneServiceInvoiceView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Service Invoice ${id} | Jijau Computers`,
    description: "Official GST Repair & Service Bill",
  };
}

export default async function ServiceInvoiceStandalonePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const service = await prisma.serviceRequest.findFirst({
    where: {
      OR: [{ id }, { ticketId: id }],
    },
  });

  if (!service) {
    notFound();
  }

  const settings = await prisma.websiteSetting.findUnique({
    where: { id: "default" },
  });

  return (
    <StandaloneServiceInvoiceView
      service={service}
      settings={
        settings || {
          storeName: "Jijau Computers",
          tagline: "Your Tech Partner",
          logoUrl: "/images/jijau-logo.jpg",
          phone: "+91 88056 07908",
          email: "sales@jijaucomputers.in",
          address: "Station Road, Maharashtra",
          gstin: "27FQIPK5154C1ZU",
          upiId: "jijauc@ibl",
          upiName: "Jijau Computers",
        }
      }
    />
  );
}
