import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatDurationMs(ms: number): string {
  return formatDuration(ms / 1000);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateGradientFromString(str: string): string {
  const colors = [
    ["#B8FF00", "#00F5FF"],
    ["#7C3AED", "#00F5FF"],
    ["#B8FF00", "#7C3AED"],
    ["#FF6B6B", "#7C3AED"],
    ["#00F5FF", "#7C3AED"],
    ["#B8FF00", "#FF6B6B"],
    ["#FF6B6B", "#00F5FF"],
    ["#7C3AED", "#B8FF00"],
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  const [from, to] = colors[index];
  return `linear-gradient(135deg, ${from}, ${to})`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}

export function totalDurationInMinutes(tracks: { duration: number }[]): number {
  return Math.round(tracks.reduce((acc, t) => acc + t.duration, 0) / 60);
}

export function createApiError(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}

export function createApiSuccess<T>(data: T, status: number = 200) {
  return Response.json(data, { status });
}
