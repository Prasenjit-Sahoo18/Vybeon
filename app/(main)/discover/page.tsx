import React from "react";
import { Header } from "@/components/layout/Header";
import { HorizontalScrollRow } from "@/components/music/HorizontalScrollRow";
import { TrackCard } from "@/components/music/TrackCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { MoodCard } from "@/components/music/MoodCard";
import { prisma } from "@/lib/db/prisma";
import { MOOD_CONFIGS, Track, Artist, Album, Genre } from "@/types";
import { Compass, Sparkles, Flame, Radio } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getDiscoverData() {
  try {
    const [genres, hiddenGemsRaw, risingArtistsRaw, albumsRaw] = await Promise.all([
      prisma.genre.findMany({ orderBy: { name: "asc" } }),
      prisma.track.findMany({
        where: { playCount: { lt: 50000 } },
        take: 10,
        orderBy: { playCount: "asc" },
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
      }),
      prisma.artist.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.album.findMany({
        take: 8,
        orderBy: { totalTracks: "desc" },
        include: { artist: true },
      }),
    ]);

    const hiddenGems = hiddenGemsRaw.map((t) => ({
      ...t,
      genres: t.genres.map((g) => g.genre),
    })) as unknown as Track[];

    return {
      genres: genres as unknown as Genre[],
      hiddenGems,
      risingArtists: risingArtistsRaw as unknown as Artist[],
      albums: albumsRaw as unknown as Album[],
    };
  } catch (err) {
    console.error("Discover page fetch error:", err);
    return {
      genres: [],
      hiddenGems: [],
      risingArtists: [],
      albums: [],
    };
  }
}

export default async function DiscoverPage() {
  const { genres, hiddenGems, risingArtists, albums } = await getDiscoverData();

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-10">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#7C3AED]/30 via-[#11111A] to-[#00F5FF]/20 p-8 md:p-10">
          <div className="flex items-center gap-2 text-[#00F5FF] text-xs font-bold uppercase tracking-widest mb-2">
            <Compass className="h-4 w-4" />
            <span>Curated Exploration</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Discover Sonic Frontiers
          </h1>
          <p className="text-sm text-[#8B8B9A] mt-2 max-w-xl">
            Explore uncharted frequencies, underground creators, and genre-bending
            syntheses curated exclusively for the VYBEON collective.
          </p>
        </div>

        {/* Genre Grid */}
        <section>
          <h2 className="text-xl md:text-2xl font-black text-[#F5F5F5] mb-4">
            Genre Explorer
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {genres.map((g) => (
              <Link
                key={g.id}
                href={`/search?genre=${g.slug}`}
                className="group relative flex h-28 flex-col justify-between overflow-hidden rounded-2xl p-4 border border-white/[0.08] bg-[#11111A] transition-all hover:scale-[1.03] hover:border-[#00F5FF]/40"
              >
                <div
                  className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition"
                  style={{ backgroundColor: g.color || "#B8FF00" }}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A] group-hover:text-white transition">
                  Category
                </span>
                <span className="text-base font-extrabold text-white group-hover:text-[#00F5FF] transition">
                  {g.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Hidden Gems */}
        {hiddenGems.length > 0 && (
          <HorizontalScrollRow
            title="Hidden Gems"
            subtitle="Exceptional under-the-radar tracks you won't hear on commercial radio"
          >
            {hiddenGems.map((track) => (
              <div key={track.id} className="w-40 sm:w-44 md:w-48 shrink-0">
                <TrackCard track={track} playlist={hiddenGems} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}

        {/* Rising Artists */}
        {risingArtists.length > 0 && (
          <HorizontalScrollRow
            title="Rising Artists"
            subtitle="Emerging sonic visionaries breaking new ground"
          >
            {risingArtists.map((artist) => (
              <div key={artist.id} className="w-36 sm:w-40 shrink-0">
                <ArtistCard artist={artist} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}

        {/* Concept Albums */}
        {albums.length > 0 && (
          <HorizontalScrollRow
            title="Concept Albums"
            subtitle="Extended explorations in sound design and storytelling"
          >
            {albums.map((album) => (
              <div key={album.id} className="w-40 sm:w-44 md:w-48 shrink-0">
                <AlbumCard album={album} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}
      </div>
    </div>
  );
}
