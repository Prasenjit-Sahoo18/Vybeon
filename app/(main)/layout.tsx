import { Sidebar } from "@/components/layout/Sidebar";
import { MusicPlayer } from "@/components/player/MusicPlayer";
import { BottomNav } from "@/components/layout/BottomNav";
import { FullScreenPlayer } from "@/components/player/FullScreenPlayer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar — fixed, 240px wide, hidden on mobile */}
      <Sidebar />

      {/* Main scrollable content area
          Desktop: offset left by sidebar (ml-60 = 240px)
          Mobile:  no left offset, extra bottom padding for BottomNav + MusicPlayer mini-bar
          Desktop: bottom padding only for MusicPlayer bar (pb-[90px]) */}
      <main
        className="
          flex-1 overflow-y-auto
          ml-0 lg:ml-60
          pb-[148px] lg:pb-[90px]
          min-h-screen
          bg-gradient-aurora
        "
      >
        {children}
      </main>

      {/* Mobile bottom navigation (hidden on lg+) */}
      <BottomNav />

      {/* Persistent bottom music player (visible on both mobile & desktop) */}
      <MusicPlayer />

      {/* Full-screen player overlay — conditionally rendered via store */}
      <FullScreenPlayer />
    </div>
  );
}
