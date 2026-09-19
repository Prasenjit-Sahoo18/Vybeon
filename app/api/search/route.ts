import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { searchQuerySchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const parsed = searchQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) return createApiError("Invalid query");

    const { q, type, page, limit } = parsed.data;
    const skip = (page - 1) * limit;
    const search = { contains: q, mode: "insensitive" as const };

    const results: Record<string, unknown> = {};

    if (type === "all" || type === "tracks") {
      results.tracks = await prisma.track.findMany({
        where: { OR: [{ title: search }, { artist: { name: search } }] },
        include: {
          artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
          album: { select: { id: true, title: true, slug: true, imageUrl: true } },
          genres: { include: { genre: { select: { id: true, name: true, slug: true, color: true } } } },
        },
        take: limit,
        skip,
        orderBy: { playCount: "desc" },
      }).then((tracks) => tracks.map((t) => ({ ...t, genres: t.genres.map((tg) => tg.genre) })));
    }

    if (type === "all" || type === "artists") {
      results.artists = await prisma.artist.findMany({
        where: { name: search },
        include: { _count: { select: { tracks: true, followedBy: true } } },
        take: limit,
        skip,
        orderBy: { monthlyListeners: "desc" },
      });
    }

    if (type === "all" || type === "albums") {
      results.albums = await prisma.album.findMany({
        where: { OR: [{ title: search }, { artist: { name: search } }] },
        include: {
          artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
          _count: { select: { tracks: true } },
        },
        take: limit,
        skip,
        orderBy: { releaseDate: "desc" },
      });
    }

    if (type === "all" || type === "playlists") {
      results.playlists = await prisma.playlist.findMany({
        where: { AND: [{ isPublic: true }, { name: search }] },
        include: {
          user: { select: { id: true, name: true, username: true, image: true } },
          _count: { select: { tracks: true } },
        },
        take: limit,
        skip,
      });
    }

    return createApiSuccess({ q, type, results });
  } catch (e) {
    console.error(e);
    return createApiError("Search failed", 500);
  }
}
