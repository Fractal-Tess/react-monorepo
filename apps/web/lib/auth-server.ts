import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { env } from "@/env";

const authServer = convexBetterAuthNextJs({
  convexSiteUrl: env.CONVEX_SITE_URL,
  convexUrl: env.CONVEX_URL,
});

export const handler: typeof authServer.handler = authServer.handler;
export const preloadAuthQuery: typeof authServer.preloadAuthQuery =
  authServer.preloadAuthQuery;
export const isAuthenticated: typeof authServer.isAuthenticated =
  authServer.isAuthenticated;
export const getToken: typeof authServer.getToken = authServer.getToken;
export const fetchAuthQuery: typeof authServer.fetchAuthQuery =
  authServer.fetchAuthQuery;
export const fetchAuthMutation: typeof authServer.fetchAuthMutation =
  authServer.fetchAuthMutation;
export const fetchAuthAction: typeof authServer.fetchAuthAction =
  authServer.fetchAuthAction;
