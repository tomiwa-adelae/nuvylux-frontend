import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { PageHeader } from "@/app/(onboarding)/_components/PageHeader";

export default function page() {
  return (
    <div className="container">
      <Logo color="black" />
      <PageHeader
        title="Your Brand is Ready."
        description={
          "Welcome to the New Light of Luxury. Your brand identity has been forged and is now live within the NuvyLux ecosystem."
        }
      />
      <div className="mt-4 flex items-center justify-between gap-2">
        <Button className="flex-1" asChild>
          <Link href={"/dashboard"}>Enter dashboard</Link>
        </Button>
        <Button className="flex-1" variant={"secondary"} asChild>
          <Link href={"/marketplace"}>View marketplace</Link>
        </Button>
      </div>
      <p className="text-xs mt-6 text-center uppercase tracking-widest text-neutral-300 font-medium">
        NuvyLux — Curating Excellence
      </p>
    </div>
  );
}
