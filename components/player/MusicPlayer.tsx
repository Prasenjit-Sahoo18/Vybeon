"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ListMusic,
  Maximize2,
  Heart,
  FileText,
  Activity,
} from "lucide-react";
import { usePlayerStore } from "@/store/player";
import { formatDuration, cn } from "@/lib/utils";
import { AudioVisualizer } from "./AudioVisualizer";
import { QueuePanel } from "./QueuePanel";
import { LyricsPanel } from "./LyricsPanel";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackIdRef = useRef<string | null>(null);
  const [showVis, setShowVis] = useState(false);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    progress,
    duration,
    currentTime,
    shuffle,
    repeat,
    showQueue,
    showLyrics,
    togglePlayPause,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    setProgress,
    setDuration,
    setCurrentTime,
    toggleShuffle,
    cycleRepeat,
    toggleQueue,
    toggleLyrics,
    toggleFullScreen,
    setIsLoading,
  } = usePlayerStore();

  // Audio source & playback sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack || !currentTrack.audioUrl) {
      audio.pause();
      return;
    }

    // When a new track is loaded
    if (currentTrackIdRef.current !== currentTrack.id) {
      currentTrackIdRef.current = currentTrack.id;
      audio.src = currentTrack.audioUrl;
      audio.load();
      if (currentTrack.duration) {
        setDuration(currentTrack.duration);
      }
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Playback error or autoplay prevented:", err);
        });
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, setDuration]);

  // Volume & Mute sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === "n" || e.key === "N") {
        nextTrack();
      } else if (e.key === "p" || e.key === "P") {
        prevTrack();
      } else if (e.key === "ArrowRight") {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(
            audioRef.current.currentTime + 5,
            audioRef.current.duration || 0
          );
        }
      } else if (e.key === "ArrowLeft") {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(
            audioRef.current.currentTime - 5,
            0
          );
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setVolume(Math.min(volume + 0.05, 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setVolume(Math.max(volume - 0.05, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlayPause, nextTrack, prevTrack, volume, setVolume]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const cur = audio.currentTime;
    const dur = audio.duration || currentTrack?.duration || 1;
    setCurrentTime(cur);
    if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
    setProgress(cur / dur);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
      setDuration(audio.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      const targetDur = audio.duration || duration || currentTrack?.duration || 1;
      const newTime = newProgress * targetDur;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(newProgress);
    }
  };

  const handleEnded = () => {
    if (repeat === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      nextTrack();
    }
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Native HTML5 Audio Element for Instant, High-Fidelity Audio */}
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      />

      {/* Slide-out Panels */}
      {showQueue && <QueuePanel />}
      {showLyrics && <LyricsPanel />}

      {/* Persistent Bottom Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-20 md:h-24 border-t border-white/[0.08] bg-[#050505]/95 backdrop-blur-2xl px-4 md:px-8">
        <div className="flex h-full items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Left: Track Artwork & Info */}
          <div className="flex items-center gap-3 md:w-1/4 min-w-0">
            <div
              onClick={toggleFullScreen}
              className="group relative h-12 w-12 md:h-14 md:w-14 shrink-0 overflow-hidden rounded-xl border border-white/[0.1] bg-[#11111A] cursor-pointer"
            >
              {currentTrack.imageUrl ? (
                <Image
                  src={currentTrack.imageUrl}
                  alt={currentTrack.title}
                  fill
                  sizes="56px"
                  className="object-cover transition-transform group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#7C3AED] to-[#00F5FF]" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <Maximize2 className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div
                onClick={toggleFullScreen}
                className="cursor-pointer font-bold text-sm text-[#F5F5F5] hover:text-[#B8FF00] truncate transition"
              >
                {currentTrack.title}
              </div>
              <Link
                href={currentTrack.artistId ? `/artists/${currentTrack.artistId}` : "#"}
                className="text-xs text-[#8B8B9A] hover:text-white truncate block transition"
              >
                {currentTrack.artist?.name || "Unknown Artist"}
              </Link>
            </div>

            <button
              className="hidden sm:flex text-[#8B8B9A] hover:text-[#B8FF00] transition"
              title="Like song"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>

          {/* Center: Controls & Scrubber */}
          <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={toggleShuffle}
                className={cn(
                  "text-[#8B8B9A] hover:text-white transition",
                  shuffle && "text-[#B8FF00] drop-shadow-[0_0_8px_rgba(184,255,0,0.8)]"
                )}
                title="Shuffle"
              >
                <Shuffle className="h-4 w-4" />
              </button>

              <button
                onClick={prevTrack}
                className="text-[#8B8B9A] hover:text-white transition"
                title="Previous"
              >
                <SkipBack className="h-5 w-5" />
              </button>

              <button
                onClick={togglePlayPause}
                className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-[#B8FF00] text-[#050505] shadow-[0_0_20px_rgba(184,255,0,0.5)] hover:scale-105 transition-transform"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="text-[#8B8B9A] hover:text-white transition"
                title="Next"
              >
                <SkipForward className="h-5 w-5" />
              </button>

              <button
                onClick={cycleRepeat}
                className={cn(
                  "text-[#8B8B9A] hover:text-white transition",
                  repeat !== "off" && "text-[#B8FF00] drop-shadow-[0_0_8px_rgba(184,255,0,0.8)]"
                )}
                title="Repeat"
              >
                {repeat === "one" ? (
                  <Repeat1 className="h-4 w-4" />
                ) : (
                  <Repeat className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Scrubber progress bar */}
            <div className="flex w-full items-center gap-2.5">
              <span className="text-[10px] font-mono text-[#8B8B9A] w-8 text-right">
                {formatDuration(currentTime)}
              </span>

              <div className="relative flex-1 group py-1 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.001}
                  value={progress || 0}
                  onChange={handleSeek}
                  className="w-full accent-[#B8FF00] h-1 bg-white/10 rounded-full cursor-pointer group-hover:h-1.5 transition-all"
                />
              </div>

              <span className="text-[10px] font-mono text-[#8B8B9A] w-8">
                {formatDuration(duration || currentTrack.duration)}
              </span>
            </div>
          </div>

          {/* Right: Extra Tools (Visualizer, Lyrics, Queue, Volume, Fullscreen) */}
          <div className="hidden md:flex items-center justify-end gap-3.5 md:w-1/4">
            <button
              onClick={() => setShowVis(!showVis)}
              className={cn(
                "p-1.5 rounded-lg text-[#8B8B9A] hover:text-white transition",
                showVis && "text-[#00F5FF] bg-white/[0.05]"
              )}
              title="Toggle Audio Visualizer"
            >
              <Activity className="h-4 w-4" />
            </button>

            {showVis && (
              <div className="hidden xl:block">
                <AudioVisualizer
                  audioElement={audioRef.current}
                  isPlaying={isPlaying}
                  className="h-8 w-24"
                />
              </div>
            )}

            <button
              onClick={toggleLyrics}
              className={cn(
                "p-1.5 rounded-lg text-[#8B8B9A] hover:text-white transition",
                showLyrics && "text-[#B8FF00] bg-white/[0.05]"
              )}
              title="Lyrics"
            >
              <FileText className="h-4 w-4" />
            </button>

            <button
              onClick={toggleQueue}
              className={cn(
                "p-1.5 rounded-lg text-[#8B8B9A] hover:text-white transition",
                showQueue && "text-[#B8FF00] bg-white/[0.05]"
              )}
              title="Queue"
            >
              <ListMusic className="h-4 w-4" />
            </button>

            {/* Volume Slider */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-[#8B8B9A] hover:text-white transition"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-red-400" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-18 accent-[#B8FF00] h-1 bg-white/10 rounded-full cursor-pointer"
              />
            </div>

            <button
              onClick={toggleFullScreen}
              className="p-1.5 text-[#8B8B9A] hover:text-white transition"
              title="Full Screen Player"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
