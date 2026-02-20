import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { maskEmail } from "@/lib/utils";
import Link from "next/link";

// searchParams only exist at request time, never at build time
export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  email: string;
}>;

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { email } = await searchParams;

  return (
    <div className="py-32 w-full">
      <div className="container">
        <div className="md:hidden flex items-center justify-center mb-3">
          <Logo color="black" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl mb-4 font-medium">
            Password Reset Complete!
          </h1>
          <p className="text-sm text-muted-foreground">
            Your password has been successfully updated for{" "}
            <span className="font-medium">{maskEmail(email)}</span>
          </p>
        </div>
        <Button className="w-full mt-4">
          <Link href={"/login"}>Login now</Link>
        </Button>
      </div>
    </div>
  );
};

export default page;
