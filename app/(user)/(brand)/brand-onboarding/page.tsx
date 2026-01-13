import { PageHeader } from "@/app/(onboarding)/_components/PageHeader";
import { Logo } from "@/components/Logo";
import { BrandOnboarding } from "./_components/BrandOnboarding";

const page = () => {
  return (
    <div className="container">
      <Logo color="black" />
      <PageHeader
        title="Set up your brand?"
        description={
          "Welcome to Nuvylux! Let’s set up your brand so you can start selling and showcasing your products/services."
        }
      />
      <BrandOnboarding />
    </div>
  );
};

export default page;
