"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar";
import type { LucideIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

type DashboardNavMainProps = {
  items: ReadonlyArray<{
    icon: LucideIcon;
    items: ReadonlyArray<{
      title: string;
      url: string;
    }>;
    title: string;
  }>;
};

export function DashboardNavMain({ items }: DashboardNavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <Collapsible
            className="group/collapsible"
            defaultOpen={index === 0}
            key={item.title}
            render={<SidebarMenuItem />}
          >
            <CollapsibleTrigger
              render={<SidebarMenuButton tooltip={item.title} />}
            >
              <item.icon className="size-4" />
              <span>{item.title}</span>
              <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton render={<Link href={subItem.url} />}>
                      <span>{subItem.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
