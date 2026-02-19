import React from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CommunityCTA = () => {
  return (
    <section className="py-20 bg-primary">
      {" "}
      {/* Till Green background for maximum visual impact */}
      <div className="container text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
          Join the NUVYLUX Movement.
        </h2>

        <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
          Be a part of the creative revolution that's shaping the future of
          digital luxury, powered by innovation, culture, and purpose.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant={"secondary"}>
            <Link href="/join">Apply to Be a Creator</Link>
          </Button>
          <Button asChild variant="black">
            <Link href="/signup">Sign Up for Exclusive Access</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
