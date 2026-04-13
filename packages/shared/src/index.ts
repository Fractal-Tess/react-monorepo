const TITLE_CASE_SPLIT_REGEX = /[\s-_]+/;

export type ServiceStatus = {
  appName: string;
  environment: string;
  healthy: boolean;
};

export function toTitleCase(value: string) {
  return value
    .trim()
    .split(TITLE_CASE_SPLIT_REGEX)
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function getWelcomeMessage(appName: string) {
  return `${toTitleCase(appName)} is connected to the shared example library.`;
}

export function describeServiceStatus(status: ServiceStatus) {
  const state = status.healthy ? "healthy" : "degraded";
  return `${toTitleCase(status.appName)} is ${state} in ${status.environment}.`;
}
