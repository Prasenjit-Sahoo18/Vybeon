import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";
import { DEMO_TRACKS } from "@/lib/music/demo-catalog";

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

    if (track) {
      // Increment play count asynchronously
      prisma.track.update({ where: { id: params.id }, data: { playCount: { increment: 1 } } }).catch(() => {});
      return createApiSuccess({ ...track, genres: track.genres.map((tg) => tg.genre) });
    }
  } catch (e) {
    // Database offline
  }

  const demoTrack = DEMO_TRACKS.find((t) => t.id === params.id || t.slug === params.id);
  if (demoTrack) {
    return createApiSuccess(demoTrack);
  }

  return createApiError("Track not found", 404);
}
