import { create } from "zustand";
import { QUESTIONS, type Question } from "@/data/questions";

export type AnswerRecord = {
  questionId: number;
  chosen: number;
  correct: boolean;
};

type QuizState = {
  phase: "start" | "play" | "results";
  topicFilter: string | "all";
  queue: Question[];
  index: number;
  chosen: number | null;
  revealed: boolean;
  records: AnswerRecord[];
  start: (topic: string | "all") => void;
  pick: (optionIndex: number) => void;
  next: () => void;
  restart: () => void;
};

function buildQueue(topic: string | "all"): Question[] {
  if (topic === "all") return QUESTIONS;
  return QUESTIONS.filter((q) => q.topic === topic);
}

export const TOPICS = [
  "all",
  ...Array.from(new Set(QUESTIONS.map((q) => q.topic))),
] as const;

export const useQuiz = create<QuizState>((set, get) => ({
  phase: "start",
  topicFilter: "all",
  queue: QUESTIONS,
  index: 0,
  chosen: null,
  revealed: false,
  records: [],
  start: (topic) => {
    const queue = buildQueue(topic);
    set({
      phase: "play",
      topicFilter: topic,
      queue,
      index: 0,
      chosen: null,
      revealed: false,
      records: [],
    });
  },
  pick: (optionIndex) => {
    const { revealed, queue, index, records } = get();
    if (revealed) return;
    const q = queue[index];
    if (!q) return;
    const correct = optionIndex === q.answer;
    set({
      chosen: optionIndex,
      revealed: true,
      records: [
        ...records,
        { questionId: q.id, chosen: optionIndex, correct },
      ],
    });
  },
  next: () => {
    const { index, queue } = get();
    if (index + 1 >= queue.length) {
      set({ phase: "results" });
      return;
    }
    set({ index: index + 1, chosen: null, revealed: false });
  },
  restart: () =>
    set({
      phase: "start",
      index: 0,
      chosen: null,
      revealed: false,
      records: [],
    }),
}));
