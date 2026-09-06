import {
  INSTAGRAM_LEVELS,
  INSTAGRAM_PREP_PLAN,
  type InstagramLevel,
} from "@/data/instagram-study-path";
import { curriculumFromLevels, type PrepPlan } from "./curriculum";

export const INSTAGRAM_CURRICULUM = curriculumFromLevels(INSTAGRAM_LEVELS as InstagramLevel[]);

export const INSTAGRAM_PREP: PrepPlan = INSTAGRAM_PREP_PLAN;

export function instagramCompletionKey(id: number): string {
  return `ig:${id}`;
}