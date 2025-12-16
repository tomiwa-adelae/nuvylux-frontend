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
import { homeNavLinksMobile } from "@/constants";
import { IconLogout, IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

export function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);
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
          <Link href={"/"} className="flex items-center">
            <Logo color={"black"} />
          </Link>
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
        <SheetFooter className="mb-10">
          <Button variant={"secondary"}>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href={"/create-account"}>Join now</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
