"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Sparkles, Lock, Mail, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#00F5FF]/20 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#7C3AED]/20 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#090912]/90 p-8 md:p-10 shadow-2xl backdrop-blur-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#B8FF00] via-[#00F5FF] to-[#7C3AED] p-[1px] shadow-[0_0_15px_rgba(184,255,0,0.4)]">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#050505]">
                <Zap className="h-5 w-5 text-[#B8FF00] fill-[#B8FF00]/30" />
              </div>
            </div>
            <span className="text-2xl font-black tracking-wider text-white">
              VYBEON
            </span>
          </Link>
          <p className="text-xs font-semibold text-[#8B8B9A] uppercase tracking-widest">
            Join the Next-Gen Audio Stream
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A]">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B8B9A]" />
              <input
                type="text"
                required
                autoComplete="off"
                spellCheck={false}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl bg-black/40 border border-white/[0.1] py-2 pl-10 pr-4 text-xs text-white placeholder-[#8B8B9A]/60 focus:outline-none focus:border-[#B8FF00]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A]">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8B8B9A]">
                @
              </span>
              <input
                type="text"
                required
                autoComplete="off"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="choose_username"
                className="w-full rounded-xl bg-black/40 border border-white/[0.1] py-2 pl-10 pr-4 text-xs text-white placeholder-[#8B8B9A]/60 focus:outline-none focus:border-[#B8FF00]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B8B9A]" />
              <input
                type="email"
                required
                autoComplete="off"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl bg-black/40 border border-white/[0.1] py-2 pl-10 pr-4 text-xs text-white placeholder-[#8B8B9A]/60 focus:outline-none focus:border-[#B8FF00]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B8B9A]" />
              <input
                type="password"
                required
                autoComplete="new-password"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full rounded-xl bg-black/40 border border-white/[0.1] py-2 pl-10 pr-4 text-xs text-white placeholder-[#8B8B9A]/60 focus:outline-none focus:border-[#B8FF00]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A]">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B8B9A]" />
              <input
                type="password"
                required
                autoComplete="new-password"
                spellCheck={false}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-xl bg-black/40 border border-white/[0.1] py-2 pl-10 pr-4 text-xs text-white placeholder-[#8B8B9A]/60 focus:outline-none focus:border-[#B8FF00]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#B8FF00] py-3 text-xs font-bold text-black shadow-[0_0_20px_rgba(184,255,0,0.4)] hover:brightness-110 disabled:opacity-50 transition"
          >
            {loading ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>Create Account</span>
          </button>
        </form>

        <div className="text-center text-xs text-[#8B8B9A] pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#B8FF00] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
