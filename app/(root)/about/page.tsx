import React from "react";
import { AboutHero } from "../_components/AboutHero";
import { ManifestoSection } from "../_components/ManifestoSection";
import { VMVSection } from "../_components/VMVSection";
import { EcosystemStructure } from "../_components/EcosystemStructure";
import { TeamSection } from "../_components/TeamSection";
import { AboutFinalCTA } from "../_components/AboutFinalCTA";
import { TimelineSection } from "../_components/TimelineSection";
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
      <PartneringLogo />
    </div>
  );
};

export default page;
