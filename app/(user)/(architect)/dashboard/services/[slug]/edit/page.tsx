"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import {
  IconChevronLeft,
  IconDeviceFloppy,
  IconPhoto,
  IconX,
  IconClock,
  IconMapPin,
  IconRefresh,
  IconPackage,
  IconUsers,
  IconTool,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import api from "@/lib/api";
import { base64ToFile } from "@/lib/utils";
import { DEFAULT_IMAGE } from "@/constants";
import { ServiceSchema, ServiceSchemaType } from "@/lib/zodSchemas";
import { Loader } from "@/components/Loader";
import { MultiImageUploader } from "@/app/(user)/(client)/_components/MultiImageUploader";

import { PageHeader } from "@/components/PageHeader";
import { RichTextEditor } from "@/components/text-editor/Editor";
import { Service, ServiceType } from "@/types";
import { serviceService } from "@/lib/services";
import { CurrencyIcon } from "@/components/CurrencyIcon";

const page = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<Service | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!slug) return;
    const fetchService = async () => {
      try {
        const data = await serviceService.getMyServicesDetails(slug as string);
        setService(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load service");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  const form = useForm<ServiceSchemaType>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: "",
      pricingType: "FIXED",
      currency: "NGN",
      type: "CONSULTATION",
      deliveryMode: "ONLINE",
      duration: "",
      deliveryTimeline: "",
      location: "",
      revisions: "",
      cancellationPolicy: "",
      status: "DRAFT",
      images: [],
      thumbnail: "",
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        shortDescription: service.shortDescription,
        description: service.description,
        price: service.price?.toString() || "",
        images: service.images,
        thumbnail: service.thumbnail || "",
        status: service.status as any,
        type: service.type as any,
        deliveryMode: service.deliveryMode,
        location: service.location || "",
        currency: (service.currency as any) || "NGN",
        pricingType: service.pricingType as any,
        duration: service.duration?.toString() as any,
        revisions: service.revisions?.toString(),
        cancellationPolicy: service.cancellationPolicy || "",
      });
    }
  }, [service, form]);

  // Watch for Preview
  const watchedName = form.watch("name");
  const watchedPrice = form.watch("price");
  const watchedThumbnail = form.watch("thumbnail");
  const watchedType = form.watch("type");
  const watchedDeliveryMode = form.watch("deliveryMode");
  const watchedPricingType = form.watch("pricingType");
  const watchedShortDesc = form.watch("shortDescription");

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("thumbnail", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const isBase64 = (str: string) => {
    return str.startsWith("data:image");
  };

  const onSubmit = async (data: ServiceSchemaType) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        // 1. Append basic text fields
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("shortDescription", data.shortDescription);
        formData.append("type", data.type);
        formData.append("deliveryMode", data.deliveryMode);
        formData.append("currency", data.currency);
        formData.append("price", data.price);
        formData.append("status", data.status || "DRAFT");
        formData.append("pricingType", data.pricingType);

        if (data.duration) {
          formData.append("duration", data.duration);
        }

        if (data.deliveryTimeline) {
          formData.append("deliveryTimeline", data.deliveryTimeline);
        }
        if (data.revisions) {
          formData.append("revisions", data.revisions);
        }
        if (data.cancellationPolicy) {
          formData.append("cancellationPolicy", data.cancellationPolicy);
        }

        // 2. Handle Thumbnail (Check if it's a new Base64 or old URL)
        if (data.thumbnail.startsWith("data:image")) {
          const thumbFile = base64ToFile(data.thumbnail, "product-thumb.png");
          formData.append("thumbnail", thumbFile);
        } else {
          // If it's a URL, your backend needs to know to keep the existing one
          formData.append("existingThumbnail", data.thumbnail);
        }

        // 3. Handle Gallery Images
        const newImages: string[] = [];
        const existingImages: string[] = [];

        data.images.forEach((img) => {
          if (img.startsWith("data:image")) {
            newImages.push(img);
          } else {
            existingImages.push(img);
          }
        });

        // Append existing URLs so the backend knows which ones were kept
        formData.append("existingImages", JSON.stringify(existingImages));

        // Append new files
        newImages.forEach((base64, index) => {
          const file = base64ToFile(base64, `gallery-new-${index}.png`);
          formData.append("images", file);
        });

        // 5. Send to API (Do NOT set Content-Type header manually, the browser will do it)
        const res = await api.patch(`/services/${service?.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success(res.data.message || "Services updated successfully!");
        router.push(`/dashboard/services/${res.data.service.slug}`);
      } catch (error: any) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to update services",
        );
      }
    });
  };

  if (loading)
    return <div className="p-10 text-center">Loading Service...</div>;
  if (!service)
    return <div className="p-10 text-center">Service not found.</div>;

  return (
    <div>
      <PageHeader
        back
        title="Create Service"
        description={"Showcase your professional expertise"}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          <div className="lg:col-span-1">
            <Card className="sticky p-0 overflow-hidden top-20">
              <CardContent className="p-2">
                <div className="rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={
                      watchedThumbnail || service?.thumbnail || DEFAULT_IMAGE
                    }
                    alt="Preview"
                    width={1000}
                    height={1000}
                    className="aspect-auto size-full object-cover transition-all"
                  />
                </div>
                <div className="mt-2.5 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold line-clamp-2">
                      {watchedName || "Service Title"}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {watchedShortDesc || "Short description appears here..."}
                    </p>
                  </div>

                  <div className="flex items-end justify-between pt-2 border-t border-neutral-100">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        {watchedPricingType === "HOURLY"
                          ? "Per Hour"
                          : "Fixed Price"}
                      </p>
                      <p className="text-lg text-primary font-bold">
                        {form.watch("currency") === "NGN" ? (
                          <CurrencyIcon currency="NGN" />
                        ) : (
                          form.watch("currency")
                        )}{" "}
                        {watchedPrice
                          ? Number(watchedPrice).toLocaleString()
                          : "0"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs bg-neutral-100 px-3 py-1.5 rounded-full">
                        {watchedDeliveryMode === "ONLINE" && "🌐 Online"}
                        {watchedDeliveryMode === "IN_PERSON" && "📍 In-Person"}
                        {watchedDeliveryMode === "HYBRID" && "🔄 Hybrid"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* LEFT: FORM FIELDS */}
          <div className="lg:col-span-2 space-y-4">
            {/* Media Section */}
            <Card>
              <CardHeader>
                <CardTitle>Service Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail</FormLabel>
                      <FormControl>
                        {!field.value || !service?.thumbnail ? (
                          <div
                            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                              isDragging
                                ? "border-black bg-neutral-50"
                                : "border-neutral-200 hover:border-neutral-400"
                            }`}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file) handleFile(file);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <IconPhoto
                              size={48}
                              className="mx-auto text-muted-foreground mb-3 stroke-[1]"
                            />
                            <p className="text-sm font-medium mb-1">
                              Click or drag to upload cover image
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Recommended: 1200 x 800px
                            </p>
                          </div>
                        ) : (
                          <div className="relative rounded-2xl overflow-hidden border border-input aspect-video">
                            <Image
                              src={field.value}
                              alt="Cover"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-3 right-3 rounded-full"
                              onClick={() => form.setValue("thumbnail", "")}
                            >
                              <IconX size={16} />
                            </Button>
                          </div>
                        )}
                      </FormControl>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] && handleFile(e.target.files[0])
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Portfolio Gallery
                        <span className="text-muted-foreground">
                          (Max 6 images)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <MultiImageUploader
                          value={field.value}
                          onChange={field.onChange}
                          maxImages={6}
                        />
                      </FormControl>
                      <FormDescription>
                        Showcase your previous work or examples
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Professional Bridal Makeup"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="One sentence to grab attention..."
                          maxLength={120}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-neutral-400">
                        <FormMessage />
                        <span>{field.value?.length || 0}/120</span>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Description{" "}
                        <span className="text-neutral-400 normal-case">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <RichTextEditor field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Service Type & Delivery */}
            <Card>
              <CardHeader>
                <CardTitle>Service Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-1"
                        >
                          {[
                            {
                              value: "CONSULTATION",
                              label: "Consultation",
                              icon: IconUsers,
                              desc: "1-on-1 session",
                            },
                            {
                              value: "DELIVERABLE",
                              label: "Deliverable",
                              icon: IconPackage,
                              desc: "Project work",
                            },
                            {
                              value: "PROJECT",
                              label: "Project",
                              icon: IconTool,
                              desc: "Full service",
                            },
                          ].map((type) => (
                            <div key={type.value}>
                              <RadioGroupItem
                                value={type.value}
                                id={type.value}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={type.value}
                                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary peer-data-[state=checked]:bg-neutral-50 hover:border-neutral-400"
                              >
                                <type.icon size={24} stroke={1.2} />
                                <div className="text-center">
                                  <p className="text-xs font-semibold uppercase tracking-widest">
                                    {type.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {type.desc}
                                  </p>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Mode *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="ONLINE">
                            Online / Remote
                          </SelectItem>
                          <SelectItem value="IN_PERSON">In-Person</SelectItem>
                          <SelectItem value="HYBRID">Hybrid (Both)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchedDeliveryMode === "IN_PERSON" ||
                  (watchedDeliveryMode === "HYBRID" && (
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <IconMapPin
                              size={14}
                              className="inline mr-1 mb-0.5"
                            />
                            Location
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Lagos, Nigeria"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
              </CardContent>
            </Card>

            {/* Pricing & Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NGN">NGN</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pricingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Model</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="FIXED">Fixed Price</SelectItem>
                          <SelectItem value="HOURLY">Hourly Rate</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {watchedType === "CONSULTATION" && (
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <IconClock size={14} className="inline mr-1 mb-0.5" />
                          Session Duration (minutes)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="60" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(watchedType === "DELIVERABLE" ||
                  watchedType === "PROJECT") && (
                  <FormField
                    control={form.control}
                    name="deliveryTimeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Timeline</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 3-5 business days"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Service Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="revisions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <IconRefresh size={14} className="inline mb-0.5" />
                        Number of Revisions
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        How many changes can clients request?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cancellationPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Cancellation Policy
                        <span className="text-muted-foreground">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="e.g., 24 hours notice required for full refund..."
                          maxLength={500}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-neutral-400">
                        <FormMessage />
                        <span>{field.value?.length || 0}/500</span>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="PAUSED">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <Loader text="Saving..." />
                ) : (
                  <>
                    <IconDeviceFloppy />
                    Save Service
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default page;
