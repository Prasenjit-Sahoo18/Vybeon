import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const track = await prisma.track.findUnique({
      where: { id: params.id },
      include: {
        artist: true,
        album: { include: { artist: true } },
        genres: { include: { genre: true } },
        lyrics: true,
      },
    });

    if (!track) return createApiError("Track not found", 404);

    // Increment play count asynchronously
    prisma.track.update({ where: { id: params.id }, data: { playCount: { increment: 1 } } }).catch(() => {});

    return createApiSuccess({ ...track, genres: track.genres.map((tg) => tg.genre) });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch track", 500);
  }
}
