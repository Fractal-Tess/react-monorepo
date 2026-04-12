export type ServiceStatus = {
  appName: string
  environment: string
  healthy: boolean
}

export function toTitleCase(value: string) {
  return value
    .trim()
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

export function getWelcomeMessage(appName: string) {
  return `${toTitleCase(appName)} is connected to the shared example library.`
}

export function describeServiceStatus(status: ServiceStatus) {
  const state = status.healthy ? "healthy" : "degraded"
  return `${toTitleCase(status.appName)} is ${state} in ${status.environment}.`
}
