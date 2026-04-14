"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useAuth } from "@/store/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReady } = useAuthGuard();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isReady || !user) return;
    if (
      user.adminPosition === "CONTENT_WRITER" &&
      !pathname.startsWith("/admin/blog")
    ) {
      router.replace("/admin/blog");
    }
  }, [isReady, user, pathname, router]);

  if (!isReady) return null;
  if (user?.adminPosition === "CONTENT_WRITER" && !pathname.startsWith("/admin/blog")) {
    return null;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "4rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main container py-8 flex flex-1 flex-col gap-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
