"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  IconClock,
  IconMapPin,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { formatMoneyInput } from "@/lib/utils";
import { CurrencyIcon } from "@/components/CurrencyIcon";

export const ServiceList = ({ services, onUpdate }: { services: any[]; onUpdate: () => void }) => {
  return (
    // Grid layout to match product browsing
    <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2">
      {services.map((service) => (
        <Card key={service.id} className="p-0 overflow-hidden group">
          <CardContent className="p-1.5 relative">
            {/* Actions Menu - Floating top right */}
            <div className="absolute top-3 right-3 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <IconDotsVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <IconEdit className="mr-2 size-4" /> Edit Service
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <IconTrash className="mr-2 size-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Service Image */}
            <Link href={`/dashboard/services/${service.slug}`}>
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src={service.thumbnail || "/api/placeholder/400/400"}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {/* Status Badge Overlaid on Image */}
                <div className="absolute bottom-2 left-2">
                  <Badge
                    className="capitalize shadow-sm"
                    variant={
                      service.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {service.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </Link>

            {/* Content Area */}
            <div className="mt-2 pb-2 px-1 space-y-1">
              <div className="flex items-center justify-between">
                <CardDescription className="hidden lg:block text-xs font-medium">
                  {service.type}
                </CardDescription>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <IconClock className="size-3" /> {service.duration} mins
                </span>
              </div>

              <Link href={`/dashboard/services/${service.slug}`}>
                <CardTitle className="text-primary truncate hover:underline">
                  {service.name}
                </CardTitle>
              </Link>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-0.5 text-sm font-bold">
                  <CurrencyIcon currency="NGN" />
                  <span>{formatMoneyInput(service.price)}</span>
                  {service.pricingType === "HOURLY" && (
                    <span className="text-[10px] text-muted-foreground font-normal ml-0.5">
                      /hr
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium uppercase">
                  <IconMapPin className="size-3" />
                  {service.deliveryMode}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
