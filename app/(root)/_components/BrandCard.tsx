"use client";

import Image from "next/image";
import Link from "next/link";
import { IconMapPin } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brand } from "@/lib/brand";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";
import { BRAND_CATEGORIES } from "@/constants";

const DEFAULT_BRAND_BG = "/assets/images/profile-img.jpg";

export const BrandCard = ({ brand }: { brand: Brand }) => {
  const categoryLabel =
    BRAND_CATEGORIES.find((c) => c.value === brand.brandType)?.label ??
    brand.brandType;

  const location =
    brand.user.city && brand.user.state
      ? `${brand.user.city}, ${brand.user.state}`
      : brand.user.city ?? brand.user.state ?? null;

  return (
    <Card className="group transition-all p-0 border-none shadow-none hover:shadow-md rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Logo / Cover */}
        <Link href={`/brands/${brand.id}`} className="block">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={brand.brandLogo || brand.user.image || DEFAULT_BRAND_BG}
              alt={brand.brandName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Category badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="capitalize">
                {categoryLabel}
              </Badge>
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <Link href={`/brands/${brand.id}`}>
            <p className="font-semibold text-primary hover:underline truncate">
              {brand.brandName}
            </p>
          </Link>

          {brand.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {brand.description}
            </p>
          )}

          {location && (
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground pt-0.5">
              <IconMapPin size={11} className="shrink-0" />
              {location}
            </p>
          )}

          {/* Owner row */}
          <div className="pt-2 flex items-center gap-2 border-t border-neutral-100">
            <div className="relative h-6 w-6 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
              <Image
                src={brand.user.image || DEFAULT_PROFILE_IMAGE}
                alt={`${brand.user.firstName} ${brand.user.lastName}`}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium text-neutral-600 truncate">
              {brand.user.firstName} {brand.user.lastName}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
