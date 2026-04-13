import { api } from "@workspace/convex/api";
import { ConvexHttpClient } from "convex/browser";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { getToken } from "@/lib/auth-server";

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

async function loadCurrentUser(deploymentUrl: string, token: string) {
  const client = new ConvexHttpClient(deploymentUrl);
  client.setAuth(token);
  return client.query(api.auth.getCurrentUser, {});
}

export default async function Page() {
  let token: string | null = null;

  try {
    token = (await getToken()) ?? null;
  } catch {
    token = null;
  }

  if (!token) {
    redirect("/login");
  }

  const deploymentUrl = env.CONVEX_URL;
  const [{ messages, scrapes }, user] = await Promise.all([
    loadDashboardData(deploymentUrl),
    loadCurrentUser(deploymentUrl, token).catch(() => null),
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
