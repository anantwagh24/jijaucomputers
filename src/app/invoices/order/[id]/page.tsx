import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StandaloneInvoiceView from "./StandaloneInvoiceView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Tax Invoice ${id} | Jijau Computers`,
    description: "Official GST Tax Invoice & Warranty Certificate",
  };
}

export default async function OrderInvoiceStandalonePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id }, { orderNumber: id }],
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              warranty: true,
            },
          },
        },
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const settings = await prisma.websiteSetting.findUnique({
    where: { id: "default" },
  });

  return (
    <StandaloneInvoiceView
      order={order}
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
