import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { searchQuerySchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";
import { DEMO_TRACKS, DEMO_ARTISTS, DEMO_ALBUMS } from "@/lib/music/demo-catalog";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const parsed = searchQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) return createApiError("Invalid query");

    const { q, type, page, limit } = parsed.data;
    const skip = (page - 1) * limit;
    const qLower = q.toLowerCase();

    const results: Record<string, unknown> = {};

    try {
      const search = { contains: q, mode: "insensitive" as const };

      if (type === "all" || type === "tracks") {
        const dbTracks = await prisma.track.findMany({
          where: { OR: [{ title: search }, { artist: { name: search } }] },
          include: {
            artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
            album: { select: { id: true, title: true, slug: true, imageUrl: true } },
            genres: { include: { genre: { select: { id: true, name: true, slug: true, color: true } } } },
          },
          take: limit,
          skip,
          orderBy: { playCount: "desc" },
        });

        if (dbTracks.length > 0) {
          results.tracks = dbTracks.map((t) => ({ ...t, genres: t.genres.map((tg) => tg.genre) }));
        }
      }

      if (type === "all" || type === "artists") {
        const dbArtists = await prisma.artist.findMany({
          where: { name: search },
          take: limit,
          skip,
          orderBy: { monthlyListeners: "desc" },
        });
        if (dbArtists.length > 0) {
          results.artists = dbArtists;
        }
      }

      if (type === "all" || type === "albums") {
        const dbAlbums = await prisma.album.findMany({
          where: { OR: [{ title: search }, { artist: { name: search } }] },
          include: {
            artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
          },
          take: limit,
          skip,
          orderBy: { releaseDate: "desc" },
        });
        if (dbAlbums.length > 0) {
          results.albums = dbAlbums;
        }
      }
    } catch {
      // Ignore DB errors
    }

    // Fallback to DEMO catalog if DB returned nothing
    if (!results.tracks || (Array.isArray(results.tracks) && results.tracks.length === 0)) {
      results.tracks = DEMO_TRACKS.filter(
        (t) =>
          t.title.toLowerCase().includes(qLower) ||
          t.artist?.name.toLowerCase().includes(qLower) ||
          (t.genres || []).some((g) => g.name.toLowerCase().includes(qLower) || g.slug.toLowerCase().includes(qLower))
      ).slice(skip, skip + limit);
    }

    if (!results.artists || (Array.isArray(results.artists) && results.artists.length === 0)) {
      results.artists = DEMO_ARTISTS.filter(
        (a) =>
          a.name.toLowerCase().includes(qLower) ||
          a.slug.toLowerCase().includes(qLower)
      ).slice(skip, skip + limit);
    }

    if (!results.albums || (Array.isArray(results.albums) && results.albums.length === 0)) {
      results.albums = DEMO_ALBUMS.filter(
        (al) =>
          al.title.toLowerCase().includes(qLower) ||
          al.artist?.name.toLowerCase().includes(qLower)
      ).slice(skip, skip + limit);
    }

    return createApiSuccess(results);
  } catch (e) {
    const qStr = req.nextUrl.searchParams.get("q") || "";
    const qLower = qStr.toLowerCase();
    const fallbackTracks = DEMO_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(qLower) ||
        t.artist?.name.toLowerCase().includes(qLower)
    );
    const fallbackArtists = DEMO_ARTISTS.filter((a) =>
      a.name.toLowerCase().includes(qLower)
    );
    const fallbackAlbums = DEMO_ALBUMS.filter((al) =>
      al.title.toLowerCase().includes(qLower)
    );
    return createApiSuccess({
      tracks: fallbackTracks,
      artists: fallbackArtists,
      albums: fallbackAlbums,
    });
  }
}
