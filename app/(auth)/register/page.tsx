import { Logo } from "@/components/Logo";
import { RegisterForm } from "../_components/RegisterForm";
import { Suspense } from "react";

const page = () => {
  return (
    <div className="py-32 w-full">
      <div className="container">
        <div className="md:hidden flex items-center justify-center mb-3">
          <Logo color="black" />
        </div>
        <h1 className="text-3xl lg:text-4xl mb-4 font-medium text-center">
          Create Your Nuvylux Account
        </h1>
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
