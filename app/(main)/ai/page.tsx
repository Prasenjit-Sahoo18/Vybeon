"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TrackRow } from "@/components/music/TrackRow";
import { Sparkles, Send, Bot, User, Play, Music } from "lucide-react";
import { usePlayerStore } from "@/store/player";
import { Track } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tracks?: Track[];
}

const SAMPLE_PROMPTS = [
  "Create a playlist for late-night coding with deep focus",
  "High energy 30-minute workout tracks with heavy bass",
  "Mellow acoustic and lo-fi vibes for a rainy afternoon",
  "Futuristic cyberpunk techno for nighttime driving",
];

export default function NeonMixAIPage() {
  const { playTrack } = usePlayerStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Greetings. I am NeonMix AI, your personal sonic architect. Tell me what vibe, activity, or atmosphere you desire, and I will compose the ideal frequency set.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/neonmix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg.content }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
          tracks: data.tracks || [],
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto space-y-8">
        {/* Banner */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#00F5FF] p-[1px] shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <div className="flex h-full w-full items-center justify-center rounded-[15px] bg-[#050505]">
              <Sparkles className="h-6 w-6 text-[#00F5FF]" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">
              NeonMix AI Assistant
            </h1>
            <p className="text-xs md:text-sm text-[#8B8B9A]">
              Natural language music curator with algorithmic acoustic mapping
            </p>
          </div>
        </div>

        {/* Chat History Messages */}
        <div className="space-y-6 pb-24">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#00F5FF]">
                  <Bot className="h-5 w-5" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4.5 space-y-3 ${
                  msg.role === "user"
                    ? "bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-white ml-auto"
                    : "bg-[#11111A] border border-white/[0.08] text-[#F5F5F5]"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>

                {/* Generated Tracks in Chat */}
                {msg.tracks && msg.tracks.length > 0 && (
                  <div className="mt-3 space-y-2 pt-3 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#B8FF00]">
                        Generated Mix ({msg.tracks.length} tracks)
                      </span>
                      <button
                        onClick={() => playTrack(msg.tracks![0], msg.tracks!.slice(1))}
                        className="flex items-center gap-1.5 rounded-full bg-[#B8FF00] px-3 py-1 text-[11px] font-bold text-black hover:brightness-110 transition"
                      >
                        <Play className="h-3 w-3 fill-current ml-0.5" />
                        <span>Play All</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      {msg.tracks.slice(0, 5).map((track, idx) => (
                        <TrackRow
                          key={track.id}
                          track={track}
                          index={idx}
                          playlist={msg.tracks}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#B8FF00] text-black">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#8B8B9A] pl-12">
              <Sparkles className="h-4 w-4 text-[#00F5FF] animate-spin" />
              <span>Analyzing sonic patterns and drafting playlist...</span>
            </div>
          )}
        </div>

        {/* Input Dock */}
        <div className="fixed bottom-24 left-0 right-0 max-w-4xl mx-auto px-4 md:px-8 z-30">
          {/* Quick suggestions */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInput(prompt)}
                className="rounded-full bg-[#11111A]/90 border border-white/[0.1] px-3.5 py-1.5 text-xs text-[#8B8B9A] hover:text-white hover:border-[#00F5FF]/40 transition shrink-0 backdrop-blur-lg"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative flex items-center rounded-2xl bg-[#11111A]/95 border border-white/[0.12] p-2 shadow-2xl backdrop-blur-xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask NeonMix for any mood, genre, or activity..."
              className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-[#8B8B9A] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B8FF00] text-black hover:brightness-110 disabled:opacity-40 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
