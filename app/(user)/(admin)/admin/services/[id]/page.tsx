"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminService } from "@/lib/admin";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";
import {
  IconMail,
  IconExternalLink,
  IconClock,
  IconMapPin,
} from "@tabler/icons-react";
import { RenderDescription } from "@/components/text-editor/RenderDescription";

const DEFAULT_IMAGE = "/assets/images/profile-img.jpg";
const SERVICE_STATUSES = ["DRAFT", "ACTIVE", "PAUSED"];

export default function AdminServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchService = async () => {
    try {
      const data = await adminService.getServiceDetails(id as string);
      setService(data);
    } catch (error) {
      console.error("Failed to fetch service", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await adminService.updateServiceStatus(id as string, newStatus);
      toast.success("Service status updated");
      fetchService();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await adminService.deleteService(id as string);
      toast.success("Service deleted");
      fetchService();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  if (!service)
    return <div className="py-20 text-center">Service not found</div>;

  return (
    <div>
      <PageHeader
        back
        title={service.name}
        description={`${service.type} · ${service.deliveryMode}`}
        badges={[service.status]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Images */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Service Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {service.thumbnail && (
                  <div className="relative">
                    <Image
                      src={service.thumbnail}
                      alt="Thumbnail"
                      width={200}
                      height={200}
                      className="rounded-lg w-full aspect-square object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
                      Thumbnail
                    </span>
                  </div>
                )}
                {service.images?.map((url: string, i: number) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={url}
                      alt={`Image ${i + 1}`}
                      width={200}
                      height={200}
                      className="rounded-lg w-full aspect-square object-cover hover:opacity-80 transition-opacity"
                    />
                  </a>
                ))}
                {!service.thumbnail &&
                  (!service.images || service.images.length === 0) && (
                    <p className="text-sm text-muted-foreground col-span-full">
                      No images uploaded
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {service.shortDescription && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Short Description
                  </p>
                  <p className="text-sm">{service.shortDescription}</p>
                </div>
              )}

              {service.description && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Full Description
                  </p>
                  <div className="text-sm prose prose-sm max-w-none">
                    <RenderDescription json={service.description} />
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium">{service.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-semibold flex items-center">
                    <CurrencyIcon currency={service.currency || "NGN"} />
                    {Number(service.price).toLocaleString()}
                    {service.pricingType === "HOURLY" && (
                      <span className="text-xs text-muted-foreground ml-1">
                        /hr
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pricing Type</p>
                  <p className="font-medium">{service.pricingType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Delivery Mode</p>
                  <p className="font-medium">{service.deliveryMode}</p>
                </div>
                {service.duration && (
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium flex items-center gap-1">
                      <IconClock className="size-3.5" />
                      {service.duration} min
                    </p>
                  </div>
                )}
                {service.deliveryTimeline && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Delivery Timeline
                    </p>
                    <p className="font-medium">{service.deliveryTimeline}</p>
                  </div>
                )}
                {service.location && (
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <IconMapPin className="size-3.5" />
                      {service.location}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Revisions</p>
                  <p className="font-medium">{service.revisions || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bookings</p>
                  <p className="font-medium">{service._count?.bookings || 0}</p>
                </div>
              </div>

              {service.cancellationPolicy && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Cancellation Policy
                    </p>
                    <p className="text-sm">{service.cancellationPolicy}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Manage Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                defaultValue={service.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!service.isDeleted && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  <Trash2 className="size-4 mr-1" />
                  Delete Service
                </Button>
              )}
              {service.isDeleted && (
                <Badge variant="destructive">Deleted</Badge>
              )}
            </CardContent>
          </Card>

          {/* Provider */}
          {service.user && (
            <Card className="gap-1">
              <CardHeader>
                <CardTitle className="text-base">Service Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/admin/users/${service.user.id}`}
                  className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                >
                  <Image
                    src={service.user.image || DEFAULT_IMAGE}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full size-10 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">
                      {service.user.firstName} {service.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {service.user.email}
                    </p>
                  </div>
                  <IconExternalLink className="size-4 text-muted-foreground shrink-0" />
                </Link>

                {service.professionalProfile && (
                  <div className="mt-2 p-2 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        {service.professionalProfile.businessName}
                      </span>
                    </p>
                    <p>{service.professionalProfile.profession}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={`mailto:${service.user.email}`}>
                      <IconMail className="size-4 mr-1" />
                      Email Provider
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meta */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Meta</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{formatDate(service.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated</span>
                <span>{formatDate(service.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Featured</span>
                <span>{service.isFeatured ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span>Slug</span>
                <span className="truncate ml-4">{service.slug}</span>
              </div>
              <div className="flex justify-between">
                <span>Currency</span>
                <span>{service.currency || "NGN"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
