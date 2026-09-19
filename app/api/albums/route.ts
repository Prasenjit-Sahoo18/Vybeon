import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        include: {
          artist: { select: { id: true, name: true, slug: true, imageUrl: true, verified: true } },
          _count: { select: { tracks: true } },
        },
        orderBy: { releaseDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.album.count(),
    ]);

    return createApiSuccess({ data: albums, page, limit, total, hasMore: skip + limit < total });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch albums", 500);
  }
}
