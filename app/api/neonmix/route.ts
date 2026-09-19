import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { neonMixSchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";
import { auth } from "@/lib/auth/config";

interface RuleMatch {
  keywords: string[];
  genres?: string[];
  minEnergy?: number;
  maxEnergy?: number;
  minValence?: number;
  maxValence?: number;
  targetDurationMinutes?: number;
  replyTemplate: string;
}

const RULES: RuleMatch[] = [
  {
    keywords: ["code", "coding", "program", "focus", "study", "work"],
    genres: ["lo-fi", "ambient", "instrumental"],
    maxEnergy: 0.45,
    minValence: 0.3,
    targetDurationMinutes: 45,
    replyTemplate: "I've synthesized a deep focus mix for your flow state. Low BPM, minimal lyrics, maximum immersion.",
  },
  {
    keywords: ["workout", "gym", "train", "exercise", "run", "pump", "lift"],
    genres: ["workout", "electronic", "rock", "hip-hop"],
    minEnergy: 0.75,
    targetDurationMinutes: 35,
    replyTemplate: "Power sequence activated. High-octane tracks tuned for peak kinetic output.",
  },
  {
    keywords: ["chill", "relax", "unwind", "calm", "peace", "rest"],
    genres: ["chill", "lo-fi", "ambient", "rnb"],
    maxEnergy: 0.4,
    minValence: 0.4,
    targetDurationMinutes: 40,
    replyTemplate: "Here is your tranquil soundscape. Soft acoustics, ambient textures, and relaxing frequencies.",
  },
  {
    keywords: ["party", "dance", "electronic", "club", "upbeat", "rave", "hype"],
    genres: ["electronic", "k-pop", "pop"],
    minEnergy: 0.8,
    minValence: 0.6,
    targetDurationMinutes: 50,
    replyTemplate: "Neon party grid initialized. Heavy basslines and neon synthwave anthems.",
  },
  {
    keywords: ["rain", "rainy", "storm", "coffee", "window"],
    genres: ["lo-fi", "ambient", "indie"],
    maxEnergy: 0.35,
    maxValence: 0.5,
    targetDurationMinutes: 30,
    replyTemplate: "Cozy rainy day frequencies loaded. Gentle rhythms and mellow acoustic tones.",
  },
  {
    keywords: ["night", "midnight", "late", "drive", "sleep", "dark"],
    genres: ["ambient", "chill", "lo-fi", "electronic"],
    maxEnergy: 0.45,
    targetDurationMinutes: 45,
    replyTemplate: "Late night atmospheric sequence prepared. Cinematic shadows and deep reverberations.",
  },
];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = neonMixSchema.safeParse(body);

    if (!parsed.success) {
      return createApiError("Prompt required", 400);
    }

    const { prompt } = parsed.data;
    const lowerPrompt = prompt.toLowerCase();

    // Check rules
    let matchedRule: RuleMatch | null = null;
    for (const rule of RULES) {
      if (rule.keywords.some((k) => lowerPrompt.includes(k))) {
        matchedRule = rule;
        break;
      }
    }

    // Default rule if no specific keyword matched
    if (!matchedRule) {
      matchedRule = {
        keywords: [],
        replyTemplate: `Curated a special mix tailored around: "${prompt}". Enjoy the custom sonic wavelength.`,
        targetDurationMinutes: 30,
      };
    }

    // Extract any explicit duration like "20 minute" or "45 min"
    const durationMatch = lowerPrompt.match(/(\d+)\s*(?:min|minute)/);
    const durationMinutes = durationMatch ? parseInt(durationMatch[1], 10) : matchedRule.targetDurationMinutes || 30;

    // Build Prisma query
    const where: Record<string, unknown> = {};
    if (matchedRule.minEnergy !== undefined || matchedRule.maxEnergy !== undefined) {
      where.energy = {
        gte: matchedRule.minEnergy ?? 0,
        lte: matchedRule.maxEnergy ?? 1,
      };
    }
    if (matchedRule.minValence !== undefined || matchedRule.maxValence !== undefined) {
      where.valence = {
        gte: matchedRule.minValence ?? 0,
        lte: matchedRule.maxValence ?? 1,
      };
    }
    if (matchedRule.genres && matchedRule.genres.length > 0) {
      where.genres = {
        some: {
          genre: {
            slug: { in: matchedRule.genres },
          },
        },
      };
    }

    let tracks = await prisma.track.findMany({
      where,
      include: {
        artist: true,
        album: true,
        genres: { include: { genre: true } },
      },
      orderBy: { playCount: "desc" },
      take: 25,
    });

    if (tracks.length < 5) {
      tracks = await prisma.track.findMany({
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
        orderBy: { playCount: "desc" },
        take: 20,
      });
    }

    const formattedTracks = tracks.map((t) => ({
      ...t,
      genres: t.genres.map((g) => g.genre),
    }));

    return createApiSuccess({
      reply: matchedRule.replyTemplate,
      durationMinutes,
      tracks: formattedTracks,
      query: prompt,
    });
  } catch (error) {
    console.error("NeonMix AI error:", error);
    return createApiError("NeonMix AI failed to process request", 500);
  }
}
