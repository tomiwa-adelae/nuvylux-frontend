// components/services/ServiceCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  IconClock,
  IconMapPin,
  IconArrowUpRight,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types";
import { DEFAULT_IMAGE, DEFAULT_PROFILE_IMAGE } from "@/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { CurrencyIcon } from "@/components/CurrencyIcon";

export const ServiceCard = ({ service }: { service: Service }) => {
  const designerName =
    service.professionalProfile.businessName ||
    `${service?.professionalProfile?.user?.firstName} ${service?.professionalProfile?.user?.lastName}`;

  return (
    <Card className="group transition-all p-0 border-none shadow-none hover:shadow-md rounded-2xl overflow-hidden">
      <CardContent className="px-0 relative">
        <div className="relative p-0 aspect-square overflow-hidden rounded-2xl bg-neutral-100">
          <Link
            href={`/services/${service.slug}`}
            className="block relative aspect-square overflow-hidden rounded-xl bg-gray-100"
          >
            <Image
              src={service.thumbnail || DEFAULT_IMAGE}
              alt={service.name}
              fill
              className="object-cover aspect-square transition-transform duration-500 group-hover:scale-110"
            />
          </Link>

          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <Badge variant={"secondary"}>{service.type}</Badge>
          </div>

          <Badge className="absolute flex items-center gap-1.5 bottom-2 left-2">
            {service.deliveryMode === "ONLINE" ? (
              <IconDeviceLaptop size={14} />
            ) : (
              <IconMapPin size={14} />
            )}
            <span className="capitalize">
              {service.deliveryMode.toLowerCase()}
            </span>
          </Badge>
        </div>

        <div className="mt-3 space-y-3">
          <Link href={`/services/${service.slug}`}>
            <CardTitle className="font-semibold text-primary hover:underline truncate">
              {service.name}
            </CardTitle>
          </Link>

          <CardDescription className="mt-1.5 line-clamp-2">
            {service.shortDescription}
          </CardDescription>

          <div className="pt-4 flex items-center justify-between border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200">
                <Image
                  src={
                    service?.professionalProfile?.user?.image ||
                    DEFAULT_PROFILE_IMAGE
                  }
                  alt={designerName}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-medium text-neutral-700 uppercase tracking-tight">
                {designerName}
              </span>
            </div>

            <div className="text-right">
              <span className="block text-[10px] uppercase tracking-tighter text-neutral-400 font-bold">
                From
              </span>
              <span className="text-lg font-semibold tracking-tight">
                <CurrencyIcon currency="NGN" />
                {Number(service.price).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
