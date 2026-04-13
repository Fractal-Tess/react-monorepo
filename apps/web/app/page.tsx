import { api } from "@workspace/convex/api";
import { ConvexHttpClient } from "convex/browser";
import Link from "next/link";

import { LandingDataPreview } from "./_components/LandingDataPreview";
import { LandingHero } from "./_components/LandingHero";

type MessagePreview = {
  _id: string;
  body: string;
  source: string;
};

type ScrapePreview = {
  _id: string;
  mode: string;
  summary: string;
  url: string;
};

async function loadHomepageData(deploymentUrl?: string) {
  if (!deploymentUrl) {
    return {
      messages: [] as MessagePreview[],
      scrapes: [] as ScrapePreview[],
    };
  }

  try {
    const client = new ConvexHttpClient(deploymentUrl);
    const [messages, scrapes] = await Promise.all([
      client.query(api.messages.list, {}),
      client.query(api.scrapes.listRecent, { limit: 3 }),
    ]);

    return {
      messages: messages.map((message) => ({
        _id: String(message._id),
        body: message.body,
        source: message.source,
      })),
      scrapes: scrapes.map((scrape) => ({
        _id: String(scrape._id),
        mode: scrape.mode,
        summary: scrape.summary,
        url: scrape.url,
      })),
    };
  } catch {
    return {
      messages: [] as MessagePreview[],
      scrapes: [] as ScrapePreview[],
    };
  }
}

export default async function Page() {
  const deploymentUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;
  const { messages, scrapes } = await loadHomepageData(deploymentUrl);

  return (
    <main className="flex h-svh flex-col overflow-hidden">
      <nav className="z-30 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-lg md:px-10 lg:px-12">
        <Link className="font-heading text-lg tracking-tight" href="/">
          React Monorepo
        </Link>
        <div className="flex items-center gap-6">
          <Link
            className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="rounded-full bg-primary px-4 py-1.5 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
            href="/login"
          >
            Login
          </Link>
        </div>
      </nav>

      <section className="relative flex min-h-0 flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-[10%] -left-[15%] h-[35rem] w-[35rem] rounded-full bg-primary/[0.04] blur-[100px]" />
          <div className="absolute right-[-10%] -bottom-[10%] h-[30rem] w-[30rem] rounded-full bg-teal-400/[0.03] blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_40%,black,transparent)]" />
        </div>
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-6 py-8 md:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,26rem)] lg:px-12">
          <div className="flex items-center">
            <LandingHero hasConvex={Boolean(deploymentUrl)} />
          </div>
          <div className="hidden items-center lg:flex">
            <LandingDataPreview
              hasConvex={Boolean(deploymentUrl)}
              messages={messages}
              scrapes={scrapes}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
