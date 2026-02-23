"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/PageHeader";
import { BrandCard } from "../_components/BrandCard";
import { brandService, Brand } from "@/lib/brand";
import { BRAND_CATEGORIES } from "@/constants";
import { IconSearch, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function BrandsPage() {
  return (
    <Suspense>
      <BrandsContent />
    </Suspense>
  );
}

function BrandsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("brandType") ?? ""
  );

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const data = await brandService.getPublicBrands({
        search: search || undefined,
        brandType: activeCategory || undefined,
      });
      setBrands(data);
    } catch {
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory]);

  // Sync URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (activeCategory) params.set("brandType", activeCategory);
    router.replace(`/brands?${params.toString()}`, { scroll: false });
  }, [search, activeCategory, router]);

  useEffect(() => {
    const timer = setTimeout(() => fetchBrands(), 300);
    return () => clearTimeout(timer);
  }, [fetchBrands]);

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("");
  };

  const hasFilters = search || activeCategory;

  return (
    <div className="container py-12 space-y-8">
      <PageHeader
        back
        title="Explore Brands"
        description="Discover curated fashion, beauty, and lifestyle brands on Nuvylux"
      />

      {/* ── Search ── */}
      <div className="relative max-w-lg">
        <IconSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <IconX size={14} />
          </button>
        )}
      </div>

      {/* ── Category pills ── */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeCategory === "" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setActiveCategory("")}
        >
          All
        </Button>
        {BRAND_CATEGORIES.map((cat) => (
          <Button
            key={cat.value}
            variant={activeCategory === cat.value ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() =>
              setActiveCategory(
                activeCategory === cat.value ? "" : cat.value
              )
            }
          >
            {cat.label}
          </Button>
        ))}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-muted-foreground"
            onClick={clearFilters}
          >
            <IconX size={13} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* ── Result count ── */}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          {brands.length} {brands.length === 1 ? "brand" : "brands"} found
        </p>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <BrandSkeleton key={i} />
            ))}
        </div>
      ) : brands.length === 0 ? (
        <EmptyState hasFilters={!!hasFilters} onClear={clearFilters} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </div>
  );
}

function BrandSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="text-5xl">🏷️</div>
      <div>
        <h3 className="text-lg font-semibold text-primary">
          {hasFilters ? "No brands match your search" : "No brands yet"}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {hasFilters
            ? "Try a different keyword or category."
            : "Brands are joining every day — check back soon."}
        </p>
      </div>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
