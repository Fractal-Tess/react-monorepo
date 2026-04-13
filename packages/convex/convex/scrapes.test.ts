import { describe, expect, test } from "bun:test";

import { buildSampleScrapeRun, summarizeScrapeResult } from "./scrapes";

describe("convex scrapes helpers", () => {
  test("normalizes whitespace in scrape summaries", () => {
    expect(summarizeScrapeResult('{"items": [ 1,  2, 3 ]}')).toBe(
      '{"items": [ 1, 2, 3 ]}'
    );
  });

  test("truncates long scrape summaries", () => {
    const summary = summarizeScrapeResult("x".repeat(400));

    expect(summary.length).toBeLessThanOrEqual(280);
    expect(summary.endsWith("…")).toBe(true);
  });

  test("builds a sample scrape run for UI seeding", () => {
    const sample = buildSampleScrapeRun();

    expect(sample.mode).toBe("css");
    expect(sample.summary).toContain("sample scraped items");
    expect(sample.resultJson).toContain("Mechanical keyboard");
  });
});
