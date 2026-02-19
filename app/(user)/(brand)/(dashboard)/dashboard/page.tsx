"use client";

import { useAuth } from "@/store/useAuth";
import { BrandDashboard } from "../_components/BrandDashboard";
import { ProviderDashboard } from "../_components/ProviderDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "BRAND") return <BrandDashboard />;
  return <ProviderDashboard />;
}
