"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Play } from "lucide-react";
import { Artist } from "@/types";
import { formatNumber } from "@/lib/utils";

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artists/${artist.id}`}
      className="group relative flex flex-col items-center rounded-2xl bg-[#11111A]/60 border border-white/[0.05] p-4 text-center transition-all hover:bg-[#11111A] hover:border-[#00F5FF]/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-square w-32 md:w-36 overflow-hidden rounded-full border-2 border-white/[0.08] group-hover:border-[#00F5FF] transition-all duration-300">
        {artist.imageUrl ? (
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            sizes="144px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF]" />
        )}
      </div>

      <div className="mt-4 w-full">
        <div className="flex items-center justify-center gap-1.5">
          <h4 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#00F5FF] transition truncate">
            {artist.name}
          </h4>
          {artist.verified && (
            <BadgeCheck className="h-4 w-4 text-[#00F5FF] shrink-0 fill-[#00F5FF]/20" />
          )}
        </div>
        <p className="text-xs text-[#8B8B9A] mt-1 font-medium">
          {formatNumber(artist.monthlyListeners)} listeners
        </p>
      </div>
    </Link>
  );
}
