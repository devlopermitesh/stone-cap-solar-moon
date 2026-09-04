import { useInterview } from "@/lib/interview-store";
import { useQuiz } from "@/lib/quiz-store";
import { CareersHub } from "./CareersHub";
import { SmmScreen } from "./smm/SmmScreen";
import { DsaApp } from "./dsa/DsaApp";
import { EnglishApp } from "./english/EnglishApp";
import { PlannerApp } from "@/components/planner/PlannerApp";
import { InstagramScreen } from "./instagram/InstagramScreen";
import { QuestionView } from "@/components/quiz/QuestionView";
import { ResultsScreen } from "@/components/quiz/ResultsScreen";
import { ShortQuestionView } from "@/components/quiz/ShortQuestionView";
import { StartScreen } from "@/components/quiz/StartScreen";

export function InterviewApp() {
  const activeBag = useInterview((s) => s.activeBag);
  const phase = useQuiz((s) => s.phase);
  const mode = useQuiz((s) => s.mode);

  if (activeBag === "smm") return <SmmScreen />;
  if (activeBag === "dsa") return <DsaApp />;
  if (activeBag === "english") return <EnglishApp />;
  if (activeBag === "planner") return <PlannerApp />;
  if (activeBag === "instagram") return <InstagramScreen />;

  return (
    <main className="min-h-dvh bg-bg text-fg">
      {activeBag === "fullstack" ? (
        <>
          {phase === "start" ? <StartScreen /> : null}
          {phase === "play" && mode === "mcq" ? <QuestionView /> : null}
          {phase === "play" && mode === "short" ? <ShortQuestionView /> : null}
          {phase === "results" ? <ResultsScreen /> : null}
        </>
      ) : (
        <CareersHub />
      )}
    </main>
  );
}
