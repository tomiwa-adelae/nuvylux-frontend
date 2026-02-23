// components/services/ServicesGrid.tsx
"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { serviceService } from "@/lib/services";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "./ServiceCard";
import { Service } from "@/types";
import {
  ServiceFilters,
  ServiceFiltersState,
  DEFAULT_FILTERS,
} from "./ServiceFilters";
import { useUserLocation } from "@/hooks/useUserLocation";

type ServiceWithDistance = Service & { distance: number | null };

function buildParams(
  filters: ServiceFiltersState,
  location: { lat: number | null; lng: number | null; city: string | null; state: string | null }
) {
  const params: Record<string, string> = {};

  if (filters.search) params.search = filters.search;
  if (filters.type) params.type = filters.type;
  if (filters.deliveryMode) params.deliveryMode = filters.deliveryMode;
  if (filters.priceMin) params.priceMin = filters.priceMin;
  if (filters.priceMax) params.priceMax = filters.priceMax;
  if (filters.sortBy) params.sortBy = filters.sortBy;

  // Pass coordinates when available (enables server-side distance calc)
  if (location.lat !== null && location.lng !== null) {
    params.lat = String(location.lat);
    params.lng = String(location.lng);
  } else {
    // Fall back to city/state text matching
    if (location.city) params.city = location.city;
    if (location.state) params.state = location.state;
  }

  // Radius only makes sense with coordinates
  if (filters.radius && location.lat !== null) {
    params.radius = filters.radius;
  }

  return params;
}

export const ServicesGrid = () => {
  const [services, setServices] = useState<ServiceWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ServiceFiltersState>(DEFAULT_FILTERS);

  const { location, refreshLocation, setManualLocation } = useUserLocation();

  // Fetch whenever filters or location changes
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildParams(filters, {
        lat: location.lat,
        lng: location.lng,
        city: location.city,
        state: location.state,
      });
      const data = await serviceService.getExploreServices(params);
      setServices(data);
    } catch (error) {
      console.error("Failed to load services", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [filters, location.lat, location.lng, location.city, location.state]);

  // Refetch when location finishes loading or filters change
  const prevLocationLoadingRef = useRef(location.loading);
  useEffect(() => {
    const wasLoading = prevLocationLoadingRef.current;
    prevLocationLoadingRef.current = location.loading;

    // Fetch as soon as location resolves, or whenever filters change
    if (!location.loading) {
      fetchServices();
    } else if (wasLoading && location.loading) {
      // still loading, wait
    } else {
      // location not loading yet — fetch anyway with whatever we have
      fetchServices();
    }
  }, [fetchServices, location.loading]);

  const hasActiveFilters =
    filters.search ||
    filters.type ||
    filters.deliveryMode ||
    filters.priceMin ||
    filters.priceMax ||
    filters.radius ||
    filters.sortBy !== "newest";

  return (
    <section className="py-12 container space-y-8">
      {/* ── Filter bar ── */}
      <ServiceFilters
        filters={filters}
        onChange={setFilters}
        location={location}
        onRefreshLocation={refreshLocation}
        onManualLocation={setManualLocation}
        resultCount={services.length}
        loading={loading}
      />

      {/* ── Results ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <ServiceSkeleton key={i} />
            ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState hasFilters={!!hasActiveFilters} />
      ) : (
        <>
          {/* Show nearest-label when sorting by distance */}
          {filters.sortBy === "distance" && (
            <p className="text-xs text-muted-foreground">
              Sorted by distance from your location
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                distance={service.distance}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

// ─── Skeletons ────────────────────────────────────────────────────────────────

const ServiceSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="text-5xl">🔍</div>
      <div>
        <h3 className="text-lg font-semibold text-primary">
          {hasFilters ? "No services match your filters" : "No services yet"}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          {hasFilters
            ? "Try adjusting your search or expanding your location radius."
            : "Check back soon — providers are joining every day."}
        </p>
      </div>
    </div>
  );
}
