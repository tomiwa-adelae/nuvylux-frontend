import React from "react";
import { Quote } from "lucide-react";
import { IconQuote, IconQuoteFilled } from "@tabler/icons-react";

export const ManifestoSection = () => {
  return (
    <section id="manifesto" className="py-12 bg-white">
      <div className="container max-w-4xl text-center">
        <IconQuoteFilled className="size-14 text-primary mb-6 mx-auto" />{" "}
        {/* Crimson Red Accent */}
        <h3 className="text-3xl text-primary font-semibold mb-8">
          The Founder's Manifesto
        </h3>
        {/* The Core Manifesto Text */}
        <div className="text-xl text-gray-700 leading-relaxed space-y-6">
          <p>
            "I created Nuvylux because I've always believed that luxury is more
            than appearance, it’s transformation. I saw a world where beauty,
            fashion, and innovation often walked separate paths, and I wanted to
            merge them, to create something that reflects the brilliance of
            modern Africa and the boundless power of new ideas."
          </p>
          <p>
            "Nuvylux was born from that vision, a name that means the new light
            of luxury. A movement that redefines what elegance looks like in the
            digital age. A brand that speaks of innovation, culture, and
            purpose."
          </p>
          <p>
            "We exist to remind people, especially women and young creators,
            that sophistication and strength can coexist. That technology can
            amplify creativity, not replace it. That the future of beauty and
            fashion will be built by those who dare to dream differently."
          </p>
        </div>
        <p className="font-medium text-gray-900 text-2xl mt-12 italic">
          — Hannah Chika Diei, Founder
        </p>
      </div>
    </section>
  );
};
