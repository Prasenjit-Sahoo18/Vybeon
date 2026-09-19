"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Compass,
  Search,
  Radio,
  Library,
  Heart,
  Clock,
  Disc3,
  Users2,
  ListMusic,
  PlusCircle,
  Sparkles,
  BarChart3,
  Settings,
  Zap,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/search", label: "Search", icon: Search },
  { href: "/radio", label: "Neon Radio", icon: Radio, badge: "LIVE" },
  { href: "/library", label: "Your Library", icon: Library },
];

const MUSIC_NAV: NavItem[] = [
  { href: "/library?tab=liked", label: "Liked Songs", icon: Heart },
  { href: "/library?tab=recent", label: "Recently Played", icon: Clock },
  { href: "/library?tab=albums", label: "Albums", icon: Disc3 },
  { href: "/library?tab=artists", label: "Artists", icon: Users2 },
  { href: "/library?tab=playlists", label: "Playlists", icon: ListMusic },
];

const SPECIAL_NAV: NavItem[] = [
  { href: "/vibe-engine", label: "Vibe Engine", icon: Flame, badge: "NEW" },
  { href: "/ai", label: "NeonMix AI", icon: Sparkles, badge: "AI" },
  { href: "/analytics", label: "Music DNA", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/[0.08] bg-[#090912]/95 backdrop-blur-2xl lg:flex">
      {/* Brand Header */}
      <div className="flex h-20 items-center px-6 border-b border-white/[0.05]">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#B8FF00] via-[#00F5FF] to-[#7C3AED] p-[1px] shadow-[0_0_20px_rgba(184,255,0,0.3)] group-hover:shadow-[0_0_25px_rgba(184,255,0,0.6)] transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#050505]">
              <Zap className="h-5 w-5 text-[#B8FF00] fill-[#B8FF00]/30 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-[#F5F5F5] to-[#B8FF00] bg-clip-text text-transparent">
              VYBEON
            </span>
            <p className="text-[9px] font-semibold tracking-widest text-[#B8FF00]/80 uppercase">
              Audio Universe
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 scrollbar-thin">
        {/* Main Section */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#8B8B9A]">
            Discover
          </p>
          <div className="space-y-1">
            {MAIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#B8FF00]/10 text-[#B8FF00] font-semibold shadow-[0_0_15px_rgba(184,255,0,0.15)]"
                      : "text-[#8B8B9A] hover:bg-white/[0.04] hover:text-[#F5F5F5]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-[#B8FF00]"
                          : "text-[#8B8B9A] group-hover:text-white"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-[#B8FF00]/20 px-2 py-0.5 text-[9px] font-bold text-[#B8FF00] border border-[#B8FF00]/30">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#B8FF00] shadow-[0_0_8px_#B8FF00]"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Vybe Specials */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#8B8B9A]">
            Vybe Engines
          </p>
          <div className="space-y-1">
            {SPECIAL_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#7C3AED]/20 text-[#00F5FF] font-semibold border border-[#7C3AED]/40 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                      : "text-[#8B8B9A] hover:bg-white/[0.04] hover:text-[#F5F5F5]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-[#00F5FF]"
                          : "text-[#8B8B9A] group-hover:text-[#00F5FF]"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#00F5FF] px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Your Collection */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8B8B9A]">
              Your Library
            </p>
            <Link
              href="/library?create=true"
              className="text-[#8B8B9A] hover:text-[#B8FF00] transition-colors"
              title="Create Playlist"
            >
              <PlusCircle className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-1">
            {MUSIC_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8B8B9A] transition-all hover:bg-white/[0.04] hover:text-[#F5F5F5]"
                >
                  <Icon className="h-4 w-4 text-[#8B8B9A] group-hover:text-white transition-colors" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-[#11111A] to-[#090912] border border-white/[0.06] relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 h-16 w-16 rounded-full bg-[#B8FF00]/10 blur-xl pointer-events-none" />
        <p className="text-xs font-semibold text-[#F5F5F5]">Vibe Match AI</p>
        <p className="text-[11px] text-[#8B8B9A] mt-1">
          Generate custom sonic frequencies to fit your mood instantly.
        </p>
        <Link
          href="/vibe-engine"
          className="mt-3 block text-center rounded-lg bg-[#B8FF00] py-1.5 text-xs font-bold text-[#050505] shadow-[0_0_15px_rgba(184,255,0,0.3)] hover:brightness-110 transition"
        >
          Launch Engine
        </Link>
      </div>
    </aside>
  );
}
