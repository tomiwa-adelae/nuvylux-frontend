import { OnboardingTestimonials } from "@/app/(onboarding)/_components/OnboardingTestimonials";
import { PageGradient } from "@/components/PageGradient";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
