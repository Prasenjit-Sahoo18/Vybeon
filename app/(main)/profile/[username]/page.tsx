import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { prisma } from "@/lib/db/prisma";
import { User, Sparkles, Award, ListMusic, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: { username: string };
}

async function getProfileData(username: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { id: username === "me" ? undefined : username }],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        createdAt: true,
        isPublic: true,
        playlists: {
          where: { isPublic: true },
          take: 6,
          select: { id: true, name: true, totalTracks: true },
        },
        achievements: {
          include: { achievement: true },
          take: 6,
        },
        _count: {
          select: { playlists: true, likedTracks: true, followedArtists: true },
        },
      },
    });

    return user;
  } catch (err) {
    console.error("Profile fetch error:", err);
    return null;
  }
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
  const user = await getProfileData(params.username);
  if (!user) notFound();

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-12 py-10 max-w-5xl mx-auto space-y-10">
        {/* Profile Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#11111A] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="relative h-28 w-28 md:h-36 md:w-36 rounded-full overflow-hidden border-2 border-[#B8FF00] shadow-[0_0_30px_rgba(184,255,0,0.3)] shrink-0 flex items-center justify-center bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF]">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-4xl font-extrabold text-white">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </span>
            )}
          </div>

          <div className="space-y-3 text-center md:text-left flex-1">
            <span className="rounded-full bg-[#B8FF00]/10 border border-[#B8FF00]/30 px-3 py-1 text-xs font-bold text-[#B8FF00] uppercase tracking-wider">
              Listener Profile
            </span>

            <h1 className="text-3xl font-black text-white">{user.name}</h1>
            <p className="text-xs text-[#8B8B9A] font-mono">@{user.username}</p>

            {user.bio && (
              <p className="text-sm text-[#8B8B9A] max-w-lg leading-relaxed">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-[#8B8B9A]">
              <span>
                <strong className="text-white">{user._count.playlists}</strong> Playlists
              </span>
              <span>•</span>
              <span>
                <strong className="text-white">{user._count.likedTracks}</strong> Liked Songs
              </span>
              <span>•</span>
              <span>
                <strong className="text-white">{user._count.followedArtists}</strong> Followed Artists
              </span>
            </div>
          </div>
        </div>

        {/* Public Playlists */}
        {user.playlists.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ListMusic className="h-5 w-5 text-[#B8FF00]" />
              <span>Public Collections</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {user.playlists.map((pl) => (
                <Link
                  key={pl.id}
                  href={`/playlists/${pl.id}`}
                  className="rounded-2xl border border-white/[0.08] bg-[#11111A] p-4 hover:border-[#B8FF00]/40 transition"
                >
                  <h4 className="text-sm font-bold text-white truncate">{pl.name}</h4>
                  <p className="text-xs text-[#8B8B9A] mt-1">{pl.totalTracks} tracks</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Unlocked Badges */}
        {user.achievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-[#00F5FF]" />
              <span>Unlocked Badges</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {user.achievements.map((ua) => (
                <div
                  key={ua.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#11111A] p-4 text-center"
                >
                  <span className="text-3xl block mb-2">{ua.achievement.icon}</span>
                  <h4 className="text-xs font-bold text-white">
                    {ua.achievement.name}
                  </h4>
                  <p className="text-[10px] text-[#8B8B9A] mt-0.5">
                    {ua.achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
