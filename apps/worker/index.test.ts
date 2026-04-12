import { describe, expect, test } from "bun:test"

import { describeServiceStatus } from "@workspace/shared"
import { buildHealthPayload, getServicePort } from "./index"

describe("worker", () => {
  test("formats a healthy worker message", () => {
    expect(
      describeServiceStatus({
        appName: "worker",
        environment: "test",
        healthy: true,
      })
    ).toContain("Worker")
  })

  test("uses the default worker port when no env is set", () => {
    expect(getServicePort(undefined)).toBe(4000)
  })

  test("marks the worker healthy when postgres is not configured", () => {
    expect(
      buildHealthPayload({
        environment: "test",
        databaseConfigured: false,
        databaseConnected: false,
        seededCustomers: 0,
      })
    ).toEqual({
      appName: "worker",
      environment: "test",
      healthy: true,
      database: {
        configured: false,
        connected: false,
        seededCustomers: 0,
      },
    })
  })
})
