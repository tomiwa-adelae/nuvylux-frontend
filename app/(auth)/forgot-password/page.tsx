import { PageHeader } from "@/components/PageHeader";
import React from "react";
import { ForgotPasswordForm } from "../_components/ForgotPasswordForm";
import { Logo } from "@/components/Logo";

const page = () => {
  return (
    <div className="py-32">
      <div className="container">
        <div className="md:hidden flex items-center justify-center mb-3">
          <Logo color="black" />
        </div>
        <h1 className="text-3xl lg:text-4xl mb-4 font-medium text-center">
          Forgot your password
        </h1>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default page;
