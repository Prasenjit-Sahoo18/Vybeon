"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Settings, Sliders, Volume2, Shield, Sparkles, Check } from "lucide-react";

export default function SettingsPage() {
  const [quality, setQuality] = useState("high");
  const [autoplay, setAutoplay] = useState(true);
  const [normalize, setNormalize] = useState(true);
  const [crossfade, setCrossfade] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-12 py-10 max-w-4xl mx-auto space-y-8">
        <div className="border-b border-white/[0.08] pb-6">
          <h1 className="text-3xl font-black text-white">Audio & App Settings</h1>
          <p className="text-xs md:text-sm text-[#8B8B9A] mt-1">
            Configure your playback engine, audio stream bitrates, and privacy
          </p>
        </div>

        {/* Audio Engine Quality */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#11111A] p-6 space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-[#B8FF00]">
            <Volume2 className="h-4 w-4" />
            <span>Audio Fidelity & Quality</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Streaming Bitrate</p>
                <p className="text-xs text-[#8B8B9A]">
                  Higher bitrates require more network bandwidth
                </p>
              </div>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="rounded-xl bg-black/40 border border-white/[0.1] px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#B8FF00]"
              >
                <option value="normal">Normal (160 kbps AAC)</option>
                <option value="high">High (320 kbps MP3)</option>
                <option value="lossless">Lossless Master (FLAC 24-bit)</option>
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
              <div>
                <p className="text-sm font-bold text-white">Continuous Autoplay</p>
                <p className="text-xs text-[#8B8B9A]">
                  Keep playing recommended similar tracks when your queue ends
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
                className="h-5 w-5 accent-[#B8FF00] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
              <div>
                <p className="text-sm font-bold text-white">Audio Normalization</p>
                <p className="text-xs text-[#8B8B9A]">
                  Equalize volume levels across different tracks automatically
                </p>
              </div>
              <input
                type="checkbox"
                checked={normalize}
                onChange={(e) => setNormalize(e.target.checked)}
                className="h-5 w-5 accent-[#B8FF00] rounded cursor-pointer"
              />
            </div>

            <div className="border-t border-white/[0.04] pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-white">Crossfade Songs</p>
                  <p className="text-xs text-[#8B8B9A]">
                    Smooth transition between songs without gaps
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#B8FF00]">
                  {crossfade}s
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={12}
                value={crossfade}
                onChange={(e) => setCrossfade(parseInt(e.target.value, 10))}
                className="w-full accent-[#B8FF00] h-1.5 bg-white/10 rounded-full cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Privacy & Account */}
        <section className="rounded-3xl border border-white/[0.08] bg-[#11111A] p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#00F5FF]">
            <Shield className="h-4 w-4" />
            <span>Social & Privacy</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Public Music DNA</p>
              <p className="text-xs text-[#8B8B9A]">
                Allow other listeners to view your favorite genres and playlists
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-[#00F5FF] rounded cursor-pointer"
            />
          </div>
        </section>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-full bg-[#B8FF00] px-6 py-2.5 text-xs font-bold text-black shadow-[0_0_15px_rgba(184,255,0,0.3)] hover:brightness-110 transition"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                <span>Preferences Saved</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
