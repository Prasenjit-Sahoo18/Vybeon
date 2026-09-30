"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { TrackRow } from "@/components/music/TrackRow";
import { ArtistCard } from "@/components/music/ArtistCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { Search, Sparkles, TrendingUp, Music, X } from "lucide-react";
import { Track, Artist, Album } from "@/types";
import { cn } from "@/lib/utils";

const TRENDING_TAGS = [
  "Arijit Singh",
  "Armaan Malik",
  "KK",
  "Workout",
  "Night Ride",
  "Romantic",
  "Deep Focus",
  "Bollywood",
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || searchParams.get("genre") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"all" | "tracks" | "artists" | "albums">("all");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [results, setResults] = useState<{
    tracks?: Track[];
    artists?: Artist[];
    albums?: Album[];
  }>({});

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults({});
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&type=${activeTab}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || {});
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, activeTab]);

  const topTrack = results.tracks?.[0];

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Search Header & Input */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#B8FF00]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, albums, or lyrics..."
            className="w-full rounded-2xl bg-[#11111A] border border-white/[0.1] py-4 pl-12 pr-12 text-base text-white placeholder-[#8B8B9A] focus:border-[#B8FF00] focus:ring-2 focus:ring-[#B8FF00]/20 focus:outline-none transition-all shadow-xl"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8B9A] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        {query && (
          <div className="flex gap-2 border-b border-white/[0.08] pb-3">
            {(["all", "tracks", "artists", "albums"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-bold capitalize transition",
                  activeTab === tab
                    ? "bg-[#B8FF00] text-[#050505] shadow-[0_0_12px_rgba(184,255,0,0.4)]"
                    : "bg-white/[0.05] text-[#8B8B9A] hover:text-white hover:bg-white/[0.08]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Empty state: Trending searches */}
        {!query && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <TrendingUp className="h-4 w-4 text-[#B8FF00]" />
              <span>Trending Searches</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="rounded-xl border border-white/[0.08] bg-[#11111A] px-4 py-2 text-xs font-medium text-[#F5F5F5] hover:border-[#B8FF00]/40 hover:text-[#B8FF00] transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#8B8B9A]">
            <Sparkles className="h-4 w-4 text-[#B8FF00] animate-spin" />
            <span>Scanning sonic frequencies...</span>
          </div>
        )}

        {/* Top Result + Songs */}
        {query && (results.tracks?.length || results.artists?.length) ? (
          <div className="space-y-8">
            {activeTab === "all" && topTrack && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Result Card */}
                <div className="md:col-span-1 rounded-2xl border border-white/[0.08] bg-[#11111A] p-6 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
                    Top Result
                  </p>
                  <div className="relative aspect-square w-24 rounded-2xl overflow-hidden bg-black/40 shadow-xl">
                    {topTrack.imageUrl ? (
                      <img
                        src={topTrack.imageUrl}
                        alt={topTrack.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Music className="h-8 w-8 m-auto text-white/50" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white truncate">
                      {topTrack.title}
                    </h3>
                    <p className="text-xs text-[#8B8B9A] mt-1">
                      Song • {topTrack.artist?.name}
                    </p>
                  </div>
                </div>

                {/* Top 4 Songs */}
                <div className="md:col-span-2 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A] px-2">
                    Matching Songs
                  </p>
                  <div className="space-y-1">
                    {results.tracks?.slice(0, 4).map((track, idx) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={idx}
                        playlist={results.tracks}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Songs section if specific tab or more tracks */}
            {(activeTab === "tracks" || (activeTab === "all" && (results.tracks?.length || 0) > 4)) && (
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">All Songs</h3>
                <div className="space-y-1">
                  {results.tracks?.map((track, idx) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={idx}
                      playlist={results.tracks}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Artists */}
            {results.artists && results.artists.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Artists</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {results.artists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </div>
            )}

            {/* Albums */}
            {results.albums && results.albums.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Albums</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {results.albums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : query && !loading ? (
          <div className="py-16 text-center text-sm text-[#8B8B9A]">
            No sonic matches found for &ldquo;{query}&rdquo;. Try another vibe or genre.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] p-8 text-xs text-[#8B8B9A] flex items-center justify-center">
          Loading Search...
        </div>
      }
    >
      <SearchContent />
    </React.Suspense>
  );
}
