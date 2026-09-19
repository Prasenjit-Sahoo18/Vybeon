import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { historySchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const { searchParams } = req.nextUrl;
    const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));

    const history = await prisma.recentlyPlayed.findMany({
      where: { userId: session.user.id },
      include: {
        track: {
          include: {
            artist: { select: { id: true, name: true, slug: true, imageUrl: true } },
            album: { select: { id: true, title: true, slug: true, imageUrl: true } },
          },
        },
      },
      orderBy: { playedAt: "desc" },
      take: limit,
      distinct: ["trackId"],
    });

    return createApiSuccess(history);
  } catch (e) {
    console.error(e);
    return createApiError("Failed to fetch history", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    const body = await req.json();
    const parsed = historySchema.safeParse(body);
    if (!parsed.success) return createApiError("Invalid data");

    const { trackId, artistId, durationMs } = parsed.data;

    await Promise.all([
      prisma.recentlyPlayed.create({
        data: { userId: session.user.id, trackId },
      }),
      prisma.listeningHistory.create({
        data: { userId: session.user.id, trackId, artistId, durationMs },
      }),
    ]);

    return createApiSuccess({ recorded: true }, 201);
  } catch (e) {
    console.error(e);
    return createApiError("Failed to record history", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return createApiError("Unauthorized", 401);

    await prisma.recentlyPlayed.deleteMany({ where: { userId: session.user.id } });
    return createApiSuccess({ cleared: true });
  } catch (e) {
    console.error(e);
    return createApiError("Failed to clear history", 500);
  }
}
