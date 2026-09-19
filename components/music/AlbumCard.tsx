"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Disc3 } from "lucide-react";
import { Album } from "@/types";

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const releaseYear = album.releaseDate
    ? new Date(album.releaseDate).getFullYear()
    : "2024";

  return (
    <Link
      href={`/albums/${album.id}`}
      className="group relative flex flex-col rounded-2xl bg-[#11111A]/80 border border-white/[0.06] p-3 transition-all hover:bg-[#11111A] hover:border-[#7C3AED]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#050505]">
        {album.imageUrl ? (
          <Image
            src={album.imageUrl}
            alt={album.title}
            fill
            sizes="(max-width: 768px) 160px, 200px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF]" />
        )}
      </div>

      <div className="mt-3">
        <h4 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#00F5FF] truncate transition">
          {album.title}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-[#8B8B9A] mt-0.5">
          <span>{releaseYear}</span>
          <span>•</span>
          <span>{album.albumType}</span>
        </div>
      </div>
    </Link>
  );
}
