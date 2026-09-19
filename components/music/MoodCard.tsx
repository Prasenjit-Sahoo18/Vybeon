"use client";

import React from "react";
import Link from "next/link";
import { MoodConfig } from "@/types";

interface MoodCardProps {
  mood: MoodConfig;
}

export function MoodCard({ mood }: MoodCardProps) {
  return (
    <Link
      href={`/vibe-engine?mood=${mood.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 border border-white/[0.08] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,0,0,0.6)] min-h-[140px]"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(0,0,0,0.8))`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-35 transition-opacity" />
      
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-3xl filter drop-shadow-md">{mood.emoji}</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          {mood.energy}
        </span>
      </div>

      <div className="relative z-10 mt-4">
        <h3 className="text-base font-black text-white group-hover:text-[#B8FF00] transition">
          {mood.label}
        </h3>
        <p className="text-xs text-[#8B8B9A] mt-0.5 line-clamp-1">
          {mood.description}
        </p>
      </div>
    </Link>
  );
}
