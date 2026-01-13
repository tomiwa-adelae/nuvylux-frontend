"use client";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  IconBuildingStore,
  IconCompass,
  IconSparkles,
  IconStars,
  IconTools,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

export const OnboardingPersona = () => {
  const router = useRouter();
  const [selectedPersona, setSelectedPersona] = useState("");
  const [pending, startTransition] = useTransition();

  const personas = [
    {
      icon: IconSparkles,
      name: (
        <>
          The Visionary <br />
          <span className="text-xs opacity-70">(Client)</span>
        </>
      ),
      value: "client",
    },
    {
      icon: IconCompass,
      name: (
        <>
          The Architect <br />
          <span className="text-xs opacity-70">(Professional)</span>
        </>
      ),
      value: "professional",
    },
    {
      icon: IconBuildingStore,
      name: (
        <>
          The Brand <br />
          <span className="text-xs opacity-70">(Business)</span>
        </>
      ),
      value: "brand",
    },
    {
      icon: IconTools,
      name: (
        <>
          The Artisan <br />
          <span className="text-xs opacity-70">(Craft & Handmade)</span>
        </>
      ),
      value: "artisan",
    },
    {
      icon: IconStars,
      name: (
        <>
          The Curator <br />
          <span className="text-xs opacity-70">(Creator / Influencer)</span>
        </>
      ),
      value: "curator",
    },
  ];

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const res = await api.post("/onboarding/role", {
          role: selectedPersona,
        });

        toast.success(res?.data?.message);
        router.push("/onboarding/interests");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Internal server error");
      }
    });
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {personas.map((persona, index) => (
          <Card
            onClick={() => setSelectedPersona(persona.value)}
            key={index}
            className={cn(
              "py-14 h-full cursor-pointer hover:bg-primary transition-all group",
              selectedPersona === persona.value &&
                "bg-primary text-white hover:bg-primary/90"
            )}
          >
            <CardContent className="flex text-center items-center flex-col justify-center gap-2">
              <persona.icon
                className={cn(
                  "group-hover:text-white transition-all size-8 text-primary",
                  selectedPersona === persona.value && "text-white"
                )}
              />
              <CardTitle className="group-hover:text-white">
                {persona.name}
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex items-center justify-start gap-2 mt-8">
        <Button onClick={() => router.push("/")} variant={"outline"}>
          Skip
        </Button>
        <Button onClick={handleSubmit} disabled={pending || !selectedPersona}>
          {pending ? <Loader /> : "Continue"}
        </Button>
      </div>
    </div>
  );
};
