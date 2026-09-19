"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollRowProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  children: React.ReactNode;
}

export function HorizontalScrollRow({
  title,
  subtitle,
  children,
}: HorizontalScrollRowProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-3.5 my-8">
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#F5F5F5] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs md:text-sm text-[#8B8B9A] mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-[#8B8B9A] hover:bg-white/[0.08] hover:text-white transition"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-[#8B8B9A] hover:bg-white/[0.08] hover:text-white transition"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth scrollbar-none scrollbar-hide no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>
    </section>
  );
}
