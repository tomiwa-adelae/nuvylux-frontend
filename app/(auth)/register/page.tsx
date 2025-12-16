import { Logo } from "@/components/Logo";
import React from "react";
import { LoginForm } from "../_components/LoginForm";
import { RegisterForm } from "../_components/RegisterForm";

const page = () => {
  return (
    <div className="py-32">
      <div className="container">
        <div className="md:hidden flex items-center justify-center mb-3">
          <Logo color="black" />
        </div>
        <h1 className="text-3xl lg:text-4xl mb-4 font-medium text-center">
          Create Your NUVYLUX Account
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default page;
