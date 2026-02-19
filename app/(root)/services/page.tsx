import type { Metadata } from "next";
import React from "react";
import { ServicesHero } from "../_components/ServicesHero";

export const metadata: Metadata = {
  title: "Book Beauty Services",
  description:
    "Browse and book verified lash technicians, nail artists, hair stylists, makeup artists, and more on Nuvylux. Trusted professionals, transparent pricing.",
  alternates: { canonical: "https://nuvylux.com/services" },
  keywords: [
    "book beauty services",
    "verified lash technician",
    "nail artist near me",
    "makeup artist booking",
    "hair stylist Nigeria",
    "beauty professional",
  ],
  openGraph: {
    title: "Book Verified Beauty Services — Nuvylux",
    description:
      "Discover and book certified beauty and fashion professionals near you on Nuvylux.",
    url: "https://nuvylux.com/services",
    images: [{ url: "/assets/images/services-img.jpg", width: 1200, height: 630, alt: "Nuvylux Services" }],
  },
};
import { ServicesPillars } from "../_components/ServicesPillars";
import { AudienceSection } from "../_components/AudienceSection";
import { HowItWorksSection } from "../_components/HowItWorksSection";
import { PartneringLogo } from "../_components/PartneringLogo";
import { FinalCtaSection } from "../_components/FinalCtaSection";
import { ServicesGrid } from "../_components/ServicesGrid";

const page = () => {
  return (
    <div>
      <ServicesHero />
      <ServicesGrid />
      <ServicesPillars />
      <AudienceSection />
      <HowItWorksSection />

      <PartneringLogo />

      {/* 6. Final Call to Action (Strong Close) */}
      <FinalCtaSection />
    </div>
  );
};

export default page;
