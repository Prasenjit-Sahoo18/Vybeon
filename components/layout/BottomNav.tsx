"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, Compass, Radio, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/",          label: "Home",     icon: Home    },
  { href: "/search",   label: "Search",   icon: Search  },
  { href: "/discover", label: "Discover", icon: Compass  },
  { href: "/radio",    label: "Radio",    icon: Radio   },
  { href: "/library",  label: "Library",  icon: Library },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    /*
     * Positioned just above the MusicPlayer mini-bar (58px).
     * lg:hidden — desktop uses the Sidebar instead.
     */
    <nav
      aria-label="Mobile navigation"
      className="
        fixed bottom-[58px] left-0 right-0 z-40
        flex lg:hidden
        h-16
        items-center justify-around
        border-t border-white/[0.08]
        bg-[#090912]/90 backdrop-blur-xl
      "
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className="relative flex flex-col items-center gap-0.5 px-3 py-1"
            aria-current={isActive ? "page" : undefined}
          >
            {/* Sliding top indicator */}
            {isActive && (
              <motion.span
                layoutId="bottom-nav-indicator"
                className="absolute -top-px left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_rgba(184,255,0,0.8)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            <motion.div
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.6}
                className={cn(
                  "transition-colors duration-200",
                  isActive
                    ? "text-primary drop-shadow-[0_0_6px_rgba(184,255,0,0.7)]"
                    : "text-muted-foreground"
                )}
              />
            </motion.div>

            <span
              className={cn(
                "text-[10px] font-medium leading-none transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
