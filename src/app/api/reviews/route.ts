import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { getAdminSession, getCustomerSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const all = searchParams.get("all") === "true";

    const adminSession = await getAdminSession(req);

    const whereClause: any = {};
    if (productId) {
      whereClause.productId = productId;
    }
    // Only verified admin can view unapproved reviews with ?all=true
    if (!all || !adminSession) {
      whereClause.isApproved = true;
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute metrics if querying for a single product
    if (productId) {
      const approvedReviews = reviews.filter((r) => r.isApproved);
      const totalReviews = approvedReviews.length;
      const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
      const averageRating = totalReviews > 0 ? Number((sum / totalReviews).toFixed(1)) : 5.0;

      const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      approvedReviews.forEach((r) => {
        if (ratingCounts[r.rating] !== undefined) {
          ratingCounts[r.rating]++;
        }
      });

      const ratingPercentages: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      if (totalReviews > 0) {
        Object.keys(ratingCounts).forEach((star) => {
          const s = Number(star);
          ratingPercentages[s] = Math.round((ratingCounts[s] / totalReviews) * 100);
        });
      }

      return NextResponse.json({
        reviews,
        stats: {
          totalReviews,
          averageRating,
          ratingCounts,
          ratingPercentages,
        },
      });
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const limitRes = checkRateLimit(`review_${ip}`, { limit: 10, windowSeconds: 60 });
    if (!limitRes.success) {
      return NextResponse.json(
        { error: "Too many review submissions. Please wait a moment." },
        { status: 429 }
      );
    }

    const customerSession = await getCustomerSession(req);
    const body = await req.json();
    const { productId, customerName, customerPhone, rating, title, comment } = body;

    if (!productId || !customerName?.trim() || !title?.trim() || !comment?.trim()) {
      return NextResponse.json(
        { error: "Please fill all required fields (Name, Review Title, and Comments)." },
        { status: 400 }
      );
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));

    // Check verified buyer status
    let isVerifiedBuyer = false;
    const cleanPhone = customerPhone ? customerPhone.replace(/\D/g, "").slice(-10) : "";

    try {
      const matchConditions: any[] = [];
      if (customerSession?.sub) {
        matchConditions.push({ order: { userId: customerSession.sub } });
      }
      if (cleanPhone) {
        matchConditions.push({ order: { phone: { contains: cleanPhone } } });
      }

      if (matchConditions.length > 0) {
        const orderItemMatch = await prisma.orderItem.findFirst({
          where: {
            productId,
            OR: matchConditions,
          },
        });
        if (orderItemMatch) {
          isVerifiedBuyer = true;
        }
      }
    } catch (err) {
      console.warn("Verified buyer check non-critical warning:", err);
    }

    const newReview = await prisma.review.create({
      data: {
        productId,
        customerName: customerName.trim(),
        customerPhone: customerPhone ? customerPhone.trim() : null,
        userId: customerSession ? customerSession.sub : null,
        rating: numericRating,
        title: title.trim(),
        comment: comment.trim(),
        isVerifiedBuyer,
        isApproved: true,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required." }, { status: 401 });
    }

    const { id, isApproved } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { isApproved: Boolean(isApproved) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating review status:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const adminSession = await getAdminSession(req);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized: Admin privileges required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing review ID" }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
