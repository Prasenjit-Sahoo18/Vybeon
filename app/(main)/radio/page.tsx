"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { TrackRow } from "@/components/music/TrackRow";
import { Radio, Play, Sparkles, Flame, Waves, Disc } from "lucide-react";
import { usePlayerStore } from "@/store/player";
import { Track } from "@/types";
import { cn } from "@/lib/utils";

const STATIONS = [
  { id: "trending", name: "Vybe Matrix", description: "The premier frequency mix of hot tracks", icon: Flame, color: "#B8FF00" },
  { id: "electronic", name: "Cyber Techno", description: "Non-stop synthesized electronic underground", icon: Radio, color: "#00F5FF" },
  { id: "lo-fi", name: "Deep Focus", description: "Continuous mellow lo-fi beats for flow state", icon: Waves, color: "#7C3AED" },
  { id: "rock", name: "Electric Overdrive", description: "Guitar-driven raw energy radio", icon: Disc, color: "#FF4444" },
  { id: "ambient", name: "Orbital Space", description: "Zero-gravity atmospheric soundscapes", icon: Sparkles, color: "#4A9EFF" },
];

export default function RadioPage() {
  const { playTrack } = usePlayerStore();
  const [currentStation, setCurrentStation] = useState(STATIONS[0]);
  const [stationTracks, setStationTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStation = async (station: typeof STATIONS[0]) => {
    setCurrentStation(station);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/radio?mode=${station.id === "trending" ? "trending" : "genre"}&seedId=${station.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setStationTracks(data.tracks || []);
      }
    } catch (err) {
      console.error("Failed to load radio station:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStation(STATIONS[0]);
  }, []);

  const handleStartStation = () => {
    if (stationTracks.length > 0) {
      playTrack(stationTracks[0], stationTracks.slice(1));
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-10">
        {/* Neon Radio Station Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090912] p-8 md:p-12">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#B8FF00]/15 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B8FF00]">
                <span className="flex h-2 w-2 rounded-full bg-[#B8FF00] animate-ping" />
                <span>Neon Radio Broadcast</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {currentStation.name}
              </h1>
              <p className="text-sm text-[#8B8B9A] leading-relaxed">
                {currentStation.description}. Algorithmic endless queue generator that
                learns your skips and likes.
              </p>
            </div>

            <button
              onClick={handleStartStation}
              disabled={stationTracks.length === 0}
              className="flex items-center gap-2.5 rounded-full bg-[#B8FF00] px-7 py-3.5 text-sm font-bold text-[#050505] shadow-[0_0_25px_rgba(184,255,0,0.5)] hover:scale-105 transition duration-200 shrink-0"
            >
              <Play className="h-4 w-4 fill-current ml-0.5" />
              <span>Broadcast Now</span>
            </button>
          </div>
        </div>

        {/* Station Selectors */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Live Stations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {STATIONS.map((station) => {
              const Icon = station.icon;
              const isActive = currentStation.id === station.id;

              return (
                <button
                  key={station.id}
                  onClick={() => loadStation(station)}
                  className={cn(
                    "flex flex-col items-start justify-between rounded-2xl p-4 border transition-all text-left",
                    isActive
                      ? "border-[#B8FF00] bg-[#B8FF00]/10 shadow-[0_0_15px_rgba(184,255,0,0.15)]"
                      : "border-white/[0.08] bg-[#11111A] hover:border-white/[0.2]"
                  )}
                >
                  <Icon
                    className="h-6 w-6 mb-3"
                    style={{ color: station.color }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {station.name}
                    </h3>
                    <p className="text-[11px] text-[#8B8B9A] mt-0.5 line-clamp-1">
                      {station.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Station Queue Tracks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Station Tracklist</h2>
            <span className="text-xs text-[#8B8B9A] font-mono">
              {stationTracks.length} auto-queued
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#8B8B9A] flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-[#B8FF00] animate-spin" />
              <span>Tuning antenna to station...</span>
            </div>
          ) : (
            <div className="space-y-1">
              {stationTracks.map((track, idx) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={idx}
                  playlist={stationTracks}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
