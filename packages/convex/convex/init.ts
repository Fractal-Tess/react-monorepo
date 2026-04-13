import { mutation } from "./_generated/server";
import { buildSeedMessage } from "./messages";
import { buildSampleScrapeRun } from "./scrapes";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    let messagesInserted = 0;
    let scrapeRunsInserted = 0;

    const existingMessage = await ctx.db.query("messages").take(1);
    if (existingMessage.length === 0) {
      await ctx.db.insert("messages", {
        body: buildSeedMessage("web app"),
        source: "seed",
      });
      messagesInserted = 1;
    }

    const existingScrape = await ctx.db.query("scrapeRuns").take(1);
    if (existingScrape.length === 0) {
      const sample = buildSampleScrapeRun();
      await ctx.db.insert("scrapeRuns", {
        createdAt: Date.now(),
        instruction: sample.instruction,
        mode: sample.mode,
        resultJson: sample.resultJson,
        summary: sample.summary,
        url: sample.url,
      });
      scrapeRunsInserted = 1;
    }

    return {
      messagesInserted,
      scrapeRunsInserted,
      seeded: messagesInserted + scrapeRunsInserted > 0,
    };
  },
});
