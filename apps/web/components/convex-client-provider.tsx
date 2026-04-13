"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { type ReactNode, useMemo } from "react";

import { authClient } from "@/lib/auth-client";

type ConvexClientProviderProps = {
  children: ReactNode;
  deploymentUrl?: string;
  initialToken?: string | null;
};

export function ConvexClientProvider({
  children,
  deploymentUrl,
  initialToken,
}: ConvexClientProviderProps) {
  const client = useMemo(() => {
    if (!deploymentUrl) {
      return null;
    }

    return new ConvexReactClient(deploymentUrl);
  }, [deploymentUrl]);

  if (!client) {
    return <>{children}</>;
  }

  return (
    <ConvexBetterAuthProvider
      authClient={authClient}
      client={client}
      initialToken={initialToken}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}
