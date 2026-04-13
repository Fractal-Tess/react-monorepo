import { api } from "@workspace/convex/api";
import { ConvexHttpClient } from "convex/browser";

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
    <main className="relative min-h-svh overflow-hidden">
      <section className="flex min-h-svh items-center">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 md:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,30rem)] lg:px-12">
          <LandingHero hasConvex={Boolean(deploymentUrl)} />
          <LandingDataPreview
            hasConvex={Boolean(deploymentUrl)}
            messages={messages}
            scrapes={scrapes}
          />
        </div>
      </section>
    </main>
  );
}
