import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Location generator for realistic Indian visitor IP lookups
function guessLocation(ip: string): string {
  if (ip.includes("2401:4900") || ip.startsWith("116.75")) {
    return "Pune, Maharashtra, India";
  }
  if (ip.includes("2409:40c2")) {
    return "Solapur, Maharashtra, India";
  }
  if (ip.includes("103.24") || ip.includes("49.36")) {
    return "Mumbai, Maharashtra, India";
  }
  if (ip.includes("157.34") || ip.includes("106.210")) {
    return "Aurangabad, Maharashtra, India";
  }
  return "Pune, Maharashtra, India";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    let dateFilter: any = {};
    const now = new Date();

    if (range === "today") {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { gte: startOfDay };
    } else if (range === "yesterday") {
      const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { gte: startOfYesterday, lt: endOfYesterday };
    } else if (range === "7d") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { gte: sevenDaysAgo };
    } else if (range === "30d") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { gte: thirtyDaysAgo };
    }

    const whereClause: any = {
      ...(range !== "all" && dateFilter.gte ? { createdAt: dateFilter } : {}),
      ...(search
        ? {
            OR: [
              { ip: { contains: search } },
              { location: { contains: search } },
              { page: { contains: search } },
              { browser: { contains: search } },
              { os: { contains: search } },
              { device: { contains: search } },
            ],
          }
        : {}),
    };

    const [totalCount, visitors, allLogs] = await Promise.all([
      prisma.visitorLog.count({ where: whereClause }),
      prisma.visitorLog.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.visitorLog.findMany({
        where: range !== "all" && dateFilter.gte ? { createdAt: dateFilter } : {},
        select: { ip: true, device: true, browser: true, os: true, page: true, location: true },
      }),
    ]);

    // Analytics calculations
    const uniqueIps = new Set(allLogs.map((l) => l.ip)).size;
    const desktopCount = allLogs.filter((l) => l.device === "Desktop").length;
    const mobileCount = allLogs.filter((l) => l.device === "Mobile").length;
    const totalLogs = allLogs.length || 1;

    return NextResponse.json({
      visitors,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit) || 1,
      stats: {
        totalVisits: totalCount,
        uniqueVisitors: uniqueIps,
        desktopPct: Math.round((desktopCount / totalLogs) * 100) || 0,
        mobilePct: Math.round((mobileCount / totalLogs) * 100) || 0,
      },
    });
  } catch (error: any) {
    console.error("Fetch Visitors Error:", error);
    return NextResponse.json({ error: "Failed to fetch visitors." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Extract headers / client hints
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      data.ip ||
      "127.0.0.1";

    const userAgent = req.headers.get("user-agent") || data.userAgent || "";

    // Parse Device
    let device = data.device || "Desktop";
    if (!data.device) {
      if (/Android|iPhone|iPod|Mobile/i.test(userAgent)) device = "Mobile";
      else if (/iPad|Tablet/i.test(userAgent)) device = "Tablet";
    }

    // Parse Browser
    let browser = data.browser || "Chrome";
    if (!data.browser) {
      if (userAgent.includes("SamsungBrowser")) browser = "Samsung Internet";
      else if (userAgent.includes("Firefox")) browser = "Firefox";
      else if (userAgent.includes("Edg")) browser = "Edge";
      else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
      else if (userAgent.includes("Chrome")) browser = "Chrome";
    }

    // Parse OS
    let os = data.os || "Windows";
    if (!data.os) {
      if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS")) os = "macOS";
      else if (userAgent.includes("Windows")) os = "Windows";
      else if (userAgent.includes("Android")) os = "Android";
      else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";
      else if (userAgent.includes("Linux")) os = "Linux";
    }

    const location = data.location || guessLocation(ip);

    const log = await prisma.visitorLog.create({
      data: {
        ip,
        location,
        device,
        browser,
        os,
        page: data.page || "/",
        referrer: data.referrer || "—",
        userAgent: userAgent.slice(0, 300),
      },
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error("Log Visitor Error:", error);
    return NextResponse.json({ error: "Failed to log visitor." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const deleted = await prisma.visitorLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cleared ${deleted.count} visitor records older than 30 days.`,
      count: deleted.count,
    });
  } catch (error: any) {
    console.error("Delete Visitors Error:", error);
    return NextResponse.json({ error: "Failed to clear old records." }, { status: 500 });
  }
}
