import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { prisma } from "@/lib/db/prisma";
import { Play, Heart, Share2, Sparkles, Disc, Music } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { Metadata } from "next";
import { DEMO_TRACKS } from "@/lib/music/demo-catalog";

export const dynamic = "force-dynamic";

interface TrackPageProps {
  params: { id: string };
}

async function getTrackData(id: string) {
  try {
    const track = await prisma.track.findUnique({
      where: { id },
      include: {
        artist: true,
        album: true,
        genres: { include: { genre: true } },
      },
    });
    if (track) return track;
  } catch {
    // Database offline
  }

  const demo = DEMO_TRACKS.find((t) => t.id === id || t.slug === id);
  if (demo) {
    return {
      ...demo,
      artist: demo.artist,
      album: demo.album,
      genres: (demo.genres || []).map((g) => ({ genre: g })),
    };
  }

  return null;
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const track = await getTrackData(params.id);

  if (!track) return { title: "Track Not Found | VYBEON" };

  return {
    title: `${track.title} by ${track.artist?.name || "Artist"}`,
    description: `Stream ${track.title} on VYBEON — Where Every Vibe Comes Alive.`,
    openGraph: {
      title: `${track.title} • VYBEON`,
      description: `Listen to ${track.title} by ${track.artist?.name} on VYBEON.`,
      images: track.imageUrl ? [track.imageUrl] : [],
    },
  };
}

export default async function TrackDetailPage({ params }: TrackPageProps) {
  const track = await getTrackData(params.id);

  if (!track) notFound();

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-12 py-12 max-w-4xl mx-auto space-y-8">
        {/* Track Showcase Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#11111A] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="relative aspect-square w-48 md:w-64 rounded-2xl overflow-hidden bg-black/40 border border-white/[0.1] shrink-0">
            {track.imageUrl ? (
              <Image
                src={track.imageUrl}
                alt={track.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Music className="h-16 w-16 m-auto text-[#B8FF00]" />
            )}
          </div>

          <div className="space-y-4 text-center md:text-left flex-1 min-w-0">
            <span className="rounded-full bg-[#B8FF00]/10 border border-[#B8FF00]/30 px-3 py-1 text-xs font-bold text-[#B8FF00] uppercase tracking-wider">
              Single Track
            </span>

            <h1 className="text-3xl md:text-4xl font-black text-white truncate">
              {track.title}
            </h1>

            <div className="text-sm text-[#8B8B9A] space-y-1">
              <p>
                Artist:{" "}
                <Link
                  href={`/artists/${track.artistId}`}
                  className="font-bold text-white hover:text-[#B8FF00]"
                >
                  {track.artist?.name}
                </Link>
              </p>
              {track.album && (
                <p>
                  Album:{" "}
                  <Link
                    href={`/albums/${track.albumId}`}
                    className="text-white hover:underline"
                  >
                    {track.album.title}
                  </Link>
                </p>
              )}
              <p>Duration: {formatDuration(track.duration)}</p>
              <p>Stream Count: {track.playCount.toLocaleString()} plays</p>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full bg-[#B8FF00] px-6 py-3 text-xs font-bold text-black shadow-[0_0_20px_rgba(184,255,0,0.4)] hover:brightness-110 transition"
              >
                <Play className="h-4 w-4 fill-current ml-0.5" />
                <span>Play on VYBEON</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
