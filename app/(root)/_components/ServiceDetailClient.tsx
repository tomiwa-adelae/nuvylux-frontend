"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  IconClock,
  IconCalendar,
  IconRotate,
  IconCheck,
  IconMapPin,
  IconDeviceLaptop,
  IconShieldCheck,
  IconArrowLeft,
} from "@tabler/icons-react";
import { serviceService } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Service } from "@/types";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { formatMoneyInput } from "@/lib/utils";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";
import { Separator } from "@/components/ui/separator";

export const ServiceDetailClient = () => {
  const { slug } = useParams();
  const [service, setService] = useState<Service>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await serviceService.getPublicServiceDetails(
          slug as string,
        );
        setService(data);
      } catch (error) {
        console.error("Error loading service", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [slug]);

  if (loading) return <ServiceDetailSkeleton />;
  if (!service)
    return <div className="py-20 text-center">Service not found.</div>;

  return (
    <div className="py-12 container">
      <PageHeader
        title={service.name}
        back
        description={service.shortDescription}
        badges={[service.type, service.deliveryMode]}
      />

      <div className="grid mt-6 grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: CONTENT (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-neutral-100">
            <Image
              src={service.thumbnail}
              alt={service.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Core Description (Rendered from Rich Text) */}
          <section>
            <h2 className="text-2xl font-semibold mb-1.5">Service Overview</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              <RenderDescription json={service.description} />
            </p>
          </section>

          <Separator className="my-10" />

          {/* Gallery Grid */}
          {service.images?.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-semibold text-2xl">Visual References</h2>
              <div className="grid grid-cols-2 gap-2">
                {service.images.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-2xl overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt="Gallery"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY BOOKING CARD (4 Cols) */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24">
            <CardContent>
              <CardDescription className="uppercase mb-1">
                Service Fee
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                <CurrencyIcon currency="NGN" />
                {formatMoneyInput(service.price)}
              </CardTitle>

              <div className="space-y-2.5 mt-2">
                <div className="flex items-center gap-1 text-sm">
                  <IconClock className="size-4 text-muted-foreground" />
                  <span>
                    Estimated:{" "}
                    <span className="font-medium">
                      {service.deliveryTimeline}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <IconRotate className="size-4 text-muted-foreground" />
                  <span>
                    <span className="font-medium">{service.revisions}</span>{" "}
                    Revisions included
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {service.deliveryMode === "ONLINE" ? (
                    <IconDeviceLaptop className="size-4 text-muted-foreground" />
                  ) : (
                    <IconMapPin className="size-4 text-neutral-400" />
                  )}
                  <span>
                    Format:{" "}
                    <span className="capitalize font-medium">
                      {service.deliveryMode.toLowerCase()}
                    </span>
                  </span>
                </div>
              </div>

              <Button asChild className="mt-4 w-full">
                <Link href={`/services/${service.slug}/book`}>
                  Reserve Service
                </Link>
              </Button>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <div className="relative size-10 rounded-full overflow-hidden">
                    <Image
                      src={
                        service.professionalProfile.user?.image ||
                        DEFAULT_PROFILE_IMAGE
                      }
                      alt="Pro"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">
                      Managed by
                    </p>
                    <p className="font-semibold -mt-1 text-lg">
                      {service.professionalProfile.businessName}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl text-sm text-muted-foreground border border-input italic">
                  {service.bookingRules ? (
                    <RenderDescription json={service?.bookingRules} />
                  ) : (
                    "Standard professional booking rules apply."
                  )}
                </div>
              </div>

              <div className="flex items-center mt-2 justify-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <IconShieldCheck size={14} />
                Secure Booking Protection
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ServiceDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-20 space-y-10 animate-pulse">
    <Skeleton className="h-10 w-1/2" />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-8 space-y-6">
        <Skeleton className="aspect-video w-full rounded-3xl" />
        <Skeleton className="h-40 w-full" />
      </div>
      <div className="lg:col-span-4">
        <Skeleton className="h-[500px] w-full rounded-3xl" />
      </div>
    </div>
  </div>
);
