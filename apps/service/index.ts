import { describeServiceStatus } from "@workspace/example-lib"

const status = describeServiceStatus({
  appName: "service",
  environment: process.env.NODE_ENV ?? "development",
  healthy: true,
})

console.log(status)
