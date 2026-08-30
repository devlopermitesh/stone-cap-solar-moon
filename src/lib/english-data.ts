import englishPlanJson from "@/data/english-plan.json";

export type EnglishVideo = {
  title: string;
  duration?: number;
  view_count?: number;
  id: string;
  url: string;
  thumbnails?: { url: string; height: number; width: number }[];
  topic?: string;
  order?: number;
  isPractice?: boolean;
  stage?: number;
  sourceHeading?: string;
};

export type EnglishPlan = {
  title: string;
  description: string;
  topicOrder: string[];
  entries: EnglishVideo[];
};

export const ENGLISH_PLAN = englishPlanJson as EnglishPlan;

export const ENGLISH_TOPICS = ENGLISH_PLAN.topicOrder;

export const TOPIC_LABELS: Record<string, string> = {
  foundations: "Foundations",
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  "phrases-idioms": "Phrases & Idioms",
  "advanced-vocab": "Advanced Words",
  pronunciation: "Pronunciation",
  conversation: "Conversation",
  business: "Business English",
  interview: "Interview English",
  listening: "Listening",
  exam: "Exam Practice",
  "soft-skills": "Soft Skills",
  other: "More English",
};

export type EnglishTopicSummary = {
  total: number;
  embeddable: number;
  embeddableDone: number;
};

export function isPlaylistEntry(v: EnglishVideo): boolean {
  const url = v.url || "";
  if (url.indexOf("playlist?list=") !== -1) return true;
  return String(v.id || "").startsWith("PL");
}

export function embedId(v: EnglishVideo): string | null {
  const url = v.url || "";
  const m = url.match(/[?&]v=([\w-]{11})/);
  if (m) return m[1];
  return null;
}

export function playlistId(v: EnglishVideo): string | null {
  const url = v.url || "";
  const m = url.match(/[?&]list=([\w-]+)/);
  if (m) return m[1];
  return null;
}

export function embeddableForTopic(topic: string): EnglishVideo[] {
  return ENGLISH_PLAN.entries.filter(
    (v) => v.topic === topic && !isPlaylistEntry(v) && embedId(v),
  );
}

export function playlistsForTopic(topic: string): EnglishVideo[] {
  return ENGLISH_PLAN.entries.filter((v) => v.topic === topic && isPlaylistEntry(v));
}

export function topicSummary(topic: string): EnglishTopicSummary {
  const emb = embeddableForTopic(topic);
  return {
    total: ENGLISH_PLAN.entries.filter((v) => v.topic === topic).length,
    embeddable: emb.length,
    embeddableDone: 0,
  };
}

export function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "—";
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}` : `${m}:${String(s % 60).padStart(2, "0")}`;
}
