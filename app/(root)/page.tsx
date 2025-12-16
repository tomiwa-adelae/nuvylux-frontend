import React from "react";
import { Showcase } from "./_components/Showcase";
import { Services } from "./_components/Services";
import { CoreValues } from "./_components/CoreValues";
import { AboutTeaser } from "./_components/AboutTeaser";
import { PartneringLogo } from "./_components/PartneringLogo";
import { CommunityCTA } from "./_components/CommunityCTA";
import { EcosystemOverview } from "./_components/EcosystemOverview";
import { AITeaser } from "./_components/AITeaser";

const page = () => {
  return (
    <div>
      <Showcase />
      <Services />
      <PartneringLogo />
      <CoreValues />
      <AboutTeaser />
      <EcosystemOverview />
      <AITeaser />
      <PartneringLogo />
      <CommunityCTA /> {/* <-- Place the final CTA here */}
    </div>
  );
};

export default page;
