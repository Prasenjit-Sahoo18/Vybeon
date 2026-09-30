import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createApiSuccess } from "@/lib/utils";
import { DEMO_ARTISTS } from "@/lib/music/demo-catalog";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    let artists: unknown[] = [];
    let total = 0;

    try {
      const [dbArtists, count] = await Promise.all([
        prisma.artist.findMany({
          orderBy: { monthlyListeners: "desc" },
          include: { _count: { select: { tracks: true, albums: true, followedBy: true } } },
          skip,
          take: limit,
        }),
        prisma.artist.count(),
      ]);

      if (dbArtists.length > 0) {
        artists = dbArtists;
        total = count;
      }
    } catch {
      // Ignore DB errors
    }

    if (artists.length === 0) {
      artists = DEMO_ARTISTS.slice(skip, skip + limit);
      total = DEMO_ARTISTS.length;
    }

    return createApiSuccess({ data: artists, page, limit, total, hasMore: skip + limit < total });
  } catch (e) {
    console.error(e);
    return createApiSuccess({ data: DEMO_ARTISTS, page: 1, limit: 20, total: DEMO_ARTISTS.length, hasMore: false });
  }
}
