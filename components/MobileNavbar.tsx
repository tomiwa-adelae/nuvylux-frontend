"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconLogout, IconMenu2, IconMoon, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { homeNavLinksMobile } from "@/constants/nav-links";
import { useTheme } from "next-themes";

export function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (slug: string) =>
    pathname === slug || pathname.startsWith(`${slug}/`);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="text-white" size={"icon"} variant="ghost">
          <IconMenu2 />
        </Button>
      </SheetTrigger>
      <SheetContent className="h-screen">
        <SheetHeader>
          <div className="flex items-center justify-between gap-2">
            <Link href={"/"} className="flex items-center">
              <Logo color={"black"} />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              <IconSun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <IconMoon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="overflow-y-auto">
          <div className="grid gap-1 container">
            {homeNavLinksMobile.map(
              ({ icon, slug, label, comingSoon }, index) => {
                const Icon = icon;
                return comingSoon ? (
                  <Button
                    className="justify-start"
                    key={index}
                    variant="ghost"
                    disabled
                  >
                    <Icon />
                    {label}
                    <Badge variant={"secondary"}>Soon</Badge>
                  </Button>
                ) : (
                  <Button
                    className="justify-start"
                    key={index}
                    asChild
                    variant={isActive(slug) ? "default" : "ghost"}
                    onClick={handleLinkClick}
                  >
                    <Link href={slug}>
                      <Icon />
                      {label}
                    </Link>
                  </Button>
                );
              }
            )}
          </div>
        </ScrollArea>
        <SheetFooter className="mb-12">
          <Button asChild variant={"secondary"}>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href={"/register"}>Join now</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
