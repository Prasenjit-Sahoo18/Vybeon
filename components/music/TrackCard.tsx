"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { Track } from "@/types";
import { usePlayerStore } from "@/store/player";
import { cn } from "@/lib/utils";

interface TrackCardProps {
  track: Track;
  playlist?: Track[];
}

export function TrackCard({ track, playlist = [] }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayerStore();
  const isCurrent = currentTrack?.id === track.id;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track, playlist);
    }
  };

  return (
    <div
      onClick={handlePlay}
      className="group relative flex flex-col rounded-2xl bg-[#11111A]/80 border border-white/[0.06] p-3 transition-all hover:bg-[#11111A] hover:border-[#B8FF00]/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer select-none"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#050505] shadow-inner">
        {track.imageUrl ? (
          <Image
            src={track.imageUrl}
            alt={track.title}
            fill
            sizes="(max-width: 768px) 160px, 200px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF]" />
        )}

        {/* Hover play button with neon glow */}
        <button
          onClick={handlePlay}
          className={cn(
            "absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#B8FF00] text-[#050505] shadow-[0_0_15px_rgba(184,255,0,0.6)] transition-all duration-300 hover:scale-110",
            isCurrent
              ? "opacity-100 scale-100"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          )}
        >
          {isCurrent && isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-0.5" />
          )}
        </button>
      </div>

      <div className="mt-3">
        <h4
          className={cn(
            "text-sm font-bold truncate transition-colors",
            isCurrent ? "text-[#B8FF00]" : "text-[#F5F5F5] group-hover:text-[#B8FF00]"
          )}
        >
          {track.title}
        </h4>
        <p className="text-xs text-[#8B8B9A] truncate mt-0.5">
          {track.artist?.name || "VYBEON Track"}
        </p>
      </div>
    </div>
  );
}
