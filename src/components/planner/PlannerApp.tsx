import { useEffect } from "react";
import { useInterview } from "@/lib/interview-store";
import { usePlanner } from "@/lib/planner/state";
import { PlannerHome } from "./PlannerHome";
import { PlannerDay } from "./PlannerDay";
import { PlannerCalendar } from "./PlannerCalendar";
import { PlannerGoals } from "./PlannerGoals";
import { PlannerFeedback } from "./PlannerFeedback";

export function PlannerApp() {
  const plannerScreen = useInterview((s) => s.plannerScreen);
  const init = usePlanner((s) => s.init);
  const ready = usePlanner((s) => s.ready);

  useEffect(() => {
    if (!ready) void init();
  }, [ready, init]);

  switch (plannerScreen) {
    case "day":
      return <PlannerDay />;
    case "calendar":
      return <PlannerCalendar />;
    case "goals":
      return <PlannerGoals />;
    case "feedback":
      return <PlannerFeedback />;
    case "home":
    default:
      return <PlannerHome />;
  }
}