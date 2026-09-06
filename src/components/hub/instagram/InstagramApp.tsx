import { useInterview } from "@/lib/interview-store";
import {
  INSTAGRAM_CURRICULUM,
  INSTAGRAM_PREP,
  instagramCompletionKey,
} from "@/lib/instagram-plan";
import type { TrackApi } from "../curriculum/types";
import { CurrHome } from "../curriculum/CurrHome";
import { CurrCalendar } from "../curriculum/CurrCalendar";
import { CurrToday } from "../curriculum/CurrToday";
import { CurrQuestions } from "../curriculum/CurrQuestions";

const config = {
  bagId: "instagram" as const,
  title: "Instagram Marketing",
  subtitle: "50 questions · 5 levels · 30-day plan",
  backLabel: "Instagram Marketing",
  completionKey: instagramCompletionKey,
  curriculum: INSTAGRAM_CURRICULUM,
  prepPlan: INSTAGRAM_PREP,
};

export function InstagramApp() {
  const screen = useInterview((s) => s.instagramScreen);
  const setScreen = useInterview((s) => s.setInstagramScreen);
  const selectedDay = useInterview((s) => s.selectedDay);
  const setSelectedDay = useInterview((s) => s.setSelectedDay);
  const back = useInterview((s) => s.back);

  const api: TrackApi = { screen, setScreen, selectedDay, setSelectedDay, back };

  if (screen === "calendar") return <CurrCalendar config={config} api={api} />;
  if (screen === "today") return <CurrToday config={config} api={api} />;
  if (screen === "questions") return <CurrQuestions config={config} api={api} />;
  return <CurrHome config={config} api={api} />;
}