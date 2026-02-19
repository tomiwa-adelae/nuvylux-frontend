"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { serviceService } from "@/lib/services";
import { ServiceCard } from "./ServiceCard";
import { Service } from "@/types";

export const FeaturedServices = () => {
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

  if (!loading && services.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-2">
              Expert Professionals
            </p>
            <h2 className="font-semibold text-2xl md:text-3xl 2xl:text-4xl text-gray-900">
              Book a Service
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Discover and book verified beauty &amp; fashion professionals near
              you, backed by real reviews.
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/services" className="flex items-center gap-2">
              View all services
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => <ServiceSkeleton key={i} />)
            : services
                .slice(0, 8)
                .map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
        </div>

        {!loading && services.length > 8 && (
          <div className="text-center mt-10">
            <Button asChild>
              <Link href="/services">View All {services.length}+ Services</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

const ServiceSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-1/3" />
  </div>
);
