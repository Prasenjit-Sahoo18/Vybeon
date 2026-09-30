import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { neonMixSchema } from "@/lib/validation/schemas";
import { createApiError, createApiSuccess } from "@/lib/utils";
import { DEMO_TRACKS } from "@/lib/music/demo-catalog";
import { Track } from "@/types";

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
    keywords: ["code", "coding", "program", "focus", "study", "work", "read", "writing"],
    genres: ["focus", "chill", "bollywood"],
    maxEnergy: 0.65,
    minValence: 0.4,
    targetDurationMinutes: 45,
    replyTemplate: "Synthesized a deep flow-state sequence for focus and work. Smooth acoustics, steady rhythm, and zero distractions.",
  },
  {
    keywords: ["workout", "gym", "train", "exercise", "run", "running", "pump", "lift", "fitness", "cardio", "beast"],
    genres: ["workout", "pop", "rock"],
    minEnergy: 0.75,
    targetDurationMinutes: 40,
    replyTemplate: "Power kinetic sequence activated! High-BPM anthems and driving energy to maximize your workout intensity.",
  },
  {
    keywords: ["night", "drive", "night ride", "midnight", "late", "cruising", "car", "ride", "dark"],
    genres: ["night", "romantic", "rock"],
    minEnergy: 0.60,
    targetDurationMinutes: 45,
    replyTemplate: "Late-night drive atmosphere loaded. Atmospheric acoustics, deep basslines, and hypnotic midnight frequencies.",
  },
  {
    keywords: ["chill", "relax", "unwind", "calm", "peace", "rest", "coffee", "evening", "slow"],
    genres: ["chill", "romantic", "focus"],
    maxEnergy: 0.65,
    minValence: 0.5,
    targetDurationMinutes: 35,
    replyTemplate: "Tranquil soundscape synthesized. Soulful, acoustic textures and mellow melodies to help you unwind.",
  },
  {
    keywords: ["love", "romantic", "romance", "date", "heart", "couple", "feelings"],
    genres: ["romantic", "bollywood"],
    minEnergy: 0.50,
    targetDurationMinutes: 40,
    replyTemplate: "Romantic masterpiece collection ready. Heartfelt vocal performances from Arijit Singh, KK, and Armaan Malik.",
  },
  {
    keywords: ["party", "dance", "upbeat", "celebrate", "hype", "club", "happy"],
    genres: ["workout", "pop", "bollywood"],
    minEnergy: 0.80,
    minValence: 0.7,
    targetDurationMinutes: 45,
    replyTemplate: "Upbeat energy playlist primed. High-tempo chartbusters to turn any room into a celebration.",
  },
];

export async function POST(req: NextRequest) {
  try {
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

    if (!matchedRule) {
      matchedRule = {
        keywords: [],
        replyTemplate: `Curated a bespoke sonic mix tailored around: "${prompt}". Enjoy this handpicked collection.`,
        targetDurationMinutes: 30,
      };
    }

    const durationMatch = lowerPrompt.match(/(\d+)\s*(?:min|minute)/);
    const durationMinutes = durationMatch ? parseInt(durationMatch[1], 10) : matchedRule.targetDurationMinutes || 30;

    let tracks: Track[] = [];

    // Try DB first
    try {
      const dbTracks = await prisma.track.findMany({
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
        orderBy: { playCount: "desc" },
        take: 30,
      });

      if (dbTracks.length > 0) {
        tracks = dbTracks.map((t) => ({
          ...t,
          genres: t.genres.map((g) => g.genre),
        })) as unknown as Track[];
      }
    } catch {
      // Ignore DB errors
    }

    // Fallback to DEMO_TRACKS if DB has no tracks
    if (tracks.length === 0) {
      tracks = DEMO_TRACKS;
    }

    // Filter tracks by matched rule
    let filtered = tracks.filter((t) => {
      const energy = t.energy ?? 0.5;
      const valence = t.valence ?? 0.5;
      // Check energy
      if (matchedRule?.minEnergy && energy < matchedRule.minEnergy) return false;
      if (matchedRule?.maxEnergy && energy > matchedRule.maxEnergy) return false;
      // Check valence
      if (matchedRule?.minValence && valence < matchedRule.minValence) return false;
      if (matchedRule?.maxValence && valence > matchedRule.maxValence) return false;
      // Check genre
      if (matchedRule?.genres && matchedRule.genres.length > 0) {
        const hasGenre = (t.genres || []).some((g) =>
          matchedRule!.genres!.includes(g.slug)
        );
        if (!hasGenre) return false;
      }
      return true;
    });

    // If filter returned too few, loosen constraints or fallback to shuffle
    if (filtered.length < 5) {
      if (matchedRule.minEnergy) {
        filtered = tracks.filter((t) => (t.energy ?? 0.5) >= 0.7);
      } else if (matchedRule.maxEnergy) {
        filtered = tracks.filter((t) => (t.energy ?? 0.5) <= 0.7);
      } else {
        filtered = tracks;
      }
    }

    if (filtered.length < 5) {
      filtered = tracks;
    }

    // Shuffle and pick
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);

    return createApiSuccess({
      reply: matchedRule.replyTemplate,
      durationMinutes,
      tracks: shuffled.slice(0, 12),
      query: prompt,
    });
  } catch (error) {
    console.error("NeonMix AI error:", error);
    // Fallback response even in catch block
    const sample = [...DEMO_TRACKS].sort(() => Math.random() - 0.5).slice(0, 8);
    return createApiSuccess({
      reply: "Here is your curated playlist with high-fidelity authentic master tracks.",
      durationMinutes: 30,
      tracks: sample,
      query: "Curated Playlist",
    });
  }
}
