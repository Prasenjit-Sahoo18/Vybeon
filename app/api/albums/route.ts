import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createApiSuccess } from "@/lib/utils";
import { DEMO_ALBUMS } from "@/lib/music/demo-catalog";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    let albums: unknown[] = [];
    let total = 0;

    try {
      const [dbAlbums, count] = await Promise.all([
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

      if (dbAlbums.length > 0) {
        albums = dbAlbums;
        total = count;
      }
    } catch {
      // Ignore DB errors
    }

    if (albums.length === 0) {
      albums = DEMO_ALBUMS.slice(skip, skip + limit);
      total = DEMO_ALBUMS.length;
    }

    return createApiSuccess({ data: albums, page, limit, total, hasMore: skip + limit < total });
  } catch (e) {
    console.error(e);
    return createApiSuccess({ data: DEMO_ALBUMS, page: 1, limit: 20, total: DEMO_ALBUMS.length, hasMore: false });
  }
}
