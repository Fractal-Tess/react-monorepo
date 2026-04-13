"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import type { LucideIcon } from "lucide-react";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

type DashboardTeamSwitcherProps = {
  teams: ReadonlyArray<{
    icon: LucideIcon;
    name: string;
    plan: string;
  }>;
};

export function DashboardTeamSwitcher({ teams }: DashboardTeamSwitcherProps) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                size="lg"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <activeTeam.icon className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeTeam.name}</span>
              <span className="truncate text-xs">{activeTeam.plan}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Workspaces
              </DropdownMenuLabel>
              {teams.map((team) => (
                <DropdownMenuItem
                  className="gap-2 p-2"
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <team.icon className="size-4" />
                  </div>
                  <div className="grid">
                    <span>{team.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {team.plan}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
