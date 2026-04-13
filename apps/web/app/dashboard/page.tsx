import { api } from "@workspace/convex/api";
import { ConvexHttpClient } from "convex/browser";
import { redirect } from "next/navigation";

import { fetchAuthQuery, getToken } from "@/lib/auth-server";

import { DashboardOverview } from "./_components/DashboardOverview";
import { DashboardShell } from "./_components/DashboardShell.client";

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

type DashboardUser = {
  email: string | null;
  name: string | null;
};

async function loadDashboardData(deploymentUrl?: string) {
  if (!deploymentUrl) {
    return {
      messages: [] as MessagePreview[],
      scrapes: [] as ScrapePreview[],
    };
  }

  const client = new ConvexHttpClient(deploymentUrl);
  const [messages, scrapes] = await Promise.all([
    client.query(api.messages.list, {}),
    client.query(api.scrapes.listRecent, { limit: 4 }),
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
}

export default async function Page() {
  const token = await getToken();
  if (!token) {
    redirect("/login");
  }

  const deploymentUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;
  const [user, { messages, scrapes }] = await Promise.all([
    fetchAuthQuery(api.auth.getCurrentUser, {}),
    loadDashboardData(deploymentUrl),
  ]);

  if (!user) {
    redirect("/login");
  }

  const dashboardUser: DashboardUser = {
    email: user.email ?? null,
    name: user.name ?? null,
  };

  return (
    <DashboardShell user={dashboardUser}>
      <DashboardOverview
        messages={messages}
        scrapes={scrapes}
        user={dashboardUser}
      />
    </DashboardShell>
  );
}
