import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { TrackRow } from "@/components/music/TrackRow";
import { AlbumCard } from "@/components/music/AlbumCard";
import { prisma } from "@/lib/db/prisma";
import { BadgeCheck, Play, Users, Disc3, Sparkles } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Track, Album } from "@/types";
import { DEMO_ARTISTS, DEMO_TRACKS, DEMO_ALBUMS } from "@/lib/music/demo-catalog";

export const dynamic = "force-dynamic";

interface ArtistPageProps {
  params: { id: string };
}

async function getArtistData(id: string) {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        albums: { orderBy: { releaseDate: "desc" } },
        tracks: {
          take: 10,
          orderBy: { playCount: "desc" },
          include: {
            artist: true,
            album: true,
            genres: { include: { genre: true } },
          },
        },
        _count: {
          select: { tracks: true, albums: true, followedBy: true },
        },
      },
    });

    if (artist) {
      const formattedTracks = artist.tracks.map((t) => ({
        ...t,
        genres: t.genres.map((g) => g.genre),
      })) as unknown as Track[];

      return {
        artist,
        tracks: formattedTracks,
        albums: artist.albums as unknown as Album[],
      };
    }
  } catch (err) {
    // Database offline, fall through
  }

  const demoArtist = DEMO_ARTISTS.find((a) => a.id === id || a.slug === id);
  if (demoArtist) {
    const tracks = DEMO_TRACKS.filter((t) => t.artistId === demoArtist.id);
    const albums = DEMO_ALBUMS.filter((a) => a.artistId === demoArtist.id);
    return {
      artist: {
        ...demoArtist,
        _count: { tracks: tracks.length, albums: albums.length, followedBy: 840000 },
      },
      tracks,
      albums,
    };
  }

  return null;
}

export default async function ArtistDetailPage({ params }: ArtistPageProps) {
  const data = await getArtistData(params.id);
  if (!data) notFound();

  const { artist, tracks, albums } = data;

  return (
    <div className="min-h-screen">
      <Header />

      {/* Cinematic Hero Artwork Header */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden border-b border-white/[0.08] bg-[#090912]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#7C3AED]/20 z-10" />

        {artist.imageUrl && (
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            className="object-cover filter blur-xs opacity-50"
            unoptimized
          />
        )}

        {/* Hero Meta Information */}
        <div className="absolute bottom-6 left-6 md:left-12 z-20 flex items-end gap-6 max-w-5xl">
          <div className="relative h-28 w-28 md:h-36 md:w-36 overflow-hidden rounded-full border-2 border-[#00F5FF] shadow-[0_0_30px_rgba(0,245,255,0.4)] shrink-0 bg-[#11111A]">
            {artist.imageUrl ? (
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF]" />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Verified Artist
              </span>
              {artist.verified && (
                <BadgeCheck className="h-4 w-4 text-[#00F5FF] fill-[#00F5FF]/20" />
              )}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
              {artist.name}
            </h1>

            <p className="text-xs md:text-sm font-medium text-[#8B8B9A]">
              {formatNumber(artist.monthlyListeners)} Monthly Listeners • {artist.country || "Global"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 md:px-12 py-8 max-w-7xl mx-auto space-y-10">
        {/* Popular Tracks */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Popular Tracks</h2>
            <span className="text-xs text-[#8B8B9A]">Top releases by stream volume</span>
          </div>

          <div className="space-y-1 rounded-2xl border border-white/[0.06] bg-[#11111A]/40 p-2">
            {tracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                playlist={tracks}
              />
            ))}
          </div>
        </section>

        {/* Albums & Discography */}
        {albums.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">Discography</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        )}

        {/* About Bio Section */}
        {artist.bio && (
          <section className="rounded-3xl border border-white/[0.08] bg-[#11111A] p-6 md:p-8 space-y-3">
            <h3 className="text-lg font-bold text-white">About the Artist</h3>
            <p className="text-sm text-[#8B8B9A] leading-relaxed max-w-3xl">
              {artist.bio}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
