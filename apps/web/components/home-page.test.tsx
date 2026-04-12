import "@testing-library/jest-dom/vitest"

import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

vi.mock("./convex-demo", () => ({
  ConvexDemo: ({ enabled }: { enabled: boolean }) => (
    <div data-testid="convex-demo">{enabled ? "enabled" : "disabled"}</div>
  ),
}))

import { HomePage } from "./home-page"

describe("HomePage", () => {
  test("renders the shared library copy and convex status", () => {
    render(<HomePage convexEnabled={false} />)

    expect(screen.getByText("Workspace ready")).toBeInTheDocument()
    expect(screen.getByText(/shared example library/i)).toBeInTheDocument()
    expect(screen.getByTestId("convex-demo")).toHaveTextContent("disabled")
  })
})
