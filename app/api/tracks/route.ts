import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { trackQuerySchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";
import { DEMO_TRACKS } from "@/lib/music/demo-catalog";
import { Track } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const parsed = trackQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) return createApiError("Invalid query parameters");

    const { page, limit, genre, artist, sort, order } = parsed.data;
    const skip = (page - 1) * limit;

    let formatted: Track[] = [];
    let total = 0;

    try {
      const where = {
        ...(genre ? { genres: { some: { genre: { slug: genre } } } } : {}),
        ...(artist ? { artist: { slug: artist } } : {}),
      };

      const [tracks, count] = await Promise.all([
        prisma.track.findMany({
          where,
          include: {
            artist: { select: { id: true, name: true, slug: true, imageUrl: true, verified: true } },
            album: { select: { id: true, title: true, slug: true, imageUrl: true } },
            genres: { include: { genre: { select: { id: true, name: true, slug: true, color: true } } } },
          },
          orderBy: { [sort]: order },
          skip,
          take: limit,
        }),
        prisma.track.count({ where }),
      ]);

      if (tracks.length > 0) {
        formatted = tracks.map((t) => ({
          ...t,
          genres: t.genres.map((tg) => tg.genre),
        })) as unknown as Track[];
        total = count;
      }
    } catch {
      // Ignore DB errors and use fallback
    }

    // Fallback to DEMO_TRACKS
    if (formatted.length === 0) {
      let pool = DEMO_TRACKS;
      if (genre) {
        pool = pool.filter((t) => (t.genres || []).some((g) => g.slug.toLowerCase() === genre.toLowerCase()));
      }
      if (artist) {
        pool = pool.filter((t) => t.artist?.slug.toLowerCase() === artist.toLowerCase());
      }
      total = pool.length;
      formatted = pool.slice(skip, skip + limit);
    }

    return createApiSuccess({ data: formatted, page, limit, total, hasMore: skip + limit < total });
  } catch (e) {
    console.error(e);
    return createApiSuccess({ data: DEMO_TRACKS.slice(0, 20), page: 1, limit: 20, total: DEMO_TRACKS.length, hasMore: false });
  }
}
