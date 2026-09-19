import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { updatePlaylistSchema, addToPlaylistSchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const playlist = await prisma.playlist.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
        tracks: {
          include: {
            track: {
              include: {
                artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
                album: { select: { id: true, title: true, slug: true, imageUrl: true } },
                genres: { include: { genre: true } },
              },
            },
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!playlist) return createApiError("Playlist not found", 404);
    if (!playlist.isPublic && playlist.userId !== session?.user?.id) {
      return createApiError("Unauthorized", 403);
    }

    return createApiSuccess({
      ...playlist,
      tracks: playlist.tracks.map((pt) => ({
        ...pt,
        track: { ...pt.track, genres: pt.track.genres.map((tg) => tg.genre) },
      })),
    });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch playlist", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const playlist = await prisma.playlist.findUnique({ where: { id: params.id } });
    if (!playlist || playlist.userId !== session.user.id) return createApiError("Not found", 404);

    const body = await req.json();
    const parsed = updatePlaylistSchema.safeParse(body);
    if (!parsed.success) return createApiError(parsed.error.issues[0]?.message || "Invalid data");

    const updated = await prisma.playlist.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return createApiSuccess(updated);
  } catch (e) {
    console.error(e);
    return createApiError("Failed to update playlist", 500);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const playlist = await prisma.playlist.findUnique({ where: { id: params.id } });
    if (!playlist || playlist.userId !== session.user.id) return createApiError("Not found", 404);

    await prisma.playlist.delete({ where: { id: params.id } });
    return createApiSuccess({ deleted: true });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to delete playlist", 500);
  }
}
