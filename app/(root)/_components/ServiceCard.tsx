// components/services/ServiceCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  IconMapPin,
  IconDeviceLaptop,
  IconRoute,
  IconStarFilled,
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

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export const ServiceCard = ({
  service,
  distance,
  averageRating,
  reviewCount,
}: {
  service: Service;
  distance?: number | null;
  averageRating?: number;
  reviewCount?: number;
}) => {
  const designerName =
    service.professionalProfile.businessName ||
    `${service?.professionalProfile?.user?.firstName} ${service?.professionalProfile?.user?.lastName}`;

  const providerCity =
    (service.professionalProfile.user as any)?.city ?? null;
  const providerState =
    (service.professionalProfile.user as any)?.state ?? null;
  const providerLocation =
    providerCity && providerState
      ? `${providerCity}, ${providerState}`
      : providerCity ?? providerState ?? null;

  return (
    <Card className="group transition-all p-0 border-none shadow-none hover:shadow-md rounded-2xl overflow-hidden">
      <CardContent className="px-0 relative">
        {/* ── Image ── */}
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

          {/* Top-left: type badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            <Badge variant="secondary">{service.type}</Badge>
          </div>

          {/* Bottom-left: delivery mode + distance */}
          <div className="absolute bottom-2 left-2 flex flex-col gap-1 items-start">
            <Badge className="flex items-center gap-1.5">
              {service.deliveryMode === "ONLINE" ? (
                <IconDeviceLaptop size={13} />
              ) : (
                <IconMapPin size={13} />
              )}
              <span className="capitalize">
                {service.deliveryMode.replace("_", " ").toLowerCase()}
              </span>
            </Badge>

            {/* Distance badge — only shown when we have a computed distance */}
            {typeof distance === "number" && distance !== null && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-white/90 text-primary border-primary/30 backdrop-blur-sm"
              >
                <IconRoute size={11} />
                {formatDistance(distance)}
              </Badge>
            )}
          </div>
        </div>

        {/* ── Info ── */}
        <div className="mt-3 space-y-2">
          <Link href={`/services/${service.slug}`}>
            <CardTitle className="font-semibold text-primary hover:underline truncate">
              {service.name}
            </CardTitle>
          </Link>

          {(reviewCount ?? 0) > 0 && (
            <div className="flex items-center gap-1">
              <IconStarFilled size={11} className="text-amber-400 shrink-0" />
              <span className="text-xs font-semibold">
                {averageRating!.toFixed(1)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                ({reviewCount})
              </span>
            </div>
          )}

          <CardDescription className="mt-1 line-clamp-2 text-sm">
            {service.shortDescription}
          </CardDescription>

          {/* Provider location */}
          {providerLocation && (
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <IconMapPin size={11} className="shrink-0" />
              {providerLocation}
            </p>
          )}

          {/* Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
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
              <span className="text-xs font-medium text-neutral-700 uppercase tracking-tight truncate max-w-22.5">
                {designerName}
              </span>
            </div>

            <div className="text-right shrink-0">
              <span className="block text-[10px] uppercase tracking-tighter text-neutral-400 font-bold">
                From
              </span>
              <span className="text-base font-semibold tracking-tight">
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
