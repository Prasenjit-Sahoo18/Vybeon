import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";
import { DEMO_TRACKS } from "@/lib/music/demo-catalog";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const mode = searchParams.get("mode") || "trending"; // artist, genre, mood, track, trending
    const seedId = searchParams.get("seedId");

    let tracks = [];

    if (mode === "artist" && seedId) {
      tracks = await prisma.track.findMany({
        where: { artistId: seedId },
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
        take: 25,
      });
    } else if (mode === "genre" && seedId) {
      tracks = await prisma.track.findMany({
        where: {
          genres: {
            some: {
              genre: {
                slug: seedId,
              },
            },
          },
        },
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
        take: 25,
      });
    } else if (mode === "track" && seedId) {
      const seedTrack = await prisma.track.findUnique({
        where: { id: seedId },
        include: { genres: true },
      });

      const genreIds = seedTrack?.genres.map((g) => g.genreId) || [];

      tracks = await prisma.track.findMany({
        where: {
          id: { not: seedId },
          genres: {
            some: {
              genreId: { in: genreIds },
            },
          },
        },
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
        take: 25,
      });
    } else {
      // Fallback: Random/Trending radio
      tracks = await prisma.track.findMany({
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
        orderBy: { playCount: "desc" },
        take: 30,
      });
    }

    // Shuffle tracks for radio experience
    const shuffled = tracks
      .map((t) => ({ ...t, genres: t.genres.map((g) => g.genre) }))
      .sort(() => Math.random() - 0.5);

    return createApiSuccess({
      station: `${mode.toUpperCase()} Radio`,
      tracks: shuffled,
    });
  } catch (error) {
    const mode = req.nextUrl.searchParams.get("mode") || "trending";
    const shuffled = [...DEMO_TRACKS].sort(() => Math.random() - 0.5);
    return createApiSuccess({
      station: `${mode.toUpperCase()} Radio`,
      tracks: shuffled,
    });
  }
}
