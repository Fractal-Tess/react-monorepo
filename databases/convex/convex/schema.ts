import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    messages: defineTable({
      body: v.string(),
      source: v.string(),
    }),
    scrapeRuns: defineTable({
      createdAt: v.number(),
      instruction: v.optional(v.string()),
      mode: v.string(),
      resultJson: v.string(),
      summary: v.string(),
      url: v.string(),
    }).index("by_createdAt", ["createdAt"]),
  },
  { schemaValidation: true }
);
