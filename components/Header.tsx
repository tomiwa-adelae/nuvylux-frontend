"use client";
import { Button } from "@/components/ui/button";
import { homeNavLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNavbar } from "./MobileNavbar";

export const Header = () => {
  const pathname = usePathname();

  const isActive = (slug: string) =>
    pathname === slug || pathname.startsWith(`${slug}/`);

  return (
    <header className="fixed top-0 z-50 w-full bg-primary relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent pointer-events-none" />

      <div className="container mx-auto container h-20 flex items-center justify-between">
        <Link href={"/"} className="flex items-center">
          <Logo color="white" />
        </Link>

        <nav className="hidden lg:flex items-center text-white gap-1 font-medium text-muted-foreground text-sm">
          {homeNavLinks.map(({ slug, label }, index) => (
            <Button
              size={"sm"}
              key={index}
              asChild
              className={isActive(slug) ? "text-primary" : ""}
              variant={isActive(slug) ? "secondary" : "ghost"}
            >
              <Link
                href={slug}
                className="hover:text-primary transition-colors"
              >
                {label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="md"
            className="hidden md:inline-flex text-white"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>

          <Button asChild variant={"white"} size="md">
            <Link href="/create-account">Join Now</Link>
          </Button>
          <MobileNavbar />
        </div>
      </div>
    </header>
  );
};
