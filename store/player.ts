import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Track, RepeatMode } from "@/types";

interface PlayerStore {
  currentTrack: Track | null;
  queue: Track[];
  history: Track[];
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  shuffle: boolean;
  repeat: RepeatMode;
  showQueue: boolean;
  showLyrics: boolean;
  showFullScreen: boolean;
  isLoading: boolean;

  // Actions
  setCurrentTrack: (track: Track) => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setRepeat: (mode: RepeatMode) => void;
  toggleQueue: () => void;
  toggleLyrics: () => void;
  toggleFullScreen: () => void;
  setIsLoading: (loading: boolean) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  playNext: (track: Track) => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      history: [],
      isPlaying: false,
      volume: 0.8,
      isMuted: false,
      progress: 0,
      duration: 0,
      currentTime: 0,
      shuffle: false,
      repeat: "off",
      showQueue: false,
      showLyrics: false,
      showFullScreen: false,
      isLoading: false,

      setCurrentTrack: (track) => set({ currentTrack: track, progress: 0, currentTime: 0 }),

      playTrack: (track, queue = []) => {
        const state = get();
        if (state.currentTrack) {
          set((s) => ({ history: [s.currentTrack!, ...s.history].slice(0, 50) }));
        }
        set({
          currentTrack: track,
          isPlaying: true,
          progress: 0,
          currentTime: 0,
          isLoading: true,
          queue: queue.filter((t) => t.id !== track.id),
        });
      },

      pauseTrack: () => set({ isPlaying: false }),
      resumeTrack: () => set({ isPlaying: true }),
      togglePlayPause: () => set((s) => ({ isPlaying: !s.isPlaying })),

      nextTrack: () => {
        const { queue, currentTrack, history, shuffle, repeat } = get();

        if (repeat === "one" && currentTrack) {
          set({ progress: 0, currentTime: 0, isPlaying: true });
          return;
        }

        if (queue.length === 0) {
          if (repeat === "all" && history.length > 0) {
            // Loop back
            set({ isPlaying: false });
          }
          return;
        }

        let nextIdx = 0;
        if (shuffle) {
          nextIdx = Math.floor(Math.random() * queue.length);
        }

        const next = queue[nextIdx];
        const newQueue = queue.filter((_, i) => i !== nextIdx);

        set((s) => ({
          currentTrack: next,
          queue: newQueue,
          history: s.currentTrack ? [s.currentTrack, ...s.history].slice(0, 50) : s.history,
          isPlaying: true,
          progress: 0,
          currentTime: 0,
          isLoading: true,
        }));
      },

      prevTrack: () => {
        const { currentTime, history, queue, currentTrack } = get();

        // If more than 3 seconds in, restart current track
        if (currentTime > 3) {
          set({ progress: 0, currentTime: 0 });
          return;
        }

        if (history.length === 0) return;

        const [prev, ...rest] = history;
        set({
          currentTrack: prev,
          history: rest,
          queue: currentTrack ? [currentTrack, ...queue] : queue,
          isPlaying: true,
          progress: 0,
          currentTime: 0,
          isLoading: true,
        });
      },

      setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
      setProgress: (progress) => set({ progress }),
      setDuration: (duration) => set({ duration }),
      setCurrentTime: (currentTime) => set({ currentTime }),
      toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
      cycleRepeat: () =>
        set((s) => ({
          repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
        })),
      setRepeat: (repeat) => set({ repeat }),
      toggleQueue: () => set((s) => ({ showQueue: !s.showQueue, showLyrics: false })),
      toggleLyrics: () => set((s) => ({ showLyrics: !s.showLyrics, showQueue: false })),
      toggleFullScreen: () => set((s) => ({ showFullScreen: !s.showFullScreen })),
      setIsLoading: (isLoading) => set({ isLoading }),

      addToQueue: (track) =>
        set((s) => ({
          queue: [...s.queue.filter((t) => t.id !== track.id), track],
        })),

      removeFromQueue: (trackId) =>
        set((s) => ({ queue: s.queue.filter((t) => t.id !== trackId) })),

      clearQueue: () => set({ queue: [] }),

      reorderQueue: (fromIndex, toIndex) =>
        set((s) => {
          const newQueue = [...s.queue];
          const [moved] = newQueue.splice(fromIndex, 1);
          newQueue.splice(toIndex, 0, moved);
          return { queue: newQueue };
        }),

      playNext: (track) =>
        set((s) => ({
          queue: [track, ...s.queue.filter((t) => t.id !== track.id)],
        })),
    }),
    {
      name: "vybeon-player",
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        shuffle: state.shuffle,
        repeat: state.repeat,
      }),
    }
  )
);
