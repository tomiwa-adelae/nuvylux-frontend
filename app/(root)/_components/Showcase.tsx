import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export const Showcase = () => {
  return (
    <div
      className="relative min-h-[70vh] flex items-center justify-center"
      style={{
        backgroundImage: "url('/assets/images/showcase.jpg')",
        backgroundSize: "cover", // make image cover the container
        backgroundPosition: "center", // center the image
        width: "100%", // full width
      }}
    >
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <div className="z-10 relative text-white container text-center">
        <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl">
          Redefining Beauty, Fashion & Innovation.
        </h1>
        <p className="text-gray-100 text-base mt-2">
          Nuvylux is a visionary house blending artistry, culture, and
          technology to illuminate a new era of elegance
        </p>
        <div className="flex items-center mt-4 justify-center gap-2">
          <Button asChild>
            <Link href={"/services"}>Book services</Link>
          </Button>
          <Button variant={"white"} asChild>
            <Link href={"/marketplace"}>Shop now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
