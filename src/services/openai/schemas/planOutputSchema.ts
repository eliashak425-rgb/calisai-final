// JSON Schema for OpenAI Structured Outputs
export const PLAN_JSON_SCHEMA = {
  type: "object",
  properties: {
    weeklyStructure: {
      type: "array",
      items: {
        type: "object",
        properties: {
          dayNumber: { type: "integer", minimum: 1, maximum: 7 },
          dayType: {
            type: "string",
            enum: ["push", "pull", "legs", "full", "skill", "rest", "active_recovery"],
          },
          totalDurationMin: { type: "integer", minimum: 10, maximum: 120 },
          blocks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                blockType: {
                  type: "string",
                  enum: ["warmup", "skill", "strength", "conditioning", "cooldown"],
                },
                durationMin: { type: "integer", minimum: 1, maximum: 60 },
                exercises: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      exerciseId: { type: "string" },
                      name: { type: "string" },
                      sets: { type: "integer", minimum: 1, maximum: 10 },
                      reps: { type: "string" },
                      restSec: { type: "integer", minimum: 0, maximum: 300 },
                      tempo: { type: ["string", "null"] },
                      intensity: {
                        type: "object",
                        properties: {
                          type: { type: "string", enum: ["rpe", "rir", "percentage"] },
                          value: { type: "number" },
                        },
                        required: ["type", "value"],
                        additionalProperties: false,
                      },
                      notes: { type: ["string", "null"] },
                      progression: {
                        type: "object",
                        properties: {
                          rule: { type: "string" },
                          nextExercise: { type: ["string", "null"] },
                        },
                        required: ["rule"],
                        additionalProperties: false,
                      },
                      regression: {
                        type: "object",
                        properties: {
                          exerciseId: { type: "string" },
                          reason: { type: "string" },
                        },
                        required: ["exerciseId", "reason"],
                        additionalProperties: false,
                      },
                      tags: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                    required: [
                      "exerciseId",
                      "name",
                      "sets",
                      "reps",
                      "restSec",
                      "intensity",
                      "progression",
                      "regression",
                      "tags",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["blockType", "durationMin", "exercises"],
              additionalProperties: false,
            },
          },
        },
        required: ["dayNumber", "dayType", "totalDurationMin", "blocks"],
        additionalProperties: false,
      },
    },
    metadata: {
      type: "object",
      properties: {
        totalWeeklyVolume: { type: "integer" },
        pushPullRatio: { type: "number" },
        skillFocus: { type: "array", items: { type: "string" } },
        avoidedMovements: { type: "array", items: { type: "string" } },
      },
      required: ["totalWeeklyVolume", "pushPullRatio", "skillFocus", "avoidedMovements"],
      additionalProperties: false,
    },
  },
  required: ["weeklyStructure", "metadata"],
  additionalProperties: false,
} as const;

export type PlanSchema = typeof PLAN_JSON_SCHEMA;

