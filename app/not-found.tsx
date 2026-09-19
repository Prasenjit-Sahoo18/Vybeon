import Link from "next/link";
import { Zap, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6 text-center">
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF] p-[1px] shadow-[0_0_30px_rgba(0,245,255,0.4)] flex items-center justify-center">
          <div className="h-full w-full rounded-[23px] bg-[#050505] flex items-center justify-center">
            <Zap className="h-10 w-10 text-[#B8FF00]" />
          </div>
        </div>
      </div>

      <h1 className="text-6xl font-black text-white tracking-tight">404</h1>
      <p className="text-lg font-bold text-[#B8FF00] mt-2 uppercase tracking-widest">
        Frequency Lost
      </p>
      <p className="text-sm text-[#8B8B9A] max-w-sm mt-2 leading-relaxed">
        The track, playlist, or sonic corridor you were searching for has dissipated into
        the digital void.
      </p>

      <div className="flex items-center gap-3 mt-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-[#B8FF00] px-6 py-2.5 text-xs font-bold text-black shadow-[0_0_20px_rgba(184,255,0,0.4)] hover:brightness-110 transition"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-6 py-2.5 text-xs font-bold text-white hover:bg-white/[0.1] transition"
        >
          <Search className="h-4 w-4" />
          <span>Search Tracks</span>
        </Link>
      </div>
    </div>
  );
}
