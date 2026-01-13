"use client";
import { Confetti } from "@/components/Confetti";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/useAuth";
import { IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { PageHeader } from "../../_components/PageHeader";

const page = () => {
  const { user } = useAuth();
  return (
    <div className="container">
      <Confetti />
      <Logo color="black" />
      <PageHeader
        title={
          <>
            <IconSparkles className="text-primary size-10 inline-block" /> Your
            account is ready!
          </>
        }
        description={
          "You’re all set. Start exploring, booking, or offering services"
        }
      />

      <div className="mt-4">
        <Button asChild>
          <Link
            href={user?.role === "client" ? "/explore" : "/brand-onboarding"}
          >
            {user?.role === "client" ? "Explore now" : "Go to Dashboard"}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
