import instagramPlanJson from "@/data/instagram-plan.json";

export type InstagramVideo = {
  title: string;
  duration?: number;
  view_count?: number;
  id: string;
  url: string;
  thumbnails?: { url: string; height: number; width: number }[];
  channel?: string;
};

export type InstagramSection = {
  id: number;
  heading: string;
  category: string;
  videos: InstagramVideo[];
};

export const INSTAGRAM_PLAN: InstagramSection[] = instagramPlanJson as InstagramSection[];

export function formatVideoDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}` : `${m}:${String(seconds % 60).padStart(2, "0")}`;
}

export function totalVideoMinutes(plan: InstagramSection[]): number {
  let total = 0;
  for (const s of plan) for (const v of s.videos) total += v.duration ?? 0;
  return Math.round(total / 60);
}
