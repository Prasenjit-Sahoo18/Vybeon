"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Zap, Sparkles, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password credentials.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("demo@vybeon.app");
    setPassword("demo1234");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden">
      {/* Dynamic Aurora Ambient Gradients */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#7C3AED]/20 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#B8FF00]/15 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#090912]/90 p-8 md:p-10 shadow-2xl backdrop-blur-2xl relative z-10 space-y-6">
        {/* Brand Header */}
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
            Where Every Vibe Comes Alive
          </p>
        </div>

        {/* Demo Hint Box */}
        <div className="rounded-2xl border border-[#B8FF00]/30 bg-[#B8FF00]/5 p-3.5 text-xs text-[#F5F5F5] flex items-center justify-between">
          <div>
            <p className="font-bold text-[#B8FF00]">Demo Account</p>
            <p className="text-[11px] text-[#8B8B9A]">demo@vybeon.app • demo1234</p>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="rounded-lg bg-[#B8FF00]/20 border border-[#B8FF00]/40 px-2.5 py-1 text-[11px] font-bold text-[#B8FF00] hover:bg-[#B8FF00] hover:text-black transition"
          >
            Auto-fill
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B8B9A]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@vybeon.app"
                className="w-full rounded-xl bg-black/40 border border-white/[0.1] py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#8B8B9A] focus:outline-none focus:border-[#B8FF00] transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8B8B9A]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B8B9A]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-black/40 border border-white/[0.1] py-2.5 pl-10 pr-4 text-xs text-white placeholder-[#8B8B9A] focus:outline-none focus:border-[#B8FF00] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#B8FF00] py-3 text-xs font-bold text-black shadow-[0_0_20px_rgba(184,255,0,0.4)] hover:brightness-110 disabled:opacity-50 transition"
          >
            {loading ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>Sign In to VYBEON</span>
          </button>
        </form>

        <div className="text-center text-xs text-[#8B8B9A] pt-2">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-bold text-[#B8FF00] hover:underline"
          >
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
}
