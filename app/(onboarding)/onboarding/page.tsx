import { Logo } from "@/components/Logo";
import React from "react";
import { OnboardingPersona } from "../_components/OnboardingPersona";
import { PageHeader } from "../_components/PageHeader";

const page = () => {
  return (
    <div className="container">
      <Logo color="black" />
      <PageHeader
        title="How do you want to use Nuvylux?"
        description={"You can change this later"}
      />
      <OnboardingPersona />
    </div>
  );
};

export default page;
