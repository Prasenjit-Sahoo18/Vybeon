"use client";

import React from "react";
import { X, Mic2, Sparkles } from "lucide-react";
import { usePlayerStore } from "@/store/player";

export function LyricsPanel() {
  const { currentTrack, toggleLyrics } = usePlayerStore();

  return (
    <div className="fixed bottom-24 right-4 z-40 w-80 md:w-96 rounded-2xl border border-white/[0.1] bg-[#11111A]/95 p-4 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Mic2 className="h-4 w-4 text-[#B8FF00]" />
          <h3 className="text-sm font-bold text-white">Live Lyrics</h3>
        </div>
        <button
          onClick={toggleLyrics}
          className="p-1.5 text-[#8B8B9A] hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 max-h-80 overflow-y-auto space-y-4 px-1 text-center">
        {currentTrack ? (
          <div className="space-y-4 py-4">
            <p className="text-xs text-[#8B8B9A] italic">
              Displaying legally synchronized demo text for:
            </p>
            <p className="text-sm font-extrabold text-[#B8FF00]">
              &ldquo;{currentTrack.title}&rdquo;
            </p>

            <div className="space-y-3 font-medium text-sm text-[#F5F5F5]/80">
              <p className="text-[#8B8B9A]">♪ Instrumental intro ♪</p>
              <p className="text-white font-bold drop-shadow-[0_0_12px_rgba(184,255,0,0.5)]">
                Feel the frequency in the wire
              </p>
              <p>Where every vibe lights the fire</p>
              <p>Neon pulses running through the night</p>
              <p>Digital horizons glowing bright</p>
              <p className="text-[#8B8B9A]">♪ Synthetic melody ♪</p>
              <p>Together in the sonic sound</p>
              <p>Where true frequencies are found</p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] text-[10px] text-[#8B8B9A] flex items-center justify-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#B8FF00]" />
              <span>Verified royalty-free catalog</span>
            </div>
          </div>
        ) : (
          <div className="py-8 text-xs text-[#8B8B9A]">
            Play a track to view authorized lyrics.
          </div>
        )}
      </div>
    </div>
  );
}
