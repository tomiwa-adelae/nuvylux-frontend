"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Brand, brandService } from "@/lib/brand";
import { BRAND_CATEGORIES } from "@/constants";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";
import { cn } from "@/lib/utils";

type CategoryValue = (typeof BRAND_CATEGORIES)[number]["value"];

export const BrandCategorySection = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryValue | "all">(
    "all"
  );

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await brandService.getPublicBrands();
        setBrands(data);
      } catch {
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const displayed =
    activeCategory === "all"
      ? brands
      : brands.filter((b) => b.brandType === activeCategory);

  if (!loading && brands.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-2">
              Our Brands
            </p>
            <h2 className="font-semibold text-2xl md:text-3xl 2xl:text-4xl text-gray-900">
              Shop by Brand
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Discover verified fashion and beauty brands across every category.
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/brands" className="flex items-center gap-2">
              View all brands <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
              activeCategory === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-input text-muted-foreground hover:border-primary/40"
            )}
          >
            All
          </button>
          {BRAND_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input text-muted-foreground hover:border-primary/40"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Brand grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <BrandTileSkeleton key={i} />
              ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No brands in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayed.slice(0, 12).map((brand) => (
              <BrandTile key={brand.id} brand={brand} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="sm:hidden text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/brands">View all brands</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

function BrandTile({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.id}`}
      className="group flex flex-col items-center gap-2 text-center"
    >
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 group-hover:border-primary/40 transition-colors">
        <Image
          src={brand.brandLogo || brand.user.image || DEFAULT_PROFILE_IMAGE}
          alt={brand.brandName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="text-sm font-medium truncate w-full">{brand.brandName}</p>
    </Link>
  );
}

function BrandTileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
