"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconArrowLeft,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandYoutube,
  IconExternalLink,
  IconMapPin,
  IconPackage,
  IconWorld,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { brandService, BrandDetail } from "@/lib/brand";
import { BRAND_CATEGORIES, DEFAULT_PROFILE_IMAGE } from "@/constants";
import { Product } from "@/types";
import { ProductCard } from "../../_components/ProductCard";
import { PageHeader } from "@/components/PageHeader";

const DEFAULT_BRAND_IMAGE = "/assets/images/profile-img.jpg";

function getSocialIcon(url: string) {
  if (url.includes("instagram.com")) return IconBrandInstagram;
  if (url.includes("twitter.com") || url.includes("x.com"))
    return IconBrandTwitter;
  if (url.includes("youtube.com")) return IconBrandYoutube;
  if (url.includes("linkedin.com")) return IconBrandLinkedin;
  if (url.includes("tiktok.com")) return IconBrandTiktok;
  return IconWorld;
}

function getSocialLabel(url: string) {
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("twitter.com") || url.includes("x.com")) return "Twitter";
  if (url.includes("youtube.com")) return "YouTube";
  if (url.includes("linkedin.com")) return "LinkedIn";
  if (url.includes("tiktok.com")) return "TikTok";
  return "Website";
}

// Map BrandProduct → Product shape expected by ProductCard
function toProduct(p: BrandDetail["products"][number]): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    shortDescription: p.shortDescription ?? "",
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? undefined,
    stock: p.stock,
    sku: p.sku,
    thumbnail: p.thumbnail ?? DEFAULT_BRAND_IMAGE,
    images: p.images,
    sizes: p.sizes,
    availableColors: p.availableColors ?? undefined,
    brandId: p.brandId,
    category: p.category,
    status: p.status as Product["status"],
    isFeatured: p.isFeatured,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    isSaved: false,
  };
}

export default function BrandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [brand, setBrand] = useState<BrandDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    brandService
      .getPublicBrandById(id)
      .then(setBrand)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <BrandDetailSkeleton />;

  if (notFound || !brand) {
    return (
      <div className="container py-24 flex flex-col items-center text-center gap-4">
        <p className="text-5xl">🏷️</p>
        <h2 className="text-xl font-semibold text-primary">Brand not found</h2>
        <p className="text-sm text-muted-foreground">
          This brand may have been removed or the link is incorrect.
        </p>
        <Button asChild variant="outline">
          <Link href="/brands">
            <IconArrowLeft size={16} className="mr-2" />
            Back to Brands
          </Link>
        </Button>
      </div>
    );
  }

  const categoryLabel =
    BRAND_CATEGORIES.find((c) => c.value === brand.brandType)?.label ??
    brand.brandType;

  const location =
    brand.user.city && brand.user.state
      ? `${brand.user.city}, ${brand.user.state}`
      : (brand.user.city ?? brand.user.state ?? null);

  const accentColor = brand.brandColor ?? "#000000";
  const products = brand.products.map(toProduct);

  return (
    <div>
      {/* ── Colour bar ── */}
      <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />

      <div className="container py-10 space-y-12">
        <PageHeader back title={brand.brandName} />

        {/* ── Hero ── */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
          {/* Logo */}
          <div
            className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-2xl overflow-hidden border-4 bg-white shrink-0"
            style={{ borderColor: accentColor }}
          >
            <Image
              src={brand.brandLogo || brand.user.image || DEFAULT_BRAND_IMAGE}
              alt={brand.brandName}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                {brand.brandName}
              </h1>
              <Badge variant="secondary" className="capitalize">
                {categoryLabel}
              </Badge>
            </div>

            {location && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <IconMapPin size={14} className="shrink-0" />
                {location}
              </p>
            )}

            {brand.description && (
              <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
                {brand.description}
              </p>
            )}

            {/* Links row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {brand.website && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconExternalLink size={14} className="mr-1.5" />
                    Website
                  </a>
                </Button>
              )}
              {brand.socials.map((social) => {
                const Icon = getSocialIcon(social.url);
                return (
                  <Button key={social.id} variant="outline" size="sm" asChild>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon size={14} className="mr-1.5" />
                      {getSocialLabel(social.url)}
                    </a>
                  </Button>
                );
              })}
            </div>

            {/* Owner row */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative h-7 w-7 rounded-full overflow-hidden bg-neutral-100 border shrink-0">
                <Image
                  src={brand.user.image || DEFAULT_PROFILE_IMAGE}
                  alt={`${brand.user.firstName} ${brand.user.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-muted-foreground">
                by{" "}
                <span className="font-medium text-foreground">
                  {brand.user.firstName} {brand.user.lastName}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Products ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">
              Products
              {products.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({products.length})
                </span>
              )}
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <IconPackage size={40} className="text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No products listed yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BrandDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-2 w-full rounded-none" />
      <div className="container py-10 space-y-12">
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
          <Skeleton className="h-36 w-36 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full max-w-2xl" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
