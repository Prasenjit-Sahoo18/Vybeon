import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { trackQuerySchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const parsed = trackQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) return createApiError("Invalid query parameters");

    const { page, limit, genre, artist, sort, order } = parsed.data;
    const skip = (page - 1) * limit;

    const where = {
      ...(genre ? { genres: { some: { genre: { slug: genre } } } } : {}),
      ...(artist ? { artist: { slug: artist } } : {}),
    };

    const [tracks, total] = await Promise.all([
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

    const formatted = tracks.map((t) => ({
      ...t,
      genres: t.genres.map((tg) => tg.genre),
    }));

    return createApiSuccess({ data: formatted, page, limit, total, hasMore: skip + limit < total });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch tracks", 500);
  }
}
