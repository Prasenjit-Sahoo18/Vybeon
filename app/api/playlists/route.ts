import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { createPlaylistSchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const playlists = await prisma.playlist.findMany({
      where: { userId: session.user.id },
      include: {
        _count: { select: { tracks: true } },
        tracks: { take: 1, include: { track: { select: { imageUrl: true } } }, orderBy: { position: "asc" } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return createApiSuccess(playlists);
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch playlists", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const body = await req.json();
    const parsed = createPlaylistSchema.safeParse(body);
    if (!parsed.success) return createApiError(parsed.error.issues[0]?.message || "Invalid data");

    const playlist = await prisma.playlist.create({
      data: { ...parsed.data, userId: session.user.id },
    });

    return createApiSuccess(playlist, 201);
  } catch (e) {
    console.error(e);
    return createApiError("Failed to create playlist", 500);
  }
}
