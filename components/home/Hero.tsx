"use client";

import React from "react";
import Link from "next/link";
import { Play, Sparkles, Zap, Flame } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onPlayTrending?: () => void;
}

export function Hero({ onPlayTrending }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090912] p-8 md:p-14 shadow-2xl mb-10">
      {/* Aurora Neon Gradients */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#7C3AED]/25 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-[#B8FF00]/15 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#00F5FF]/15 blur-[100px] pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Headline & CTA */}
        <div className="flex-1 text-center lg:text-left space-y-5 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#B8FF00]/30 bg-[#B8FF00]/10 px-4 py-1.5 text-xs font-bold text-[#B8FF00] shadow-[0_0_15px_rgba(184,255,0,0.2)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Generation Audio Stream</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase">
            Where Every Vibe <br />
            <span className="bg-gradient-to-r from-[#B8FF00] via-[#00F5FF] to-[#7C3AED] bg-clip-text text-transparent drop-shadow-sm">
              Comes Alive.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#8B8B9A] max-w-lg leading-relaxed">
            Discover music that matches your mood, your moment, and your world.
            Algorithmic frequency tuning, lossless streaming, and AI mood engine.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onPlayTrending}
              className="flex items-center gap-2.5 rounded-full bg-[#B8FF00] px-7 py-3.5 text-sm font-bold text-[#050505] shadow-[0_0_25px_rgba(184,255,0,0.4)] hover:scale-105 hover:brightness-110 transition-all duration-200"
            >
              <Play className="h-4 w-4 fill-current ml-0.5" />
              <span>Start Listening</span>
            </button>

            <Link
              href="/vibe-engine"
              className="flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.05] px-6 py-3.5 text-sm font-bold text-[#F5F5F5] hover:bg-white/[0.1] hover:border-[#00F5FF]/40 transition"
            >
              <Flame className="h-4 w-4 text-[#00F5FF]" />
              <span>Launch Vibe Engine</span>
            </Link>
          </div>
        </div>

        {/* Right: Floating Futuristic Neon Cards */}
        <div className="relative w-full max-w-sm lg:max-w-md h-64 md:h-72 hidden sm:flex items-center justify-center">
          {/* Card 1: Radium Pulse */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-2 left-4 w-52 rounded-2xl bg-[#11111A]/90 border border-[#B8FF00]/40 p-3.5 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#B8FF00] to-[#00F5FF] flex items-center justify-center text-black font-black text-xs">
                VIBE
              </div>
              <div>
                <p className="text-xs font-bold text-white">Radium Pulse</p>
                <p className="text-[10px] text-[#B8FF00]">Neon Pulse • 128 BPM</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Deep Focus AI */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-4 right-4 w-56 rounded-2xl bg-[#11111A]/90 border border-[#7C3AED]/40 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF] flex items-center justify-center text-white font-black text-xs">
                AI
              </div>
              <div>
                <p className="text-xs font-bold text-white">Focus Engine</p>
                <p className="text-[10px] text-[#00F5FF]">45 mins • Ambient Flow</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Center Audio Reactive Visual badge */}
          <div className="rounded-full bg-[#050505]/80 border border-white/[0.1] px-5 py-2.5 shadow-2xl flex items-center gap-3 backdrop-blur-2xl">
            <Zap className="h-4 w-4 text-[#B8FF00] animate-pulse" />
            <span className="text-xs font-bold tracking-wide text-white">
              Hi-Fi Studio Master
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
