import { Logo } from "@/components/Logo";
import React from "react";
import { OnboardingProfileForm } from "../../_components/OnboardingProfileForm";
import { PageHeader } from "../../_components/PageHeader";

const page = () => {
  return (
    <div className="container">
      <Logo color="black" />
      <PageHeader
        title="Set up your Nuvylux profile"
        description={
          "We just need a few more details to tailor your experience on Nuvylux."
        }
      />
      <h1 className="text-3xl lg:text-4xl font-medium mt-8"></h1>
      <p className="text-muted-foreground text-sm mb-4"></p>
      <OnboardingProfileForm />
    </div>
  );
};

export default page;
