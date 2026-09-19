import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { addToPlaylistSchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const playlist = await prisma.playlist.findUnique({ where: { id: params.id } });
    if (!playlist || playlist.userId !== session.user.id) return createApiError("Not found", 404);

    const body = await req.json();
    const parsed = addToPlaylistSchema.safeParse(body);
    if (!parsed.success) return createApiError("Invalid track ID");

    const lastTrack = await prisma.playlistTrack.findFirst({
      where: { playlistId: params.id },
      orderBy: { position: "desc" },
    });

    await prisma.playlistTrack.create({
      data: {
        playlistId: params.id,
        trackId: parsed.data.trackId,
        position: (lastTrack?.position ?? 0) + 1,
      },
    });

    await prisma.playlist.update({
      where: { id: params.id },
      data: { totalTracks: { increment: 1 } },
    });

    return createApiSuccess({ added: true }, 201);
  } catch (e) {
    console.error(e);
    return createApiError("Failed to add track", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const playlist = await prisma.playlist.findUnique({ where: { id: params.id } });
    if (!playlist || playlist.userId !== session.user.id) return createApiError("Not found", 404);

    const { trackId } = await req.json();
    if (!trackId) return createApiError("trackId required");

    await prisma.playlistTrack.delete({
      where: { playlistId_trackId: { playlistId: params.id, trackId } },
    });

    await prisma.playlist.update({
      where: { id: params.id },
      data: { totalTracks: { decrement: 1 } },
    });

    return createApiSuccess({ removed: true });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to remove track", 500);
  }
}
