import { z } from "zod";
import type { Goal, GoalPriority, TaskBlock } from "./types";
import type { ToolProposal } from "./tools";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

const GEMINI_KEY = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "";
const XAI_KEY = process.env.XAI_API_KEY ?? "";

const intakeTaskSchema = z.object({
  title: z.string().min(1).max(200),
  durationMinutes: z.number().int().min(10).max(480).default(30),
  priority: z.number().int().min(1).max(3).default(2),
  deadline: z.string().optional(),
  project: z.string().optional(),
});

const intakeSchema = z.object({
  tasks: z.array(intakeTaskSchema).max(12),
});

export type IntakeTask = z.infer<typeof intakeTaskSchema> & { priority: GoalPriority };

export const hasAI = Boolean(GEMINI_KEY || XAI_KEY);

/* -------------------------- Gemini (default path) -------------------------- */

async function geminiJson(prompt: string, schema: unknown): Promise<unknown> {
  if (!GEMINI_KEY) return null;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(GEMINI_KEY)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.3,
        },
      }),
    },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* ------------------------------ XAI fallback ------------------------------- */

async function xaiJson(prompt: string): Promise<unknown> {
  if (!XAI_KEY) return null;
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${XAI_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [
        { role: "system", content: "You output strict JSON only." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = json.choices?.[0]?.message?.content;
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* --------------------------------- intake --------------------------------- */

const INTAKE_PROMPT = (text: string) =>
  `You are a structured task extractor for a day planner. Convert the user's natural-language request into tasks.

Rules:
- Each task has: title (concise, imperative, <= 200 chars), durationMinutes (10-480, estimate from wording; default 30), priority (1 highest, 2, 3 lowest; infer from urgency words), deadline (ISO date only if stated), project (optional).
- Split compound sentences into separate tasks (max 12).
- Prefer concrete verbs over vague nouns.
- Respond ONLY with the JSON object matching the schema.

User request: ${text}`;

export async function intakeTasks(text: string): Promise<IntakeTask[] | null> {
  if (!text.trim()) return null;
  if (!hasAI) return null;

  const schema = {
    type: "OBJECT",
    properties: {
      tasks: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            durationMinutes: { type: "INTEGER" },
            priority: { type: "INTEGER" },
            deadline: { type: "STRING" },
            project: { type: "STRING" },
          },
          required: ["title"],
        },
      },
    },
    required: ["tasks"],
  };

  const raw = GEMINI_KEY ? await geminiJson(INTAKE_PROMPT(text), schema) : await xaiJson(INTAKE_PROMPT(text));
  if (!raw) return null;
  const parsed = intakeSchema.safeParse(raw);
  if (!parsed.success) return null;
  return parsed.data.tasks.map((t) => ({
    title: t.title,
    durationMinutes: t.durationMinutes,
    priority: t.priority as GoalPriority,
    deadline: t.deadline,
    project: t.project,
  }));
}

/* --------------------------------- why-now -------------------------------- */

const WHY_PROMPT = (block: TaskBlock, planDate: string) =>
  `Give ONE short punchy sentence (max 18 words, no quotes, no emoji) explaining why this task belongs in the schedule right now. Context: today is ${planDate}; task starts at ${block.start}–${block.end}; priority ${block.priority}. Task: "${block.title}" (${block.minutes} min). Just the sentence.`;

export async function explainWhyNow(block: TaskBlock, planDate: string): Promise<string | null> {
  if (!hasAI) return null;
  const prompt = WHY_PROMPT(block, planDate);
  if (GEMINI_KEY) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(GEMINI_KEY)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4 },
        }),
      },
    );
    if (res.ok) {
      const json = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text && text.length <= 200) return text;
    }
  }
  if (XAI_KEY) {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${XAI_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60,
      }),
    });
    if (res.ok) {
      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = json.choices?.[0]?.message?.content?.trim();
      if (text && text.length <= 200) return text;
    }
  }
  return null;
}

/* ------------------------------- orchestrator ------------------------------ */

const toolCallSchema = z.object({
  tool: z.enum(["add_goal", "set_priority", "set_weekly_target", "schedule_now"]),
  args: z.record(z.string(), z.unknown()),
});

const oracleSchema = z.object({
  actions: z.array(toolCallSchema).max(8),
});

const ORCHESTRATE_PROMPT = (request: string, snapshot: string) =>
  `You are the planner's PRINCIPAL. Understand the user's request and choose tools to pass to the deterministic scheduling engine. You NEVER edit the schedule yourself — you only propose trusted tool calls the engine validates.

Today's snapshot (goals + today's plan):
${snapshot}

Available tools (ONLY these):
- add_goal      args: { title, durationMinutes?, priority?, deadline?, project? }
- set_priority  args: { goalId, priority }
- set_weekly_target args: { goalId, sessions, minutes }
- schedule_now  args: {}            (replane the day)

Rules:
- Convert natural-language adds into add_goal calls. Lead with a concise imperative single title per goal.
- Infer duration from wording (minutes or hours); default 30. priority = 1 highest, 3 lowest.
- Use ISO dates YYYY-MM-DD for deadlines only if the user states one.
- Prefer the fewest, most meaningful calls. If nothing is actionable, return actions: [].
- Respond ONLY with JSON: {"actions":[{ "tool": "...", "args": {...} }]}`;

/**
 * Gemini as PRINCIPAL: turns natural language into whitelisted tool-call
 * proposals. Returns null on any failure/timeout so the deterministic fast
 * path always wins and the UI never waits on the cloud round-trip.
 */
export async function orchestrate(
  request: string,
  snapshot: string,
): Promise<ToolProposal[] | null> {
  if (!hasAI || !request.trim()) return null;
  const prompt = ORCHESTRATE_PROMPT(request, snapshot);
  try {
    const raw = await geminiJson(prompt, {
      type: "OBJECT",
      properties: {
        actions: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              tool: { type: "STRING", enum: ["add_goal", "set_priority", "set_weekly_target", "schedule_now"] },
              args: { type: "OBJECT" },
            },
            required: ["tool", "args"],
          },
        },
      },
      required: ["actions"],
    });
    const parsed = oracleSchema.safeParse(raw);
    if (!parsed.success) return null;
    return parsed.data.actions.filter((a) => a.tool);
  } catch {
    return null;
  }
}

export function planSnapshot(goals: Goal[]): string {
  const lines = goals
    .filter((g) => g.active)
    .map((g) => `- ${g.title} (P${g.priority}, ${g.defaultDuration}min${g.deadline ? `, due ${g.deadline}` : ""})`);
  return lines.length ? lines.join("\n") : "(no active goals)";
}