import { useInterview } from "@/lib/interview-store";
import {
  SYSTEM_DESIGN_CURRICULUM,
  SYSTEM_DESIGN_PREP,
  systemDesignCompletionKey,
} from "@/lib/system-design-plan";
import type { TrackApi } from "../curriculum/types";
import { CurrHome } from "../curriculum/CurrHome";
import { CurrCalendar } from "../curriculum/CurrCalendar";
import { CurrToday } from "../curriculum/CurrToday";
import { CurrQuestions } from "../curriculum/CurrQuestions";

const config = {
  bagId: "system-design" as const,
  title: "System Design",
  subtitle: "50 questions · 5 levels · 30-day plan",
  backLabel: "System Design",
  completionKey: systemDesignCompletionKey,
  curriculum: SYSTEM_DESIGN_CURRICULUM,
  prepPlan: SYSTEM_DESIGN_PREP,
};

export function SystemDesignApp() {
  const screen = useInterview((s) => s.systemDesignScreen);
  const setScreen = useInterview((s) => s.setSystemDesignScreen);
  const selectedDay = useInterview((s) => s.selectedDay);
  const setSelectedDay = useInterview((s) => s.setSelectedDay);
  const back = useInterview((s) => s.back);

  const api: TrackApi = { screen, setScreen, selectedDay, setSelectedDay, back };

  if (screen === "calendar") return <CurrCalendar config={config} api={api} />;
  if (screen === "today") return <CurrToday config={config} api={api} />;
  if (screen === "questions") return <CurrQuestions config={config} api={api} />;
  return <CurrHome config={config} api={api} />;
}