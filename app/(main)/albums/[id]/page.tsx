import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { TrackRow } from "@/components/music/TrackRow";
import { prisma } from "@/lib/db/prisma";
import { Disc3, Calendar, Clock, Play } from "lucide-react";
import { formatDuration, totalDurationInMinutes } from "@/lib/utils";
import { Track } from "@/types";

export const dynamic = "force-dynamic";

interface AlbumPageProps {
  params: { id: string };
}

async function getAlbumData(id: string) {
  try {
    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        artist: true,
        tracks: {
          orderBy: { trackNumber: "asc" },
          include: {
            artist: true,
            genres: { include: { genre: true } },
          },
        },
      },
    });

    if (!album) return null;

    const formattedTracks = album.tracks.map((t) => ({
      ...t,
      genres: t.genres.map((g) => g.genre),
    })) as unknown as Track[];

    return { album, tracks: formattedTracks };
  } catch (err) {
    console.error("Album fetch error:", err);
    return null;
  }
}

export default async function AlbumDetailPage({ params }: AlbumPageProps) {
  const data = await getAlbumData(params.id);
  if (!data) notFound();

  const { album, tracks } = data;
  const totalMins = totalDurationInMinutes(tracks);
  const releaseYear = album.releaseDate
    ? new Date(album.releaseDate).getFullYear()
    : "2024";

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-12 py-8 max-w-7xl mx-auto space-y-10">
        {/* Album Header Banner */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 md:gap-8 border-b border-white/[0.08] pb-8">
          <div className="relative aspect-square w-48 sm:w-56 md:w-64 rounded-2xl overflow-hidden border border-white/[0.1] bg-[#11111A] shadow-2xl shrink-0">
            {album.imageUrl ? (
              <Image
                src={album.imageUrl}
                alt={album.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF]" />
            )}
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              {album.albumType}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {album.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs md:text-sm text-[#8B8B9A]">
              <Link
                href={`/artists/${album.artistId}`}
                className="font-bold text-white hover:text-[#B8FF00] transition"
              >
                {album.artist.name}
              </Link>
              <span>•</span>
              <span>{releaseYear}</span>
              <span>•</span>
              <span>{tracks.length} tracks, {totalMins} mins</span>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 text-xs font-bold uppercase tracking-wider text-[#8B8B9A] pb-2 border-b border-white/[0.04]">
            <span># Title</span>
            <span>Duration</span>
          </div>

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
        </div>
      </div>
    </div>
  );
}
