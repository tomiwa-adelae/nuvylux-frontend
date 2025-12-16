import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export const AITeaser = () => {
  return (
    <section className="py-12 bg-[#0A0A0A] text-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <Zap className="w-10 h-10 text-primary mb-4 mx-auto lg:mx-0" />

            <h2 className="font-serif text-4xl md:text-5xl mb-4 leading-snug">
              Intelligent Luxury: <br />
              Smart Skin. Smarter Beauty.
            </h2>

            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Unlock the future of personalized care. Our proprietary AI
              analyzes your skin type, texture, and needs to deliver precise,
              trusted recommendations from our network.
            </p>

            <Button
              asChild
              className="px-8 py-6 text-lg bg-[#C1272D] text-white font-semibold hover:bg-opacity-90 transition-colors duration-300"
            >
              <Link href="/ai-analysis">Start Your Free Analysis</Link>
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              *Privacy-first. Not a medical diagnostic tool.
            </p>
          </div>

          {/* Right Section: Visual (Mockup) */}
          <div className="order-1 lg:order-2 relative w-full flex items-center justify-center">
            {/* Replace with a stylized mockup of the AI analysis app interface */}
            <Image
              src="/assets/images/ai-img.jpg" // Path for a clean UI/UX mockup
              alt="NUVYLUX AI Skin Analysis Tool"
              width={500}
              height={500}
              className="object-contain shadow-2xl rounded-lg"
            />
            {/* Optional: Add a subtle green glow/particle effect around the mockup for 'tech' feel */}
          </div>
        </div>
      </div>
    </section>
  );
};
