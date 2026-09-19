import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const album = await prisma.album.findUnique({
      where: { id: params.id },
      include: {
        artist: true,
        tracks: {
          include: {
            genres: { include: { genre: true } },
          },
          orderBy: { trackNumber: "asc" },
        },
      },
    });

    if (!album) return createApiError("Album not found", 404);

    return createApiSuccess({
      ...album,
      tracks: album.tracks.map((t) => ({ ...t, genres: t.genres.map((tg) => tg.genre) })),
    });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch album", 500);
  }
}
