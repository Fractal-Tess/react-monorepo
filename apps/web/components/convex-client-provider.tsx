"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { type ReactNode, useMemo } from "react";

type ConvexClientProviderProps = {
  children: ReactNode;
  deploymentUrl?: string;
};

export function ConvexClientProvider({
  children,
  deploymentUrl,
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

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
