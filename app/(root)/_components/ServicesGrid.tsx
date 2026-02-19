// components/services/ServicesGrid.tsx
"use client";

import React, { useEffect, useState } from "react";
import { serviceService } from "@/lib/services";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "./ServiceCard";
import { Service } from "@/types";

export const ServicesGrid = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getExploreServices();
        setServices(data);
      } catch (error) {
        console.error("Failed to load services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (!loading && services.length === 0) return null; // Hide section if empty

  return (
    <section className="py-20 container">
      <div>
        <h2 className="font-semibold text-2xl md:text-3xl 2xl:text-4xl text-primary text-center mb-2">
          Featured Services
        </h2>
        <p className="text-base text-center text-muted-foreground mb-8">
          Expert-led architectural solutions for your next project.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {loading
          ? Array(5)
              .fill(0)
              .map((_, i) => <ServiceSkeleton key={i} />)
          : services
              .slice(0, 6)
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
      </div>
    </section>
  );
};

const ServiceSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);
