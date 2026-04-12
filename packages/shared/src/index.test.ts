import { describe, expect, test } from "bun:test"

import { describeServiceStatus, getWelcomeMessage, toTitleCase } from "./index.js"

describe("shared", () => {
  test("converts strings to title case", () => {
    expect(toTitleCase("nextjs web")).toBe("Nextjs Web")
  })

  test("builds a welcome message", () => {
    expect(getWelcomeMessage("web")).toContain("Web")
  })

  test("describes worker status", () => {
    expect(
      describeServiceStatus({
        appName: "worker",
        environment: "test",
        healthy: false,
      })
    ).toContain("degraded")
  })
})
