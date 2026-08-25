import { create } from "zustand";
import { SHORT_QUESTIONS, type ShortQuestion } from "@/data/short-questions";
import { QUESTIONS, type Question } from "@/data/questions";

export type AnswerRecord = {
  questionId: number;
  chosen: number;
  correct: boolean;
};

export type QuizMode = "mcq" | "short" | null;

type QuizState = {
  phase: "start" | "play" | "results";
  mode: QuizMode;
  topicFilter: string | "all";
  queue: (Question | ShortQuestion)[];
  index: number;
  chosen: number | null;
  revealed: boolean;
  records: AnswerRecord[];
  start: (topic: string | "all") => void;
  startShort: (topic: string | "all") => void;
  pick: (optionIndex: number) => void;
  revealAnswer: () => void;
  next: () => void;
  restart: () => void;
};

function buildMcqQueue(topic: string | "all"): Question[] {
  if (topic === "all") return QUESTIONS;
  return QUESTIONS.filter((q) => q.topic === topic);
}

function buildShortQueue(topic: string | "all"): ShortQuestion[] {
  if (topic === "all") return SHORT_QUESTIONS;
  return SHORT_QUESTIONS.filter((q) => q.topic === topic);
}

export const TOPICS = ["all", ...Array.from(new Set(QUESTIONS.map((q) => q.topic)))] as const;

export const SHORT_TOPICS = [
  "all",
  ...Array.from(new Set(SHORT_QUESTIONS.map((q) => q.topic))),
] as const;

export const useQuiz = create<QuizState>((set, get) => ({
  phase: "start",
  mode: null,
  topicFilter: "all",
  queue: QUESTIONS,
  index: 0,
  chosen: null,
  revealed: false,
  records: [],
  start: (topic) => {
    const queue = buildMcqQueue(topic);
    set({
      phase: "play",
      mode: "mcq",
      topicFilter: topic,
      queue,
      index: 0,
      chosen: null,
      revealed: false,
      records: [],
    });
  },
  startShort: (topic) => {
    const queue = buildShortQueue(topic);
    set({
      phase: "play",
      mode: "short",
      topicFilter: topic,
      queue,
      index: 0,
      chosen: null,
      revealed: false,
      records: [],
    });
  },
  pick: (optionIndex) => {
    const { revealed, queue, index, records, mode } = get();
    if (revealed || mode !== "mcq") return;
    const q = queue[index] as Question;
    if (!q) return;
    const correct = optionIndex === q.answer;
    set({
      chosen: optionIndex,
      revealed: true,
      records: [...records, { questionId: q.id, chosen: optionIndex, correct }],
    });
  },
  revealAnswer: () => {
    const { revealed, mode } = get();
    if (revealed || mode !== "short") return;
    set({ revealed: true });
  },
  next: () => {
    const { index, queue, mode } = get();
    if (index + 1 >= queue.length) {
      if (mode === "short") {
        set({ phase: "start", mode: null, index: 0, chosen: null, revealed: false });
      } else {
        set({ phase: "results" });
      }
      return;
    }
    set({ index: index + 1, chosen: null, revealed: false });
  },
  restart: () =>
    set({
      phase: "start",
      mode: null,
      index: 0,
      chosen: null,
      revealed: false,
      records: [],
    }),
}));
