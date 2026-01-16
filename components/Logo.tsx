import { cn } from "@/lib/utils";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const Logo = ({ color = "white" }: { color: "white" | "black" }) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center space-x-2",
        color === "white" && "text-white",
        color === "black" && "text-black dark:text-white"
      )}
    >
      <Image
        src="/assets/images/logo.jpg"
        alt="Nuvylux"
        width={120}
        height={40}
        className="h-10 w-auto object-contain"
        priority
      />
      <p className="text-base md:text-xl flex items-start justify-start flex-col">
        <span className={`font-bold`}>NUVYLUX</span>{" "}
        <span className="text-xs font-semibold">FASHION AGENCY</span>
      </p>
    </Link>
  );
};

export const SmallLogo = () => {
  return (
    <Link href="/">
      <Image
        src="/assets/images/logo.jpg"
        alt="Nuvylux"
        width={120}
        height={40}
        className="h-10 w-auto object-contain"
        priority
      />
    </Link>
  );
};
