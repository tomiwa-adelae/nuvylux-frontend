import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export const AboutHero = () => {
  return (
    <section
      className="relative min-h-[70vh] flex flex-col items-center justify-center p-8 text-white"
      style={{
        backgroundImage: "url('/assets/images/about-img.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dimmed Overlay for Text Clarity and Luxury Tone */}
      <div className="absolute inset-0 bg-black/80 pointer-events-none" />

      {/* Content Container */}
      <div className="z-10 relative max-w-4xl text-center pt-20 pb-16">
        {/* Subtitle/Pre-Header */}
        <h1 className="text-lg uppercase tracking-[0.2em] text-primary mb-2">
          Nuvylux Global
        </h1>
        <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          The New Light <br className="hidden md:inline" /> of Luxury.
        </h2>

        <p className="text-gray-100 text-base lg:text-lg mb-6 max-w-2xl mx-auto">
          A visionary house redefining beauty, fashion, and innovation, where
          culture inspires evolution and technology amplifies creativity.
        </p>
        <Button asChild>
          <Link href="#manifesto" scroll={true}>
            Explore Our Story
          </Link>
        </Button>
      </div>
    </section>
  );
};
