import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export const ShopHeroSection = () => {
  return (
    <section
      className="relative min-h-[70vh] flex flex-col items-center justify-center p-8 text-white"
      style={{
        backgroundImage: "url('/assets/images/marketplace-img.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      <div className="container text-center py-16 z-10 relative">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-1">
          The Nuvylux Marketplace
        </h1>
        <p className="text-gray-100 text-base lg:text-lg mb-6 max-w-2xl mx-auto">
          Discover the convergence of digital innovation and luxury living.
          Featuring curated Tech Devices, Exclusive Digital Fashion, and Creator
          Resources.
        </p>

        {/* Quick Search and Navigation */}
        <div className="max-w-xl mx-auto flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-1">
          <IconSearch className="w-5 h-5 text-gray-400 ml-4" />
          <Input
            type="text"
            placeholder="Search products, creators, or keywords..."
            className="flex-grow border-0 outline-0 p-3 bg-transparent focus:outline-none"
          />
          <Button className="size-11 rounded-full" size={"icon-lg"}>
            Go
          </Button>
        </div>
      </div>
    </section>
  );
};
