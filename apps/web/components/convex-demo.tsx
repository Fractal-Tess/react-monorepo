"use client";

import { api } from "@workspace/convex/api";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Badge } from "@workspace/ui/components/badge";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef } from "react";

type ConvexDemoProps = {
  enabled: boolean;
};

export function ConvexDemo({ enabled }: ConvexDemoProps) {
  if (!enabled) {
    return (
      <Alert>
        <AlertTitle>Convex configured</AlertTitle>
        <AlertDescription>
          Run the web app through Infisical with <code>CONVEX_URL</code> or{" "}
          <code>NEXT_PUBLIC_CONVEX_URL</code> to connect it to your deployment.
        </AlertDescription>
      </Alert>
    );
  }

  return <ConnectedConvexDemo />;
}

function ConnectedConvexDemo() {
  const hasSeededMessage = useRef(false);
  const hasSeededScrape = useRef(false);
  const messages = useQuery(api.messages.list, {});
  const scrapes = useQuery(api.scrapes.listRecent, { limit: 3 });
  const seed = useMutation(api.messages.seed);
  const seedSampleScrape = useMutation(api.scrapes.seedSample);

  useEffect(() => {
    if (
      hasSeededMessage.current ||
      messages === undefined ||
      messages.length > 0
    ) {
      return;
    }

    hasSeededMessage.current = true;
    seed({ appName: "web app" }).catch(() => undefined);
  }, [messages, seed]);

  useEffect(() => {
    if (
      hasSeededScrape.current ||
      scrapes === undefined ||
      scrapes.length > 0
    ) {
      return;
    }

    hasSeededScrape.current = true;
    seedSampleScrape({}).catch(() => undefined);
  }, [scrapes, seedSampleScrape]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">Convex</Badge>
        <span className="text-muted-foreground text-sm">
          {messages === undefined
            ? "Loading deployment data..."
            : "Deployment connected"}
        </span>
      </div>
      <div className="space-y-2">
        {(messages ?? []).map((message) => (
          <Alert key={message._id}>
            <AlertTitle>{message.source}</AlertTitle>
            <AlertDescription>{message.body}</AlertDescription>
          </Alert>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Scrapes</Badge>
          <span className="text-muted-foreground text-sm">
            {scrapes === undefined
              ? "Loading recent scrape runs..."
              : "Recent scrape runs"}
          </span>
        </div>
        {(scrapes ?? []).map((scrape) => (
          <Alert key={scrape._id}>
            <AlertTitle>{scrape.mode}</AlertTitle>
            <AlertDescription className="space-y-1">
              <p>{scrape.summary}</p>
              <p className="text-muted-foreground text-xs">{scrape.url}</p>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}
