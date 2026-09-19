"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/[0.06] bg-[#050505]/80 px-4 md:px-8 backdrop-blur-xl">
      {/* Navigation History & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-[#8B8B9A] hover:bg-white/[0.08] hover:text-white transition"
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.forward()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-[#8B8B9A] hover:bg-white/[0.08] hover:text-white transition"
            aria-label="Go forward"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Global Quick Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B8B9A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, artists, albums, or vibes..."
            className="w-full rounded-full bg-white/[0.06] border border-white/[0.08] py-2 pl-10 pr-4 text-xs md:text-sm text-[#F5F5F5] placeholder-[#8B8B9A] focus:border-[#B8FF00] focus:outline-none focus:ring-1 focus:ring-[#B8FF00] transition-all"
          />
        </form>
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-3">
        <Link
          href="/vibe-engine"
          className="hidden md:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B8FF00]/10 to-[#00F5FF]/10 border border-[#B8FF00]/30 px-3 py-1.5 text-xs font-semibold text-[#B8FF00] hover:shadow-[0_0_15px_rgba(184,255,0,0.2)] transition"
        >
          <Zap className="h-3.5 w-3.5 text-[#B8FF00]" />
          <span>Vibe Engine</span>
        </Link>

        {session ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-full bg-white/[0.05] p-1.5 pr-3 border border-white/[0.08] hover:border-white/[0.2] transition"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF] text-xs font-bold text-white shadow-sm">
                {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
              </div>
              <span className="hidden md:inline text-xs font-medium text-[#F5F5F5]">
                {session.user?.name || "User"}
              </span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl border border-white/[0.08] bg-[#11111A] py-1.5 shadow-2xl backdrop-blur-xl z-50"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-white/[0.06]">
                  <p className="text-xs font-semibold text-white truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-[11px] text-[#8B8B9A] truncate">
                    {session.user?.email}
                  </p>
                </div>
                <Link
                  href="/profile/me"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#8B8B9A] hover:bg-white/[0.05] hover:text-white"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/analytics"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[#8B8B9A] hover:bg-white/[0.05] hover:text-white"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#B8FF00]" />
                  <span>Music DNA</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/[0.05]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-1.5 text-xs font-medium text-[#F5F5F5] hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#B8FF00] px-4 py-1.5 text-xs font-bold text-[#050505] shadow-[0_0_15px_rgba(184,255,0,0.3)] hover:brightness-110 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
