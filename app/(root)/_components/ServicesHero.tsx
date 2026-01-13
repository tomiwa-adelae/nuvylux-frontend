import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export const ServicesHero = () => {
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center"
      style={{
        backgroundImage: "url('/assets/images/services-img.jpg')",
        backgroundSize: "cover", // make image cover the container
        backgroundPosition: "center", // center the image
        width: "100%", // full width
      }}
    >
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Services Designed to Illuminate Beauty, Fashion & Innovation.
        </h1>
        <p className="text-gray-100 text-base mt-2 max-w-3xl mx-auto">
          Nuvylux delivers premium, technology-driven services for creators,
          brands, and modern consumers shaping the future of luxury.
        </p>
        <div className="mt-10 space-x-4">
          <Button asChild>
            <Link href="#pillars">Explore Services</Link>
          </Button>
          <Button variant={"white"} asChild>
            <Link href="/consultation">Book a Consultation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
