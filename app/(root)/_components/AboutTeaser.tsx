import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const AboutTeaser = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      {/* Subtle gradient background */}
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section: Image */}
          <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl">
            {/* Replace with a high-quality, editorial image. Consider a photo of the founder, a diverse team shot, or an abstract luxury-tech visual. */}
            <Image
              src="/assets/images/ceo.jpg" // Make sure this path is correct
              alt="Nuvylux Founder Vision"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 hover:scale-105" // Subtle hover effect
            />
            {/* Optional overlay for visual depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Right Section: Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="font-semibold text-2xl md:text-3xl 2xl:text-4xl text-primary mb-2">
              Redefining Luxury with <br /> Vision & Purpose.
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto lg:mx-0">
              "I created Nuvylux because I believe luxury is more than
              appearance; it’s transformation. It’s a movement that redefines
              elegance in the digital age, blending artistry, culture, and
              technology."
            </p>
            <p className="font-medium text-gray-800 text-xl mb-8">
              — Hannah Chika Diei, Founder
            </p>
            <Button asChild>
              <Link href="/about">Discover Our Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
