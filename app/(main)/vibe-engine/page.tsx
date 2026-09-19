"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TrackRow } from "@/components/music/TrackRow";
import { Flame, Sparkles, Play, Save, CheckCircle } from "lucide-react";
import { usePlayerStore } from "@/store/player";
import { MOOD_CONFIGS, Track } from "@/types";
import { cn } from "@/lib/utils";

export default function VibeEnginePage() {
  const { playTrack } = usePlayerStore();

  const [selectedMood, setSelectedMood] = useState(MOOD_CONFIGS[0].id);
  const [selectedEnergy, setSelectedEnergy] = useState<"low" | "medium" | "high">("high");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resultTracks, setResultTracks] = useState<Track[]>([]);
  const [saved, setSaved] = useState(false);

  const handleSynthesize = async (savePlaylist = false) => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/vibe-engine${savePlaylist ? "?save=true" : ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          energy: selectedEnergy,
          durationMinutes: selectedDuration,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResultTracks(data.tracks || []);
        if (savePlaylist) {
          setSaved(true);
        }
      }
    } catch (err) {
      console.error("Vibe Engine generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (resultTracks.length > 0) {
      playTrack(resultTracks[0], resultTracks.slice(1));
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-10">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#11111A] via-[#090912] to-[#050505] p-8 md:p-12">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#B8FF00]/15 to-[#00F5FF]/15 blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#B8FF00]/30 bg-[#B8FF00]/10 px-3 py-1 text-xs font-bold text-[#B8FF00]">
              <Flame className="h-3.5 w-3.5" />
              <span>Algorithmic Frequency Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              Vibe Engine
            </h1>
            <p className="text-sm text-[#8B8B9A] leading-relaxed">
              Design a bespoke audio continuum. Select your intended mood, kinetic
              energy output, and session duration.
            </p>
          </div>
        </div>

        {/* Engine Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6 rounded-3xl border border-white/[0.08] bg-[#11111A]/90 p-6 backdrop-blur-xl">
            {/* 1. Mood Select */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A]">
                1. Target Mood
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MOOD_CONFIGS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold border transition text-left",
                      selectedMood === m.id
                        ? "border-[#B8FF00] bg-[#B8FF00]/10 text-[#B8FF00]"
                        : "border-white/[0.06] bg-black/30 text-[#8B8B9A] hover:text-white"
                    )}
                  >
                    <span>{m.emoji}</span>
                    <span className="truncate">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Energy Level */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A]">
                2. Energy Frequency
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as const).map((energy) => (
                  <button
                    key={energy}
                    onClick={() => setSelectedEnergy(energy)}
                    className={cn(
                      "rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider border transition text-center",
                      selectedEnergy === energy
                        ? "border-[#00F5FF] bg-[#00F5FF]/10 text-[#00F5FF]"
                        : "border-white/[0.06] bg-black/30 text-[#8B8B9A] hover:text-white"
                    )}
                  >
                    {energy}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Session Duration */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A]">
                  3. Duration
                </label>
                <span className="text-xs font-mono font-bold text-[#B8FF00]">
                  {selectedDuration} Minutes
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={120}
                step={15}
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(parseInt(e.target.value, 10))}
                className="w-full accent-[#B8FF00] h-1.5 bg-white/10 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8B8B9A] font-mono">
                <span>15m</span>
                <span>45m</span>
                <span>75m</span>
                <span>120m</span>
              </div>
            </div>

            {/* CTA Generate */}
            <button
              onClick={() => handleSynthesize(false)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#B8FF00] py-3.5 text-sm font-bold text-[#050505] shadow-[0_0_20px_rgba(184,255,0,0.4)] hover:brightness-110 transition"
            >
              {loading ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>Synthesize Vibe</span>
            </button>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Synthesized Playlist</h2>
                <p className="text-xs text-[#8B8B9A]">
                  {resultTracks.length > 0
                    ? `${resultTracks.length} tracks matched for your ${selectedMood} vibe`
                    : "Configure parameters on the left and synthesize."}
                </p>
              </div>

              {resultTracks.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSynthesize(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/[0.1] transition"
                  >
                    {saved ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 text-[#B8FF00]" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Save to Library</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handlePlayAll}
                    className="flex items-center gap-1.5 rounded-xl bg-[#B8FF00] px-4 py-2 text-xs font-bold text-[#050505] hover:brightness-110 transition shadow-[0_0_15px_rgba(184,255,0,0.4)]"
                  >
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                    <span>Play Vibe</span>
                  </button>
                </div>
              )}
            </div>

            {resultTracks.length > 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#11111A]/50 p-2 space-y-1">
                {resultTracks.map((track, idx) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={idx}
                    playlist={resultTracks}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.1] text-center p-6 space-y-3">
                <Flame className="h-8 w-8 text-[#B8FF00]/50" />
                <p className="text-sm font-semibold text-white">Engine Standing By</p>
                <p className="text-xs text-[#8B8B9A] max-w-sm">
                  Choose your mood and kinetic energy to generate an immediate customized
                  playlist.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
