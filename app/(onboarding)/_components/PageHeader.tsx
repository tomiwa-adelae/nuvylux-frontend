"use client";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string | any;
  description?: string | any;
  action?: ReactNode;
  back?: boolean;
}

export function PageHeader({
  title,
  description,
  action,
  back,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-4">
      <div className="flex items-start justify-start gap-2">
        {back && (
          <Button
            onClick={() => router.back()}
            size="icon"
            variant={"secondary"}
          >
            <IconArrowLeft />
          </Button>
        )}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0 md:items-center">
          <div>
            <h1 className="text-3xl lg:text-4xl font-medium mt-8">{title}</h1>
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="w-full md:w-auto">{action}</div>}
      </div>
    </div>
  );
}
