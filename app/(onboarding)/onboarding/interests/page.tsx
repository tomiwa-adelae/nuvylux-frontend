import { Logo } from "@/components/Logo";
import React from "react";
import { OnboardingInterests } from "../../_components/OnboardingInterests";
import { PageHeader } from "../../_components/PageHeader";

const page = () => {
  return (
    <div className="container">
      <Logo color="black" />
      <PageHeader
        title="Help us tailor your experience?"
        description={"Please select two or more to proceed"}
      />

      <OnboardingInterests />
    </div>
  );
};

export default page;
