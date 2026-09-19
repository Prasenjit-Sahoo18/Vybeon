import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        orderBy: { monthlyListeners: "desc" },
        include: { _count: { select: { tracks: true, albums: true, followedBy: true } } },
        skip,
        take: limit,
      }),
      prisma.artist.count(),
    ]);

    return createApiSuccess({ data: artists, page, limit, total, hasMore: skip + limit < total });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch artists", 500);
  }
}
