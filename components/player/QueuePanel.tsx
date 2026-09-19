"use client";

import React from "react";
import Image from "next/image";
import { X, Trash2, Play, Music, GripVertical } from "lucide-react";
import { usePlayerStore } from "@/store/player";
import { formatDuration } from "@/lib/utils";

export function QueuePanel() {
  const {
    currentTrack,
    queue,
    removeFromQueue,
    clearQueue,
    toggleQueue,
    playTrack,
  } = usePlayerStore();

  return (
    <div className="fixed bottom-24 right-4 z-40 w-80 md:w-96 rounded-2xl border border-white/[0.1] bg-[#11111A]/95 p-4 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-bold text-white">Play Queue</h3>
          <p className="text-[11px] text-[#8B8B9A]">{queue.length + (currentTrack ? 1 : 0)} tracks loaded</p>
        </div>
        <div className="flex items-center gap-1">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="p-1.5 text-xs text-[#8B8B9A] hover:text-red-400 transition"
              title="Clear Queue"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={toggleQueue}
            className="p-1.5 text-[#8B8B9A] hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 max-h-80 overflow-y-auto space-y-3 pr-1">
        {/* Now Playing section */}
        {currentTrack && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#B8FF00] mb-1.5">
              Now Playing
            </p>
            <div className="flex items-center justify-between rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/20 p-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/40">
                  {currentTrack.imageUrl ? (
                    <Image
                      src={currentTrack.imageUrl}
                      alt={currentTrack.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Music className="h-5 w-5 m-auto text-[#B8FF00]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#B8FF00] truncate">
                    {currentTrack.title}
                  </p>
                  <p className="text-[11px] text-[#8B8B9A] truncate">
                    {currentTrack.artist?.name}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#8B8B9A]">
                {formatDuration(currentTrack.duration)}
              </span>
            </div>
          </div>
        )}

        {/* Next Up section */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8B9A] mb-1.5">
            Next Up
          </p>
          {queue.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#8B8B9A]">
              Queue is empty. Click any song to add or start radio!
            </div>
          ) : (
            <div className="space-y-1.5">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  className="group flex items-center justify-between rounded-xl p-2 hover:bg-white/[0.05] transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] font-mono text-[#8B8B9A] w-4 text-center group-hover:hidden">
                      {idx + 1}
                    </span>
                    <button
                      onClick={() => playTrack(track, queue)}
                      className="hidden group-hover:flex text-[#B8FF00] w-4 justify-center"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </button>
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-black/30">
                      {track.imageUrl ? (
                        <Image
                          src={track.imageUrl}
                          alt={track.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <Music className="h-4 w-4 m-auto text-white/50" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#F5F5F5] truncate group-hover:text-white">
                        {track.title}
                      </p>
                      <p className="text-[10px] text-[#8B8B9A] truncate">
                        {track.artist?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#8B8B9A]">
                      {formatDuration(track.duration)}
                    </span>
                    <button
                      onClick={() => removeFromQueue(track.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#8B8B9A] hover:text-red-400 transition"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
