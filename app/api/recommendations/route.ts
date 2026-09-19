import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      // Return anonymous recommendations using top tracks
      const trending = await prisma.track.findMany({
        include: {
          artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
          album: { select: { id: true, title: true, slug: true, imageUrl: true } },
          genres: { include: { genre: { select: { id: true, name: true, slug: true, color: true } } } },
        },
        orderBy: { playCount: "desc" },
        take: 20,
      });
      return createApiSuccess(trending.map((t) => ({ ...t, genres: t.genres.map((tg) => tg.genre) })));
    }

    const userId = session.user.id;

    // Get user's liked genres
    const likedTracks = await prisma.likedTrack.findMany({
      where: { userId },
      include: { track: { include: { genres: { include: { genre: true } } } } },
      take: 50,
    });

    const preferredGenreIds = new Set<string>();
    const preferredArtistIds = new Set<string>();

    likedTracks.forEach((lt) => {
      lt.track.genres.forEach((tg) => preferredGenreIds.add(tg.genreId));
      preferredArtistIds.add(lt.track.artistId);
    });

    // Get recently played to exclude
    const recentIds = new Set(
      (await prisma.recentlyPlayed.findMany({ where: { userId }, take: 20, select: { trackId: true } }))
        .map((r) => r.trackId)
    );

    // Find similar tracks not already played
    const recommendations = await prisma.track.findMany({
      where: {
        id: { notIn: Array.from(recentIds) },
        OR: [
          { genres: { some: { genreId: { in: Array.from(preferredGenreIds) } } } },
          { artistId: { in: Array.from(preferredArtistIds) } },
        ],
      },
      include: {
        artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
        album: { select: { id: true, title: true, slug: true, imageUrl: true } },
        genres: { include: { genre: { select: { id: true, name: true, slug: true, color: true } } } },
      },
      orderBy: { playCount: "desc" },
      take: 30,
    });

    // Fill up with trending if not enough
    if (recommendations.length < 20) {
      const extras = await prisma.track.findMany({
        where: { id: { notIn: recommendations.map((r) => r.id) } },
        include: {
          artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
          album: { select: { id: true, title: true, slug: true, imageUrl: true } },
          genres: { include: { genre: { select: { id: true, name: true, slug: true, color: true } } } },
        },
        orderBy: { playCount: "desc" },
        take: 20 - recommendations.length,
      });
      recommendations.push(...extras);
    }

    return createApiSuccess(recommendations.map((t) => ({ ...t, genres: t.genres.map((tg) => tg.genre) })));
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch recommendations", 500);
  }
}
