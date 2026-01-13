import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const AboutFinalCTA = () => {
  return (
    <section className="py-16 bg-[#0A0A0A] text-white">
      <div className="container max-w-4xl text-center">
        <h3 className="font-semibold text-3xl md:text-4xl mb-4 leading-tight">
          Ready to Build the Future with Us?
        </h3>
        <p className="text-xl text-gray-400 mb-10">
          We welcome inquiries from global press, strategic investors, and
          creative talents who align with the Nuvylux vision.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button asChild className="bg-[#C1272D] hover:bg-opacity-90">
            <Link href="/press">Press & Media Inquiries</Link>
          </Button>

          <Button asChild variant="white">
            <Link href="/partnerships">Strategic Partnerships</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
