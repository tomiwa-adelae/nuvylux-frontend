import type { Metadata } from "next";
import { AboutHero } from "../_components/AboutHero";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn the story behind Nuvylux — a visionary platform built to redefine luxury through artistry, culture, and technology. Meet our founders and discover our mission.",
  alternates: { canonical: "https://nuvylux.com/about" },
  openGraph: {
    title: "About Nuvylux",
    description:
      "Meet the team and vision behind Nuvylux — redefining beauty and fashion with innovation and purpose.",
    url: "https://nuvylux.com/about",
    images: [
      {
        url: "/assets/images/ceo.jpg",
        width: 1200,
        height: 630,
        alt: "Nuvylux Founder",
      },
    ],
  },
};
import { ManifestoSection } from "../_components/ManifestoSection";
import { VMVSection } from "../_components/VMVSection";
import { EcosystemStructure } from "../_components/EcosystemStructure";
import { TeamSection } from "../_components/TeamSection";
import { AboutFinalCTA } from "../_components/AboutFinalCTA";
import { PartneringLogo } from "../_components/PartneringLogo";

const page = () => {
  return (
    <div>
      <AboutHero />
      <ManifestoSection />
      <VMVSection />
      <EcosystemStructure />
      <TeamSection />
      <AboutFinalCTA />
      {/* <PartneringLogo /> */}
    </div>
  );
};

export default page;
