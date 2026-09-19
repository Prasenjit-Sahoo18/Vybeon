import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { TrackRow } from "@/components/music/TrackRow";
import { prisma } from "@/lib/db/prisma";
import { ListMusic, User, Sparkles } from "lucide-react";
import { Track } from "@/types";

export const dynamic = "force-dynamic";

interface PlaylistPageProps {
  params: { id: string };
}

async function getPlaylistData(id: string) {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
        tracks: {
          orderBy: { position: "asc" },
          include: {
            track: {
              include: {
                artist: true,
                album: true,
                genres: { include: { genre: true } },
              },
            },
          },
        },
      },
    });

    if (!playlist) return null;

    const tracks = playlist.tracks.map((pt) => ({
      ...pt.track,
      genres: pt.track.genres.map((g) => g.genre),
    })) as unknown as Track[];

    return { playlist, tracks };
  } catch (err) {
    console.error("Playlist fetch error:", err);
    return null;
  }
}

export default async function PlaylistDetailPage({ params }: PlaylistPageProps) {
  const data = await getPlaylistData(params.id);
  if (!data) notFound();

  const { playlist, tracks } = data;

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-12 py-8 max-w-7xl mx-auto space-y-10">
        {/* Playlist Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 md:gap-8 border-b border-white/[0.08] pb-8">
          <div className="relative aspect-square w-48 sm:w-56 md:w-64 rounded-2xl overflow-hidden border border-white/[0.1] bg-[#11111A] shadow-2xl shrink-0 flex items-center justify-center bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF]">
            <ListMusic className="h-20 w-20 text-white drop-shadow-md" />
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <span className="rounded-full bg-[#B8FF00]/20 border border-[#B8FF00]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#B8FF00]">
              {playlist.isGenerated ? "AI Generated Vibe" : "Public Playlist"}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {playlist.name}
            </h1>

            {playlist.description && (
              <p className="text-xs md:text-sm text-[#8B8B9A] max-w-xl">
                {playlist.description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#8B8B9A]">
              <span className="font-bold text-white">
                {playlist.user?.name || "Curator"}
              </span>
              <span>•</span>
              <span>{tracks.length} tracks</span>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="space-y-2">
          {tracks.length > 0 ? (
            <div className="space-y-1">
              {tracks.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  playlist={tracks}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-[#8B8B9A]">
              This playlist is currently empty. Add songs from Search or Discover!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
