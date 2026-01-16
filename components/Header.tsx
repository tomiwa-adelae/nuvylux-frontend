"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNavbar } from "./MobileNavbar";
import { homeNavLinks } from "@/constants/nav-links";
import { useAuth } from "@/store/useAuth";
import { UserDropdown } from "./UserDropdown";
import { IconShoppingCart } from "@tabler/icons-react";
import { useCart } from "@/store/useCart";

export const Header = () => {
  const pathname = usePathname();

  const isActive = (slug: string) =>
    pathname === slug || pathname.startsWith(`${slug}/`);

  const { user } = useAuth();
  const cartItems = useCart((state) => state.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 z-50 w-full bg-primary overflow-hidden border-b border-white/10">
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
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative text-white hover:bg-white/10"
          >
            <Link href="/cart">
              <IconShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-primary text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-primary">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
          {user ? (
            <UserDropdown />
          ) : (
            <>
              <Button
                variant="ghost"
                size="md"
                className="hidden md:inline-flex text-white"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>

              <Button asChild variant={"white"} size="md">
                <Link href="/register">Join Now</Link>
              </Button>
            </>
          )}
          <MobileNavbar />
        </div>
      </div>
    </header>
  );
};
