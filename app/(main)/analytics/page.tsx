"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Sparkles,
  Flame,
  Clock,
  Music,
  Headphones,
  Award,
  Zap,
} from "lucide-react";
import { ListeningStats, Achievement } from "@/types";

const COLORS = ["#B8FF00", "#00F5FF", "#7C3AED", "#FF6B9D", "#FF8C00", "#98D8C8"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<ListeningStats | null>(null);
  const [achievements, setAchievements] = useState<
    (Achievement & { unlocked: boolean })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, achRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/achievements"),
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
        if (achRes.ok) {
          const data = await achRes.json();
          setAchievements(data);
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dummyDaily = [
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 78 },
    { day: "Wed", minutes: 120 },
    { day: "Thu", minutes: 65 },
    { day: "Fri", minutes: 140 },
    { day: "Sat", minutes: 190 },
    { day: "Sun", minutes: 110 },
  ];

  const dummyGenres = [
    { name: "Electronic", value: 38 },
    { name: "Lo-Fi", value: 24 },
    { name: "Indie", value: 16 },
    { name: "Pop", value: 12 },
    { name: "Rock", value: 10 },
  ];

  const chartDaily =
    stats?.listeningByDay && stats.listeningByDay.length > 0
      ? stats.listeningByDay
      : dummyDaily;

  const chartGenres =
    stats?.topGenres && stats.topGenres.length > 0
      ? stats.topGenres.map((g) => ({ name: g.genre, value: g.percentage }))
      : dummyGenres;

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-10">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#11111A] via-[#090912] to-[#050505] p-8 md:p-12">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#B8FF00]/15 blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#B8FF00]/30 bg-[#B8FF00]/10 px-3 py-1 text-xs font-bold text-[#B8FF00]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Biometric Audio Profile</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white">
              Your Music DNA
            </h1>
            <p className="text-sm text-[#8B8B9A]">
              Comprehensive acoustic analytics, listening trends, and achievement
              badges unlocked along your sonic journey.
            </p>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#11111A] p-5 space-y-2">
            <div className="flex items-center justify-between text-[#8B8B9A]">
              <span className="text-xs font-bold uppercase tracking-wider">
                Minutes Streamed
              </span>
              <Clock className="h-4 w-4 text-[#B8FF00]" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-white">
              {stats?.totalMinutes ? stats.totalMinutes : 348}
            </p>
            <p className="text-[11px] text-[#B8FF00] font-medium">+18% this week</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11111A] p-5 space-y-2">
            <div className="flex items-center justify-between text-[#8B8B9A]">
              <span className="text-xs font-bold uppercase tracking-wider">
                Tracks Explored
              </span>
              <Music className="h-4 w-4 text-[#00F5FF]" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-white">
              {stats?.totalTracks ? stats.totalTracks : 92}
            </p>
            <p className="text-[11px] text-[#00F5FF] font-medium">14 new discoveries</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11111A] p-5 space-y-2">
            <div className="flex items-center justify-between text-[#8B8B9A]">
              <span className="text-xs font-bold uppercase tracking-wider">
                Listening Streak
              </span>
              <Flame className="h-4 w-4 text-orange-400" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-white">7 Days</p>
            <p className="text-[11px] text-orange-400 font-medium">On fire</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#11111A] p-5 space-y-2">
            <div className="flex items-center justify-between text-[#8B8B9A]">
              <span className="text-xs font-bold uppercase tracking-wider">
                Vibe Dominance
              </span>
              <Zap className="h-4 w-4 text-[#7C3AED]" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-white">Chillout</p>
            <p className="text-[11px] text-[#7C3AED] font-medium">Alpha wave sync</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Listening Velocity (Area Chart) */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#11111A] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#B8FF00]" />
              <span>Weekly Listening Activity (Minutes)</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDaily}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B8FF00" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#B8FF00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#8B8B9A" fontSize={11} />
                  <YAxis stroke="#8B8B9A" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#050505",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="#B8FF00"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMinutes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Genre Distribution (Pie / Donut Chart) */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#11111A] p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Headphones className="h-4 w-4 text-[#00F5FF]" />
              <span>Genre Resonance Breakdown</span>
            </h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartGenres}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartGenres.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#050505",
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gamification Achievements Unlocked */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-[#B8FF00]" />
              <span>Gamified Achievements</span>
            </h2>
            <span className="text-xs text-[#8B8B9A]">
              Collect badges by streaming, creating playlists, and finding hidden gems
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(achievements.length > 0
              ? achievements
              : [
                  { id: "1", name: "First Vibe", description: "Played your first track", icon: "▶️", unlocked: true },
                  { id: "2", name: "Night Owl", description: "Listened after midnight 5 times", icon: "🦉", unlocked: true },
                  { id: "3", name: "Genre Explorer", description: "Streamed 10 distinct genres", icon: "🗺️", unlocked: true },
                  { id: "4", name: "100 Songs Club", description: "100 unique tracks experienced", icon: "💯", unlocked: false },
                  { id: "5", name: "Playlist Master", description: "Created 5 bespoke playlists", icon: "📋", unlocked: false },
                  { id: "6", name: "Music Marathon", description: "Streamed 4 continuous hours", icon: "🎧", unlocked: false },
                ]
            ).map((ach) => (
              <div
                key={ach.id}
                className={`rounded-2xl p-4 border transition ${
                  ach.unlocked
                    ? "bg-[#11111A] border-[#B8FF00]/40 shadow-[0_0_15px_rgba(184,255,0,0.1)]"
                    : "bg-[#090912]/40 border-white/[0.04] opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{ach.icon}</div>
                <h4 className="text-sm font-bold text-white">{ach.name}</h4>
                <p className="text-[11px] text-[#8B8B9A] mt-1">{ach.description}</p>
                <span
                  className={`inline-block mt-3 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    ach.unlocked
                      ? "bg-[#B8FF00]/20 text-[#B8FF00]"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {ach.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
