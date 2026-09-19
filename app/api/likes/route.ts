import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const likes = await prisma.likedTrack.findMany({
      where: { userId: session.user.id },
      include: {
        track: {
          include: {
            artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
            album: { select: { id: true, title: true, slug: true, imageUrl: true } },
            genres: { include: { genre: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return createApiSuccess(likes.map((l) => ({
      ...l.track,
      genres: l.track.genres.map((tg) => tg.genre),
      likedAt: l.createdAt,
    })));
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch likes", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const { trackId } = await req.json();
    if (!trackId) return createApiError("trackId required");

    const like = await prisma.likedTrack.create({
      data: { userId: session.user.id, trackId },
    });

    return createApiSuccess(like, 201);
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === "P2002") return createApiError("Already liked", 409);
    console.error(e);
    return createApiError("Failed to like track", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const { trackId } = await req.json();
    if (!trackId) return createApiError("trackId required");

    await prisma.likedTrack.delete({
      where: { userId_trackId: { userId: session.user.id, trackId } },
    });

    return createApiSuccess({ unliked: true });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to unlike track", 500);
  }
}
