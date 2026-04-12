import { describe, expect, test } from "bun:test"

import { describeServiceStatus } from "@workspace/example-lib"

describe("service", () => {
  test("formats a healthy service message", () => {
    expect(
      describeServiceStatus({
        appName: "service",
        environment: "test",
        healthy: true,
      })
    ).toContain("Service")
  })
})
