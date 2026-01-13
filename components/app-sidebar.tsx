"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconPackage,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconBuildingStore,
  IconSparkles,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo, SmallLogo } from "./Logo";

const sidebarData = {
  user: {
    name: "Luxury Brand Admin",
    email: "admin@nuvylux.com",
    avatar: "/avatars/brand-admin.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Inventory", url: "/dashboard/products", icon: IconPackage },
    { title: "Analytics", url: "/dashboard/analytics", icon: IconChartBar },
    { title: "AI Insights", url: "/dashboard/ai", icon: IconSparkles },
    { title: "Customers", url: "/dashboard/customers", icon: IconUsers },
  ],
  navSecondary: [
    { title: "Settings", url: "/dashboard/settings", icon: IconSettings },
    { title: "Get Help", url: "/dashboard/help", icon: IconHelp },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <a href="#">
                <SmallLogo />
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-semibold uppercase tracking-widest">
                    NuvyLux
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Brand Partner
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
