import type { Curriculum, PrepPlan } from "@/lib/curriculum";

export type TrackScreen = "home" | "calendar" | "today" | "questions" | null;

export type TrackBagId = "instagram" | "system-design";

export type TrackConfig = {
  bagId: TrackBagId;
  title: string;
  subtitle: string;
  backLabel: string;
  completionKey: (id: number) => string;
  curriculum: Curriculum;
  prepPlan: PrepPlan;
};

export type TrackApi = {
  screen: TrackScreen;
  setScreen: (s: TrackScreen) => void;
  selectedDay: number | null;
  setSelectedDay: (d: number | null) => void;
  back: () => void;
};