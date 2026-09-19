"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { TrackRow } from "@/components/music/TrackRow";
import { ArtistCard } from "@/components/music/ArtistCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { Heart, Plus, ListMusic, Clock, Sparkles } from "lucide-react";
import { Track, Playlist, Artist, Album } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

function LibraryContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "all" | "liked" | "playlists" | "recent") || "all";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchLibraryData = async () => {
    setLoading(true);
    try {
      const [likesRes, playlistsRes, historyRes] = await Promise.all([
        fetch("/api/likes"),
        fetch("/api/playlists"),
        fetch("/api/history"),
      ]);

      if (likesRes.ok) {
        const data = await likesRes.json();
        setLikedTracks(Array.isArray(data) ? data : []);
      }
      if (playlistsRes.ok) {
        const data = await playlistsRes.json();
        setPlaylists(Array.isArray(data) ? data : []);
      }
      if (historyRes.ok) {
        const data = await historyRes.json();
        if (Array.isArray(data)) {
          setRecentTracks(data.map((h: { track: Track }) => h.track));
        }
      }
    } catch (err) {
      console.error("Failed to load library:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPlaylistName.trim() }),
      });

      if (res.ok) {
        setNewPlaylistName("");
        setCreating(false);
        fetchLibraryData();
      }
    } catch (err) {
      console.error("Failed to create playlist:", err);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Header Title & Create Action */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Your Library</h1>
            <p className="text-xs md:text-sm text-[#8B8B9A] mt-1">
              Your saved songs, curated playlists, and listening history
            </p>
          </div>

          <button
            onClick={() => setCreating(!creating)}
            className="flex items-center gap-2 rounded-full bg-[#B8FF00] px-4 py-2 text-xs font-bold text-black hover:brightness-110 transition shadow-[0_0_15px_rgba(184,255,0,0.3)]"
          >
            <Plus className="h-4 w-4" />
            <span>New Playlist</span>
          </button>
        </div>

        {/* Create Playlist Modal / Drawer */}
        {creating && (
          <form
            onSubmit={handleCreatePlaylist}
            className="flex gap-2 p-4 rounded-2xl bg-[#11111A] border border-[#B8FF00]/30 max-w-md"
          >
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name (e.g. Midnight Cyber)"
              className="flex-1 rounded-xl bg-black/40 border border-white/[0.1] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#B8FF00]"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-xl bg-[#B8FF00] px-4 py-2 text-xs font-bold text-black"
            >
              Create
            </button>
          </form>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-white/[0.08] pb-3">
          {[
            { id: "all", label: "All Items" },
            { id: "liked", label: "Liked Songs" },
            { id: "playlists", label: "Playlists" },
            { id: "recent", label: "Recently Played" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-bold transition",
                activeTab === tab.id
                  ? "bg-white text-black shadow-md"
                  : "bg-white/[0.05] text-[#8B8B9A] hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="py-16 text-center text-xs text-[#8B8B9A] flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-[#B8FF00] animate-spin" />
            <span>Retrieving your audio library...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Playlists section */}
            {(activeTab === "all" || activeTab === "playlists") && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ListMusic className="h-4 w-4 text-[#B8FF00]" />
                  <span>Your Playlists</span>
                </h3>
                {playlists.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#8B8B9A] rounded-2xl border border-dashed border-white/[0.08]">
                    No playlists yet. Click &ldquo;New Playlist&rdquo; to create your first collection!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {playlists.map((pl) => (
                      <Link
                        key={pl.id}
                        href={`/playlists/${pl.id}`}
                        className="group flex flex-col rounded-2xl bg-[#11111A] border border-white/[0.06] p-4 transition hover:border-[#B8FF00]/30 hover:scale-[1.02]"
                      >
                        <div className="aspect-square w-full rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF] flex items-center justify-center mb-3">
                          <ListMusic className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-[#B8FF00] transition">
                          {pl.name}
                        </h4>
                        <p className="text-xs text-[#8B8B9A] mt-0.5">
                          {pl.totalTracks} tracks
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Liked Songs section */}
            {(activeTab === "all" || activeTab === "liked") && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" />
                  <span>Liked Songs ({likedTracks.length})</span>
                </h3>
                {likedTracks.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#8B8B9A] rounded-2xl border border-dashed border-white/[0.08]">
                    No liked tracks yet. Heart any song to collect it here!
                  </div>
                ) : (
                  <div className="space-y-1">
                    {likedTracks.map((track, idx) => (
                      <TrackRow
                        key={track.id}
                        track={track}
                        index={idx}
                        playlist={likedTracks}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recently Played */}
            {(activeTab === "all" || activeTab === "recent") && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#00F5FF]" />
                  <span>Recently Played</span>
                </h3>
                {recentTracks.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#8B8B9A] rounded-2xl border border-dashed border-white/[0.08]">
                    Listening history is clear. Start streaming to track activity.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recentTracks.map((track, idx) => (
                      <TrackRow
                        key={`${track.id}-${idx}`}
                        track={track}
                        index={idx}
                        playlist={recentTracks}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] p-8 text-xs text-[#8B8B9A] flex items-center justify-center">
          Loading Library...
        </div>
      }
    >
      <LibraryContent />
    </React.Suspense>
  );
}
