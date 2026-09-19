import { describe, it, expect } from "vitest";
import { formatDuration, formatNumber, slugify, timeAgo } from "@/lib/utils";

describe("Utility functions", () => {
  it("formats duration correctly in minutes and seconds", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(243)).toBe("4:03");
  });

  it("formats large numbers with metric suffixes", () => {
    expect(formatNumber(500)).toBe("500");
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(2400000)).toBe("2.4M");
  });

  it("creates URL-safe slugs", () => {
    expect(slugify("Neon Pulse - 2024!")).toBe("neon-pulse-2024");
    expect(slugify("Violet Sky (Remix)")).toBe("violet-sky-remix");
  });

  it("formats relative time ago", () => {
    const justNow = new Date();
    expect(timeAgo(justNow)).toBe("just now");
  });
});
