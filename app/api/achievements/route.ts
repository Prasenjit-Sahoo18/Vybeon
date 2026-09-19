import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createApiError, createApiSuccess } from "@/lib/utils";
import { auth } from "@/lib/auth/config";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    const achievements = await prisma.achievement.findMany({
      orderBy: { threshold: "asc" },
    });

    if (!session?.user?.id) {
      return createApiSuccess(
        achievements.map((a) => ({
          ...a,
          unlocked: false,
          earnedAt: null,
        }))
      );
    }

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: session.user.id },
    });

    const userAchievementMap = new Map(
      userAchievements.map((ua) => [ua.achievementId, ua.earnedAt])
    );

    return createApiSuccess(
      achievements.map((a) => ({
        ...a,
        unlocked: userAchievementMap.has(a.id),
        earnedAt: userAchievementMap.get(a.id) || null,
      }))
    );
  } catch (error) {
    console.error("Achievements error:", error);
    return createApiError("Failed to fetch achievements", 500);
  }
}
