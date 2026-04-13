"use client";

import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

type DashboardNavUserProps = {
  user: {
    email: string | null;
    name: string | null;
  };
};

const INITIALS_SPLIT_PATTERN = /[\s@._-]+/;

function getInitials(name: string | null, email: string | null) {
  const source = name ?? email ?? "RM";
  return source
    .split(INITIALS_SPLIT_PATTERN)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardNavUser({ user }: DashboardNavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  async function onSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton className="aria-expanded:bg-muted" size="lg" />
            }
          >
            <Avatar>
              <AvatarFallback>
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.name ?? "Authenticated user"}
              </span>
              <span className="truncate text-xs">
                {user.email ?? "No email available"}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="grid gap-1">
                <span className="font-medium">
                  {user.name ?? "Authenticated user"}
                </span>
                <span className="text-muted-foreground text-xs">
                  {user.email ?? "No email available"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  onSignOut().catch(() => undefined);
                }}
              >
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
