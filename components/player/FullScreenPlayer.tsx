"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ListMusic,
  Share2,
  Sparkles,
  Volume2,
} from "lucide-react";
import { usePlayerStore } from "@/store/player";
import { formatDuration, cn } from "@/lib/utils";

export function FullScreenPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progress,
    shuffle,
    repeat,
    showFullScreen,
    togglePlayPause,
    nextTrack,
    prevTrack,
    toggleShuffle,
    cycleRepeat,
    toggleFullScreen,
    setProgress,
    setCurrentTime,
  } = usePlayerStore();

  const [copied, setCopied] = useState(false);

  if (!showFullScreen || !currentTrack) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    setCurrentTime(val * (duration || currentTrack.duration));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/tracks/${currentTrack.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 240 }}
        className="fixed inset-0 z-50 flex flex-col bg-[#050505] overflow-hidden"
      >
        {/* Dynamic Blurred Aurora Backdrop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-1/4 -left-1/4 h-[80vw] w-[80vw] rounded-full bg-[#7C3AED]/30 blur-[140px]" />
          <div className="absolute top-1/3 -right-1/4 h-[70vw] w-[70vw] rounded-full bg-[#B8FF00]/20 blur-[150px]" />
          <div className="absolute -bottom-1/4 left-1/3 h-[60vw] w-[60vw] rounded-full bg-[#00F5FF]/20 blur-[130px]" />
        </div>

        {/* Top Bar Navigation */}
        <div className="relative z-10 flex h-20 items-center justify-between px-6 md:px-12">
          <button
            onClick={toggleFullScreen}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-[#8B8B9A] hover:bg-white/[0.1] hover:text-white transition"
          >
            <ChevronDown className="h-6 w-6" />
          </button>

          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8FF00]">
              Playing From Catalog
            </p>
            <p className="text-xs font-semibold text-[#F5F5F5] truncate max-w-xs md:max-w-md">
              {currentTrack.album?.title || "VYBEON Infinite"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-[#8B8B9A] hover:bg-white/[0.1] hover:text-white transition"
              title="Share Track"
            >
              <Share2 className="h-4 w-4" />
            </button>
            {copied && (
              <span className="absolute right-24 text-xs font-bold text-[#B8FF00]">
                Link Copied!
              </span>
            )}
          </div>
        </div>

        {/* Center Stage: Huge Artwork & Song Info */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 max-w-2xl mx-auto w-full">
          <motion.div
            animate={{ scale: isPlaying ? 1 : 0.94 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-square w-full max-w-[340px] md:max-w-[420px] rounded-3xl overflow-hidden border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {currentTrack.imageUrl ? (
              <Image
                src={currentTrack.imageUrl}
                alt={currentTrack.title}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-tr from-[#7C3AED] via-[#11111A] to-[#00F5FF]" />
            )}
          </motion.div>

          {/* Song Meta */}
          <div className="flex items-center justify-between w-full mt-8">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-white truncate drop-shadow-sm">
                {currentTrack.title}
              </h1>
              <p className="text-sm md:text-base text-[#8B8B9A] font-medium mt-1 truncate">
                {currentTrack.artist?.name}
              </p>
            </div>
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-[#8B8B9A] hover:text-[#B8FF00] transition">
              <Heart className="h-6 w-6" />
            </button>
          </div>

          {/* Scrubber */}
          <div className="w-full mt-6 space-y-2">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={progress || 0}
              onChange={handleSeek}
              className="w-full accent-[#B8FF00] h-1.5 bg-white/10 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-[#8B8B9A]">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration || currentTrack.duration)}</span>
            </div>
          </div>

          {/* Giant Transport Controls */}
          <div className="flex items-center justify-between w-full mt-8 px-4">
            <button
              onClick={toggleShuffle}
              className={cn(
                "p-3 rounded-full text-[#8B8B9A] hover:text-white transition",
                shuffle && "text-[#B8FF00] drop-shadow-[0_0_10px_#B8FF00]"
              )}
            >
              <Shuffle className="h-6 w-6" />
            </button>

            <button
              onClick={prevTrack}
              className="p-3 rounded-full text-[#8B8B9A] hover:text-white transition hover:scale-110"
            >
              <SkipBack className="h-8 w-8" />
            </button>

            <button
              onClick={togglePlayPause}
              className="flex h-18 w-18 items-center justify-center rounded-full bg-[#B8FF00] text-[#050505] shadow-[0_0_30px_rgba(184,255,0,0.6)] hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 fill-current" />
              ) : (
                <Play className="h-8 w-8 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-3 rounded-full text-[#8B8B9A] hover:text-white transition hover:scale-110"
            >
              <SkipForward className="h-8 w-8" />
            </button>

            <button
              onClick={cycleRepeat}
              className={cn(
                "p-3 rounded-full text-[#8B8B9A] hover:text-white transition",
                repeat !== "off" && "text-[#B8FF00] drop-shadow-[0_0_10px_#B8FF00]"
              )}
            >
              {repeat === "one" ? (
                <Repeat1 className="h-6 w-6" />
              ) : (
                <Repeat className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Footer Meta info */}
        <div className="relative z-10 flex h-16 items-center justify-center border-t border-white/[0.05] text-xs text-[#8B8B9A]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#B8FF00]" />
            VYBEON Audio Master • 320kbps High Fidelity
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
