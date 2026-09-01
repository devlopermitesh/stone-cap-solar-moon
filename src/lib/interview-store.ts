import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BagId = "fullstack" | "smm" | "dsa" | "english" | "planner" | null;
export type DsaScreen =
  | "home"
  | "calendar"
  | "today"
  | "problems"
  | "playlist"
  | "video"
  | null;
export type EnglishScreen =
  | "home"
  | "calendar"
  | "today"
  | "playlist"
  | "video"
  | null;
export type PlannerScreen = "home" | "day" | "calendar" | "goals" | "feedback";

type HubState = {
  activeBag: BagId;
  dsaScreen: DsaScreen;
  englishScreen: EnglishScreen;
  plannerScreen: PlannerScreen;
  selectedDay: number | null;
  selectedTopic: string | undefined;
  open: (bag: Exclude<BagId, null>) => void;
  back: () => void;
  setDsaScreen: (screen: DsaScreen) => void;
  setEnglishScreen: (screen: EnglishScreen) => void;
  setPlannerScreen: (screen: PlannerScreen) => void;
  setSelectedDay: (day: number | null) => void;
  setSelectedTopic: (topic: string | undefined) => void;
  reset: () => void;
};

export const useInterview = create<HubState>((set, get) => ({
  activeBag: null,
  dsaScreen: null,
  englishScreen: null,
  plannerScreen: "home",
  selectedDay: null,
  selectedTopic: undefined,
  open: (bag) => {
    if (bag === "dsa") {
      set({ activeBag: bag, dsaScreen: "home", englishScreen: null, selectedDay: null, selectedTopic: undefined });
    } else if (bag === "english") {
      set({ activeBag: bag, englishScreen: "home", dsaScreen: null, selectedDay: null, selectedTopic: undefined });
    } else if (bag === "planner") {
      set({ activeBag: bag, plannerScreen: "home", dsaScreen: null, englishScreen: null, selectedDay: null, selectedTopic: undefined });
    } else {
      set({ activeBag: bag, dsaScreen: null, englishScreen: null });
    }
  },
  back: () => {
    const { dsaScreen, englishScreen, plannerScreen, activeBag } = get();
    if (activeBag === "dsa") {
      if (dsaScreen === "video") set({ dsaScreen: "playlist" });
      else if (dsaScreen === "today" && get().selectedTopic) {
        set({ selectedTopic: undefined, dsaScreen: "today" });
      } else if (dsaScreen === "today") set({ dsaScreen: "calendar" });
      else if (dsaScreen === "playlist") set({ dsaScreen: "today" });
      else if (dsaScreen === "problems") set({ dsaScreen: "today" });
      else set({ activeBag: null, dsaScreen: null, selectedTopic: undefined });
    } else if (activeBag === "english") {
      if (englishScreen === "video") set({ englishScreen: "playlist" });
      else if (englishScreen === "today") set({ englishScreen: "calendar" });
      else if (englishScreen === "playlist") set({ englishScreen: "today" });
      else set({ activeBag: null, englishScreen: null, selectedTopic: undefined });
    } else if (activeBag === "planner") {
      if (plannerScreen !== "home") set({ plannerScreen: "home" });
      else set({ activeBag: null, plannerScreen: "home", selectedDay: null, selectedTopic: undefined });
    } else {
      set({ activeBag: null, dsaScreen: null, englishScreen: null });
    }
  },
  setDsaScreen: (screen) => set({ dsaScreen: screen }),
  setEnglishScreen: (screen) => set({ englishScreen: screen }),
  setPlannerScreen: (screen) => set({ plannerScreen: screen }),
  setSelectedDay: (day) => set({ selectedDay: day }),
  setSelectedTopic: (topic) => set({ selectedTopic: topic }),
  reset: () => set({ activeBag: null, dsaScreen: null, englishScreen: null, selectedDay: null, selectedTopic: undefined }),
}));

export type Reminder = {
  enabled: boolean;
  time: string;
};

type TrackingState = {
  completedProblems: Record<string, string>;
  seenVideos: Record<string, string>;
  completedVideos: Record<string, string>;
  reminder: Reminder;
  tossProblem: (id: number) => void;
  toggleVideoSeen: (id: string, url: string) => void;
  toggleVideoComplete: (id: string, url: string) => void;
  setReminder: (reminder: Reminder) => void;
};

export const useTracking = create<TrackingState>()(
  persist(
    (set) => ({
      completedProblems: {},
      seenVideos: {},
      completedVideos: {},
      reminder: { enabled: false, time: "18:00" },
      tossProblem: (id) =>
        set((s) => {
          const key = String(id);
          const next = { ...s.completedProblems };
          if (next[key]) delete next[key];
          else next[key] = new Date().toISOString();
          return { completedProblems: next };
        }),
      toggleVideoSeen: (id, url) =>
        set((s) => {
          const seen = { ...s.seenVideos };
          if (seen[id]) delete seen[id];
          else seen[id] = url;
          return { seenVideos: seen };
        }),
      toggleVideoComplete: (id, url) =>
        set((s) => {
          const done = { ...s.completedVideos };
          if (done[id]) delete done[id];
          else {
            done[id] = url;
            if (!s.seenVideos[id]) s.seenVideos[id] = url;
          }
          return { completedVideos: done, seenVideos: { ...s.seenVideos } };
        }),
      setReminder: (reminder) => set({ reminder }),
    }),
    { name: "nettect-interview-tracking" },
  ),
);
