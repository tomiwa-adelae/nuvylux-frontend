"use client";

import * as React from "react";
import { IconSettings, IconHelp } from "@tabler/icons-react";

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
import { SmallLogo } from "./Logo";
import { useAuth } from "@/store/useAuth";
import { getNavByRole } from "@/lib/getNavByRole";

const sidebarData = {
  navSecondary: [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Get Help", url: "/help", icon: IconHelp, comingSoon: true },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const navItems = React.useMemo(() => getNavByRole(user?.role), [user?.role]);

  // if (isLoading) return null; // or skeleton

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
              <a href="/">
                <SmallLogo />
                <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold uppercase tracking-widest">
                    NuvyLux
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.role === "ADMINISTRATOR"
                      ? "Administrator"
                      : user?.role === "BRAND"
                        ? "Brand Partner"
                        : user?.role === "PROFESSIONAL"
                          ? "Professional"
                          : user?.role === "ARTISAN"
                            ? "Artisan"
                            : "User"}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
