import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const MAX_LIST_LIMIT = 50;
const DEFAULT_LIST_LIMIT = 10;
const MAX_SUMMARY_LENGTH = 280;

export function buildSampleScrapeRun() {
  return {
    instruction: "Extract titles, prices, and links from the first few cards.",
    mode: "css",
    resultJson: JSON.stringify(
      {
        items: [
          {
            price: "$199",
            title: "Refurbished workstation",
            url: "https://example.com/listing/workstation",
          },
          {
            price: "$49",
            title: "Mechanical keyboard",
            url: "https://example.com/listing/keyboard",
          },
        ],
      },
      null,
      2
    ),
    summary:
      "2 sample scraped items: Refurbished workstation and Mechanical keyboard.",
    url: "https://example.com/listings",
  };
}

export function summarizeScrapeResult(resultJson: string) {
  const normalized = resultJson.replace(/\s+/g, " ").trim();
  if (normalized.length <= MAX_SUMMARY_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, MAX_SUMMARY_LENGTH - 1).trimEnd()}…`;
}

export const listRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(
      1,
      Math.min(args.limit ?? DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT)
    );

    return await ctx.db
      .query("scrapeRuns")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});

export const record = mutation({
  args: {
    instruction: v.optional(v.string()),
    mode: v.string(),
    resultJson: v.string(),
    summary: v.optional(v.string()),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("scrapeRuns", {
      createdAt: Date.now(),
      instruction: args.instruction,
      mode: args.mode,
      resultJson: args.resultJson,
      summary: args.summary ?? summarizeScrapeResult(args.resultJson),
      url: args.url,
    });

    return await ctx.db.get("scrapeRuns", id);
  },
});

export const seedSample = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("scrapeRuns").take(1);
    if (existing.length > 0) {
      return existing[0];
    }

    const sample = buildSampleScrapeRun();
    const id = await ctx.db.insert("scrapeRuns", {
      createdAt: Date.now(),
      instruction: sample.instruction,
      mode: sample.mode,
      resultJson: sample.resultJson,
      summary: sample.summary,
      url: sample.url,
    });

    return await ctx.db.get("scrapeRuns", id);
  },
});
