import { describe, expect, test } from "bun:test";

import { summarizeScrapeResult } from "./scrapes";

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
});
