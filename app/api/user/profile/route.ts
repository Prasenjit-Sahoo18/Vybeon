import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { updateProfileSchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";
import { auth } from "@/lib/auth/config";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const usernameParam = req.nextUrl.searchParams.get("username");

    if (!usernameParam && !session?.user?.id) {
      return createApiError("User required", 400);
    }

    const where = usernameParam
      ? { username: usernameParam }
      : { id: session!.user!.id };

    const user = await prisma.user.findUnique({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        createdAt: true,
        isPublic: true,
        playlists: {
          where: { isPublic: true },
          take: 10,
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            totalTracks: true,
          },
        },
        followedArtists: {
          take: 10,
          include: {
            artist: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
        _count: {
          select: {
            playlists: true,
            likedTracks: true,
            followedArtists: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return createApiError("User not found", 404);
    }

    return createApiSuccess(user);
  } catch (error) {
    console.error("Profile GET error:", error);
    return createApiError("Failed to fetch profile", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return createApiError("Unauthorized", 401);
    }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return createApiError("Invalid profile data", 400);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        isPublic: true,
      },
    });

    return createApiSuccess(updated);
  } catch (error) {
    console.error("Profile PUT error:", error);
    return createApiError("Failed to update profile", 500);
  }
}
