"use client";
import { useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { OnboardingTestimonials } from "./_components/OnboardingTestimonials";
import { PageGradient } from "@/components/PageGradient";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, _hasHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!user) router.push("/login");
  }, [user, _hasHydrated]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
      <div className="lg:col-span-3 flex min-h-[80vh] w-full items-start justify-center relative py-4 md:py-12">
        <PageGradient />
        {children}
      </div>
      <OnboardingTestimonials />
    </div>
  );
}
