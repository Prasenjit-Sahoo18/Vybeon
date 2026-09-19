"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Heart, Plus, Music } from "lucide-react";
import { Track } from "@/types";
import { usePlayerStore } from "@/store/player";
import { formatDuration, cn } from "@/lib/utils";

interface TrackRowProps {
  track: Track;
  index: number;
  playlist?: Track[];
}

export function TrackRow({ track, index, playlist = [] }: TrackRowProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, addToQueue } =
    usePlayerStore();

  const isCurrent = currentTrack?.id === track.id;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track, playlist.length > 0 ? playlist : [track]);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
  };

  return (
    <div
      onClick={handlePlay}
      className={cn(
        "group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all cursor-pointer select-none",
        isCurrent
          ? "bg-[#B8FF00]/10 border border-[#B8FF00]/20"
          : "hover:bg-white/[0.04] border border-transparent"
      )}
    >
      {/* Index / Play indicator & Info */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-5 text-center shrink-0">
          {isCurrent && isPlaying ? (
            <button
              onClick={handlePlay}
              className="text-[#B8FF00] flex justify-center w-full"
            >
              <Pause className="h-4 w-4 fill-current" />
            </button>
          ) : (
            <>
              <span
                className={cn(
                  "text-xs font-mono group-hover:hidden",
                  isCurrent ? "text-[#B8FF00] font-bold" : "text-[#8B8B9A]"
                )}
              >
                {index + 1}
              </span>
              <button
                onClick={handlePlay}
                className="hidden group-hover:flex text-[#B8FF00] justify-center w-full"
              >
                <Play className="h-4 w-4 fill-current" />
              </button>
            </>
          )}
        </div>

        {/* Artwork */}
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#11111A]">
          {track.imageUrl ? (
            <Image
              src={track.imageUrl}
              alt={track.title}
              fill
              sizes="40px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <Music className="h-5 w-5 m-auto text-white/40" />
          )}
        </div>

        {/* Title & Artist */}
        <div className="min-w-0 flex-1 pr-4">
          <p
            className={cn(
              "text-sm font-semibold truncate",
              isCurrent ? "text-[#B8FF00]" : "text-[#F5F5F5] group-hover:text-white"
            )}
          >
            {track.title}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#8B8B9A] truncate">
            {track.artist ? (
              <Link
                href={`/artists/${track.artist.id}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline hover:text-white"
              >
                {track.artist.name}
              </Link>
            ) : (
              <span>Unknown Artist</span>
            )}
            {track.isExplicit && (
              <span className="rounded bg-white/10 px-1 py-0.2 text-[9px] font-bold text-white">
                E
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Album Name (Desktop) */}
      <div className="hidden md:block w-1/3 min-w-0 pr-4">
        {track.album ? (
          <Link
            href={`/albums/${track.album.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-[#8B8B9A] hover:underline hover:text-white truncate block"
          >
            {track.album.title}
          </Link>
        ) : (
          <span className="text-xs text-[#8B8B9A]/60">—</span>
        )}
      </div>

      {/* Actions & Duration */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleAddToQueue}
          className="opacity-0 group-hover:opacity-100 text-[#8B8B9A] hover:text-[#B8FF00] transition"
          title="Add to queue"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-[#8B8B9A] hover:text-[#B8FF00] transition"
          title="Like"
        >
          <Heart className="h-4 w-4" />
        </button>
        <span className="text-xs font-mono text-[#8B8B9A] w-10 text-right">
          {formatDuration(track.duration)}
        </span>
      </div>
    </div>
  );
}
