"use client";

import type { api } from "@workspace/convex/api";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";

type DashboardOverviewProps = {
  preloadedMessages: Preloaded<typeof api.messages.list>;
  preloadedScrapes: Preloaded<typeof api.scrapes.listRecent>;
  user: {
    email: string | null;
    name: string | null;
  };
};

export function DashboardOverview({
  preloadedMessages,
  preloadedScrapes,
  user,
}: DashboardOverviewProps) {
  const messages = usePreloadedQuery(preloadedMessages);
  const scrapes = usePreloadedQuery(preloadedScrapes);

  return (
    <div className="space-y-8 p-5 md:p-8">
      <section className="space-y-6" id="snapshot">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="font-medium text-[0.65rem] text-muted-foreground uppercase tracking-[0.3em]">
              Dashboard
            </p>
            <h1 className="font-heading text-3xl tracking-tight md:text-4xl">
              Welcome back{user.name ? `, ${user.name}` : ""}.
            </h1>
            <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
              Your Better Auth session combined with Convex sample data — a
              workspace view, not a bare component demo.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-1.5 font-medium text-[0.65rem] text-emerald-700 uppercase tracking-[0.18em] dark:border-emerald-400/20 dark:bg-emerald-400/[0.06] dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            Authenticated
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5">
            <p className="font-medium text-[0.65rem] text-muted-foreground uppercase tracking-[0.25em]">
              Current user
            </p>
            <p className="mt-3 truncate font-semibold text-lg tracking-tight">
              {user.email ?? "Unknown"}
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <p className="font-medium text-[0.65rem] text-muted-foreground uppercase tracking-[0.25em]">
              Seeded messages
            </p>
            <p className="mt-3 font-heading text-3xl tracking-tight">
              {messages.length}
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <p className="font-medium text-[0.65rem] text-muted-foreground uppercase tracking-[0.25em]">
              Recent scrapes
            </p>
            <p className="mt-3 font-heading text-3xl tracking-tight">
              {scrapes.length}
            </p>
          </div>
        </div>
      </section>

      <section
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
        id="recent-data"
      >
        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="border-b px-5 py-4">
            <h2 className="font-heading text-lg tracking-tight">
              Latest messages
            </h2>
          </div>
          <div className="divide-y">
            {messages.map((message) => (
              <div className="px-5 py-4" key={message._id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-sm capitalize">
                    {message.source}
                  </p>
                  <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[0.6rem] uppercase">
                    {message.source}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {message.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="border-b px-5 py-4">
            <h2 className="font-heading text-lg tracking-tight">
              Recent scrape runs
            </h2>
          </div>
          <div className="divide-y">
            {scrapes.map((scrape) => (
              <div className="px-5 py-4" key={scrape._id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-sm capitalize">
                    {scrape.mode}
                  </p>
                  <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[0.6rem] uppercase">
                    {scrape.mode}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                  {scrape.summary}
                </p>
                <p className="mt-2 truncate font-mono text-[0.6rem] text-muted-foreground/70">
                  {scrape.url}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
