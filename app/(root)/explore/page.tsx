import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Explore the full Nuvylux catalogue — search beauty products, fashion items, and creator collections all in one place.",
  alternates: { canonical: "https://nuvylux.com/explore" },
  openGraph: {
    title: "Explore Nuvylux",
    description: "Search and discover beauty products, fashion, and verified creator collections.",
    url: "https://nuvylux.com/explore",
    images: [{ url: "/assets/images/marketplace-img.jpg", width: 1200, height: 630, alt: "Explore Nuvylux" }],
  },
};
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import { CuratedShop } from "../_components/CuratedShop";

const page = () => {
  return (
    <div>
      <section
        className="relative min-h-[70vh]5flex flex-col items-center justify-center p-8 text-white"
        style={{
          backgroundImage: "url('/assets/images/marketplace-img.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        <div className="container text-center py-16 z-10 relative">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-1">
            Explore
          </h1>

          {/* Quick Search and Navigation */}
          <div className="max-w-2xl mt-4 mx-auto flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-1">
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
      <CuratedShop />
    </div>
  );
};

export default page;
