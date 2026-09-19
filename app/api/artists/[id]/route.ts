import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: params.id },
      include: {
        albums: { orderBy: { releaseDate: "desc" } },
        tracks: {
          include: {
            album: { select: { id: true, title: true, slug: true, imageUrl: true } },
            genres: { include: { genre: { select: { id: true, name: true, slug: true, color: true } } } },
          },
          orderBy: { playCount: "desc" },
          take: 10,
        },
        _count: { select: { tracks: true, albums: true, followedBy: true } },
      },
    });

    if (!artist) return createApiError("Artist not found", 404);

    const formatted = {
      ...artist,
      tracks: artist.tracks.map((t) => ({ ...t, genres: t.genres.map((tg) => tg.genre) })),
    };

    return createApiSuccess(formatted);
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch artist", 500);
  }
}
