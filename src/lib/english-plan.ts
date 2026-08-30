import {
  ENGLISH_TOPICS,
  embeddableForTopic,
  type EnglishVideo,
} from "./english-data";

export type EnglishDay = {
  dateOffset: number;
  week: number;
  dayOfWeek: number;
  title: string;
  topic: string;
  videos: EnglishVideo[];
};

export const DAILY_GOAL = 4;

export const WEEK_SCHEDULE: { topic: string; label: string }[] = [
  { topic: "foundations", label: "Foundations & Mindset" },
  { topic: "grammar", label: "Grammar Foundations" },
  { topic: "grammar", label: "Tenses, Modals & Prepositions" },
  { topic: "vocabulary", label: "Daily Vocabulary" },
  { topic: "vocabulary", label: "Phrasal Verbs & Everyday Words" },
  { topic: "phrases-idioms", label: "Phrases, Idioms & Fillers" },
  { topic: "advanced-vocab", label: "Advanced Vocabulary" },
  { topic: "advanced-vocab", label: "Advanced Words & Natural Phrasing" },
  { topic: "pronunciation", label: "Pronunciation & Accent" },
  { topic: "conversation", label: "Conversation & Fluency" },
  { topic: "business", label: "Business & Interview English" },
  { topic: "exam", label: "Listening, Exam & Soft Skills" },
];

const CURRENT_START = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
})();

export const TOTAL_WEEKS = WEEK_SCHEDULE.length;

export function weekEntriesForWeek(week: number): EnglishVideo[] {
  const { topic } = WEEK_SCHEDULE[week] ?? WEEK_SCHEDULE[0];
  const list = embeddableForTopic(topic);
  const concept = list.filter((v) => !v.isPractice);
  const practice = list.filter((v) => v.isPractice);
  const ordered = [...concept, ...practice];
  const seen = new Set<string>();
  const out: EnglishVideo[] = [];
  for (const v of ordered) {
    const id = String(v.id);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(v);
  }
  return out;
}

export function chunkVideos(videos: EnglishVideo[], dayCount: number): EnglishVideo[][] {
  const chunks: EnglishVideo[][] = Array.from({ length: dayCount }, () => []);
  if (!videos.length) return chunks;
  const perDay = Math.max(1, Math.ceil(videos.length / dayCount));
  videos.forEach((v, i) => {
    const day = Math.min(Math.floor(i / perDay), dayCount - 1);
    chunks[day].push(v);
  });
  return chunks;
}

export function todayPlan(offset = 0): EnglishDay {
  const rawOffset = Math.max(0, offset);
  const week = Math.floor(rawOffset / 7) % TOTAL_WEEKS;
  const dayOfWeek = rawOffset % 7;
  const videos = chunkVideos(weekEntriesForWeek(week), 7)[dayOfWeek] ?? [];
  const schedule = WEEK_SCHEDULE[week];
  return {
    dateOffset: rawOffset,
    week,
    dayOfWeek,
    title: schedule.label,
    topic: schedule.topic,
    videos,
  };
}

export function todayOffset(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = now.getTime() - CURRENT_START.getTime();
  return Math.floor(diff / 86400000);
}

export function weekLabel(week: number): string {
  return WEEK_SCHEDULE[week]?.label ?? "Review";
}

export function weekTopic(week: number): string {
  return WEEK_SCHEDULE[week]?.topic ?? WEEK_SCHEDULE[0].topic;
}

export function nextTopicAfter(topic: string): string {
  const i = ENGLISH_TOPICS.indexOf(topic);
  return ENGLISH_TOPICS[Math.min(i + 1, ENGLISH_TOPICS.length - 1)];
}
