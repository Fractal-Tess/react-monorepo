"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import {
  AudioLinesIcon,
  BookOpenIcon,
  BotIcon,
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  SearchCodeIcon,
} from "lucide-react";

import { DashboardNavMain } from "./DashboardNavMain.client";
import { DashboardNavUser } from "./DashboardNavUser.client";
import { DashboardTeamSwitcher } from "./DashboardTeamSwitcher.client";

type DashboardSidebarProps = {
  user: {
    email: string | null;
    name: string | null;
  };
};

const TEAMS = [
  {
    icon: GalleryVerticalEndIcon,
    name: "React Monorepo",
    plan: "Local Dev",
  },
  {
    icon: AudioLinesIcon,
    name: "Scraper Ops",
    plan: "Worker",
  },
] as const;

const NAV_ITEMS = [
  {
    icon: LayoutDashboardIcon,
    items: [
      { title: "Snapshot", url: "#snapshot" },
      { title: "Recent data", url: "#recent-data" },
    ],
    title: "Overview",
  },
  {
    icon: BotIcon,
    items: [
      { title: "Better Auth", url: "/login" },
      { title: "Convex routes", url: "/" },
    ],
    title: "Auth",
  },
  {
    icon: SearchCodeIcon,
    items: [
      { title: "Scraper flow", url: "#recent-data" },
      { title: "Convex seed data", url: "#snapshot" },
    ],
    title: "Data",
  },
  {
    icon: BookOpenIcon,
    items: [
      { title: "Public landing", url: "/" },
      {
        title: "Project docs",
        url: "https://better-auth.com/docs/integrations/convex",
      },
    ],
    title: "References",
  },
] as const;

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <DashboardTeamSwitcher teams={TEAMS} />
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain items={NAV_ITEMS} />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
