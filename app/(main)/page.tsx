import React from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { HorizontalScrollRow } from "@/components/music/HorizontalScrollRow";
import { TrackCard } from "@/components/music/TrackCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { MoodCard } from "@/components/music/MoodCard";
import { prisma } from "@/lib/db/prisma";
import { MOOD_CONFIGS, Track, Artist, Album } from "@/types";
import { DEMO_TRACKS, DEMO_ARTISTS, DEMO_ALBUMS } from "@/lib/music/demo-catalog";

export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const [trendingRaw, newReleasesRaw, artistsRaw, albumsRaw] = await Promise.all([
      prisma.track.findMany({
        take: 10,
        orderBy: { playCount: "desc" },
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
      }),
      prisma.track.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          artist: true,
          album: true,
          genres: { include: { genre: true } },
        },
      }),
      prisma.artist.findMany({
        take: 8,
        orderBy: { monthlyListeners: "desc" },
      }),
      prisma.album.findMany({
        take: 8,
        orderBy: { releaseDate: "desc" },
        include: { artist: true },
      }),
    ]);

    const trending = (trendingRaw.length > 0
      ? trendingRaw.map((t) => ({ ...t, genres: t.genres.map((g) => g.genre) }))
      : DEMO_TRACKS) as unknown as Track[];

    const newReleases = (newReleasesRaw.length > 0
      ? newReleasesRaw.map((t) => ({ ...t, genres: t.genres.map((g) => g.genre) }))
      : [...DEMO_TRACKS].reverse()) as unknown as Track[];

    const artists = (artistsRaw.length > 0 ? artistsRaw : DEMO_ARTISTS) as unknown as Artist[];
    const albums = (albumsRaw.length > 0 ? albumsRaw : DEMO_ALBUMS) as unknown as Album[];

    return {
      trending,
      newReleases,
      artists,
      albums,
    };
  } catch (error) {
    return {
      trending: DEMO_TRACKS,
      newReleases: [...DEMO_TRACKS].reverse(),
      artists: DEMO_ARTISTS,
      albums: DEMO_ALBUMS,
    };
  }
}

export default async function HomePage() {
  const { trending, newReleases, artists, albums } = await getHomeData();

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <Hero />

        {/* Section 1: Trending Now */}
        {trending.length > 0 && (
          <HorizontalScrollRow
            title="Trending Now"
            subtitle="The highest energy tracks across the VYBEON universe"
          >
            {trending.map((track) => (
              <div key={track.id} className="w-40 sm:w-44 md:w-48 shrink-0">
                <TrackCard track={track} playlist={trending} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}

        {/* Section 2: Vibe Explorer */}
        <section className="my-10">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-black text-[#F5F5F5] tracking-tight">
              Vibe Explorer
            </h2>
            <p className="text-xs md:text-sm text-[#8B8B9A] mt-0.5">
              Sonic spaces engineered to match your psychological state
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {MOOD_CONFIGS.slice(0, 10).map((mood) => (
              <MoodCard key={mood.id} mood={mood} />
            ))}
          </div>
        </section>

        {/* Section 3: Popular Artists */}
        {artists.length > 0 && (
          <HorizontalScrollRow
            title="Popular Artists"
            subtitle="Pioneers pushing the boundaries of sound"
          >
            {artists.map((artist) => (
              <div key={artist.id} className="w-36 sm:w-40 shrink-0">
                <ArtistCard artist={artist} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}

        {/* Section 4: New Releases */}
        {newReleases.length > 0 && (
          <HorizontalScrollRow
            title="New Releases"
            subtitle="Fresh frequencies straight from the sonic forge"
          >
            {newReleases.map((track) => (
              <div key={track.id} className="w-40 sm:w-44 md:w-48 shrink-0">
                <TrackCard track={track} playlist={newReleases} />
              </div>
            ))}
          </HorizontalScrollRow>
        )}

        {/* Section 5: Top Albums */}
        {albums.length > 0 && (
          <HorizontalScrollRow
            title="Top Albums"
            subtitle="Complete sonic journeys and concept records"
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
