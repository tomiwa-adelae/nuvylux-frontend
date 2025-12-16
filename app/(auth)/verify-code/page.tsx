import { PageHeader } from "@/components/PageHeader";
import React from "react";
import { ForgotPasswordForm } from "../_components/ForgotPasswordForm";
import { Logo } from "@/components/Logo";
import { VerifyCodeForm } from "../_components/VerifyCodeForm";

type SearchParams = Promise<{
  email: string;
}>;

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { email } = await searchParams;
  return (
    <div className="py-32">
      <div className="container">
        <div className="md:hidden flex items-center justify-center mb-3">
          <Logo color="black" />
        </div>
        <VerifyCodeForm email={email} />
      </div>
    </div>
  );
};

export default page;
