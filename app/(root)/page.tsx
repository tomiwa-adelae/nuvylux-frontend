import type { Metadata } from "next";
import React from "react";
import { Showcase } from "./_components/Showcase";

export const metadata: Metadata = {
  title: "Nuvylux — Beauty, Fashion & Innovation",
  description:
    "Discover verified beauty and fashion professionals, shop curated products, and experience AI-powered skin consultations on Nuvylux.",
  alternates: { canonical: "https://nuvylux.com" },
  openGraph: {
    title: "Nuvylux — Beauty, Fashion & Innovation",
    description:
      "Book trusted beauty experts, shop the marketplace, and explore the future of luxury on Nuvylux.",
    url: "https://nuvylux.com",
    images: [
      {
        url: "/assets/images/showcase.jpg",
        width: 1200,
        height: 630,
        alt: "Nuvylux",
      },
    ],
  },
};
import { FeaturedServices } from "./_components/FeaturedServices";
import { FeaturedProducts } from "./_components/FeaturedProducts";
import { CoreValues } from "./_components/CoreValues";
import { AboutTeaser } from "./_components/AboutTeaser";
import { PartneringLogo } from "./_components/PartneringLogo";
import { CommunityCTA } from "./_components/CommunityCTA";
import { EcosystemOverview } from "./_components/EcosystemOverview";
import { AITeaser } from "./_components/AITeaser";
import { BrandCategorySection } from "./_components/BrandCategorySection";
import { FeaturedBlog } from "./_components/FeaturedBlog";

const page = () => {
  return (
    <div>
      <Showcase />
      <FeaturedServices />
      <FeaturedProducts />
      <BrandCategorySection />
      {/* <PartneringLogo /> */}
      <CoreValues />
      <FeaturedBlog />
      <AboutTeaser />
      <EcosystemOverview />
      <AITeaser />
      {/* <PartneringLogo /> */}
      <CommunityCTA />
    </div>
  );
};

export default page;
