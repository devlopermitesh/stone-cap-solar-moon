import { z } from "zod";
import type { GoalPriority, TaskBlock } from "./types";

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