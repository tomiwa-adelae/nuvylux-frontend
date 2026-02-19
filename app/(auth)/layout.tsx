"use client";
import { useEffect } from "react";
import { Testimonials } from "./_components/Testimonials";
import { toast } from "sonner";
import { useAuth } from "@/store/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { PageGradient } from "@/components/PageGradient";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, _hasHydrated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  useEffect(() => {
    if (!_hasHydrated) return;
    if (user) {
      if (!user.onboardingCompleted) {
        router.push("/onboarding");
      } else if (redirectUrl) {
        router.push(redirectUrl);
      } else if (user.role === "ADMINISTRATOR") {
        router.push("/admin");
      } else if (user.role === "PROFESSIONAL" || user.role === "BRAND") {
        router.push("/dashboard");
      } else {
        router.push("/explore");
      }
    }
  }, [user, _hasHydrated]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const unauthenticated = params.get("unauthenticated");
      const logout = params.get("logout");

      if (unauthenticated === "true") {
        toast.error("Your session has expired. Please log in again.");
      }

      if (logout === "true") {
        toast.success("You've been logged out successfully.");
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <Testimonials />
      <div className="flex relative min-h-[80vh] w-full items-center justify-center">
        <PageGradient />
        {children}
      </div>
    </div>
  );
}
