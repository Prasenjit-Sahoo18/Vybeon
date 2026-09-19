import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const userId = session.user.id;

    // Get top genres from listening history
    const genreHistory = await prisma.listeningHistory.findMany({
      where: { userId },
      include: {
        track: { include: { genres: { include: { genre: true } } } },
      },
      orderBy: { playedAt: "desc" },
      take: 500,
    });

    const genreCounts: Record<string, number> = {};
    genreHistory.forEach((h) => {
      h.track.genres.forEach((tg) => {
        genreCounts[tg.genre.name] = (genreCounts[tg.genre.name] ?? 0) + 1;
      });
    });

    const totalGenreEvents = Object.values(genreCounts).reduce((a, b) => a + b, 0);
    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: totalGenreEvents > 0 ? Math.round((count / totalGenreEvents) * 100) : 0,
      }));

    // Top artists
    const artistHistory = await prisma.listeningHistory.groupBy({
      by: ["artistId"],
      where: { userId },
      _count: { artistId: true },
      orderBy: { _count: { artistId: "desc" } },
      take: 5,
    });

    const topArtistIds = artistHistory.map((a) => a.artistId);
    const topArtists = await prisma.artist.findMany({
      where: { id: { in: topArtistIds } },
    });

    const topArtistsWithCount = topArtists.map((artist) => ({
      artist,
      playCount: artistHistory.find((a) => a.artistId === artist.id)?._count.artistId ?? 0,
    })).sort((a, b) => b.playCount - a.playCount);

    // Top tracks
    const trackHistory = await prisma.listeningHistory.groupBy({
      by: ["trackId"],
      where: { userId },
      _count: { trackId: true },
      orderBy: { _count: { trackId: "desc" } },
      take: 5,
    });

    const topTrackIds = trackHistory.map((t) => t.trackId);
    const topTracks = await prisma.track.findMany({
      where: { id: { in: topTrackIds } },
      include: {
        artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
        album: { select: { id: true, title: true, slug: true, imageUrl: true } },
      },
    });

    const topTracksWithCount = topTracks.map((track) => ({
      track,
      playCount: trackHistory.find((t) => t.trackId === track.id)?._count.trackId ?? 0,
    })).sort((a, b) => b.playCount - a.playCount);

    // Total minutes
    const totalMs = await prisma.listeningHistory.aggregate({
      where: { userId },
      _sum: { durationMs: true },
    });
    const totalMinutes = Math.round((totalMs._sum.durationMs ?? 0) / 60000);

    // Listening by day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyHistory = await prisma.listeningHistory.findMany({
      where: { userId, playedAt: { gte: sevenDaysAgo } },
      select: { playedAt: true, durationMs: true },
    });

    const dayMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      dayMap[d.toLocaleDateString("en-US", { weekday: "short" })] = 0;
    }
    dailyHistory.forEach((h) => {
      const day = new Date(h.playedAt).toLocaleDateString("en-US", { weekday: "short" });
      dayMap[day] = (dayMap[day] ?? 0) + Math.round(h.durationMs / 60000);
    });

    const listeningByDay = Object.entries(dayMap).map(([day, minutes]) => ({ day, minutes }));

    return createApiSuccess({
      totalMinutes,
      totalTracks: trackHistory.length,
      topGenres,
      topArtists: topArtistsWithCount,
      topTracks: topTracksWithCount,
      listeningByDay,
      streak: 0, // Could compute streak from daily listening data
    });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch analytics", 500);
  }
}
