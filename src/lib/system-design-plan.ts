import {
  SYSTEM_DESIGN_LEVELS,
  SYSTEM_DESIGN_PREP_PLAN,
  type SystemDesignLevel,
} from "@/data/system-design-study-path";
import { curriculumFromLevels, type PrepPlan } from "./curriculum";

export const SYSTEM_DESIGN_CURRICULUM = curriculumFromLevels(
  SYSTEM_DESIGN_LEVELS as SystemDesignLevel[],
);

export const SYSTEM_DESIGN_PREP: PrepPlan = SYSTEM_DESIGN_PREP_PLAN;

export function systemDesignCompletionKey(id: number): string {
  return `sd:${id}`;
}