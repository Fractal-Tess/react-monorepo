import { api } from "@workspace/convex/api";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

import { getToken } from "@/lib/auth-server";
import { getConvexSsrOptions } from "@/lib/convex-ssr";

import { DashboardOverview } from "./_components/DashboardOverview";
import { DashboardShell } from "./_components/DashboardShell.client";

type DashboardUser = {
  email: string | null;
  name: string | null;
};

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

  const options = getConvexSsrOptions(token);
  const [preloadedMessages, preloadedScrapes, user] = await Promise.all([
    preloadQuery(api.messages.list, {}, options),
    preloadQuery(api.scrapes.listRecent, { limit: 4 }, options),
    fetchQuery(api.auth.getCurrentUser, {}, options).catch(() => null),
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
        preloadedMessages={preloadedMessages}
        preloadedScrapes={preloadedScrapes}
        user={dashboardUser}
      />
    </DashboardShell>
  );
}
