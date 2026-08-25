import { createFileRoute } from "@tanstack/react-router";
import { QuestionView } from "@/components/quiz/QuestionView";
import { ResultsScreen } from "@/components/quiz/ResultsScreen";
import { StartScreen } from "@/components/quiz/StartScreen";
import { useQuiz } from "@/lib/quiz-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const phase = useQuiz((s) => s.phase);

  return (
    <main className="min-h-dvh bg-bg text-fg">
      {phase === "start" ? <StartScreen /> : null}
      {phase === "play" ? <QuestionView /> : null}
      {phase === "results" ? <ResultsScreen /> : null}
    </main>
  );
}
