import { createFileRoute } from "@tanstack/react-router";
import { QuestionView } from "@/components/quiz/QuestionView";
import { ResultsScreen } from "@/components/quiz/ResultsScreen";
import { ShortQuestionView } from "@/components/quiz/ShortQuestionView";
import { StartScreen } from "@/components/quiz/StartScreen";
import { useQuiz } from "@/lib/quiz-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const phase = useQuiz((s) => s.phase);
  const mode = useQuiz((s) => s.mode);

  return (
    <main className="min-h-dvh bg-bg text-fg">
      {phase === "start" ? <StartScreen /> : null}
      {phase === "play" && mode === "mcq" ? <QuestionView /> : null}
      {phase === "play" && mode === "short" ? <ShortQuestionView /> : null}
      {phase === "results" ? <ResultsScreen /> : null}
    </main>
  );
}
