/* ------------------------------------------------------------------ */
/*  Shared curriculum planner: builds 5-week, day-by-day question      */
/*  plans from a level bank (exactly the shape DSA's roadmap uses).    */
/* ------------------------------------------------------------------ */

export type BankQuestion = {
  id: number;
  question: string;
  difficulty: string;
  topicPattern: string;
  whatInterviewerTests: string;
  exampleInput: string;
  expectedOutput: string;
  constraints: string;
  hint: string;
};

export type BankLevel = {
  level: number;
  title: string;
  difficulty: string;
  questions: BankQuestion[];
};

export type PrepPlan = {
  title: string;
  goal: string;
  dailyRoutine: string[];
  weeks: { week: number; title: string; days: string[] }[];
  ongoingRules: string[];
};

export type CurriculumDay = {
  dateOffset: number;
  week: number;
  dayOfWeek: number;
  title: string;
  questions: BankQuestion[];
};

const CURRENT_START = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
})();

/** Days since the Sunday of the current week (mirrors dsa-plan). */
export function todayOffset(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = now.getTime() - CURRENT_START.getTime();
  return Math.floor(diff / 86400000);
}

export function curriculumFromLevels(levels: BankLevel[]) {
  const TOTAL_WEEKS = Math.max(1, levels.length);

  function questionsForWeek(week: number): BankQuestion[] {
    return levels[week]?.questions ?? [];
  }

  function chunkQuestions(questions: BankQuestion[], dayCount: number): BankQuestion[][] {
    const chunks: BankQuestion[][] = Array.from({ length: dayCount }, () => []);
    if (!questions.length) return chunks;
    const perDay = Math.max(1, Math.ceil(questions.length / dayCount));
    questions.forEach((q, i) => {
      const day = Math.min(Math.floor(i / perDay), dayCount - 1);
      chunks[day].push(q);
    });
    return chunks;
  }

  function todayPlan(offset = 0): CurriculumDay {
    const rawOffset = Math.max(0, offset);
    const week = Math.floor(rawOffset / 7) % TOTAL_WEEKS;
    const dayOfWeek = rawOffset % 7;
    const questions = chunkQuestions(questionsForWeek(week), 7)[dayOfWeek] ?? [];
    return {
      dateOffset: rawOffset,
      week,
      dayOfWeek,
      title: weekLabel(week),
      questions,
    };
  }

  function weekLabel(week: number): string {
    return levels[week]?.title ?? "Review";
  }

  function weekDifficulty(week: number): string {
    return levels[week]?.difficulty ?? "";
  }

  return {
    levels,
    TOTAL_WEEKS,
    questionsForWeek,
    chunkQuestions,
    todayPlan,
    weekLabel,
    weekDifficulty,
    allQuestions: levels.flatMap((l) => l.questions),
  };
}

export type Curriculum = ReturnType<typeof curriculumFromLevels>;