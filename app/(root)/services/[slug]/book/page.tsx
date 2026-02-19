"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { saveFiles, getFiles, clearFiles } from "@/lib/fileStorage";
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  ChevronRight,
  FileText,
  X,
  File,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { Service } from "@/types";
import { serviceService } from "@/lib/services";
import { Loader } from "@/components/Loader";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookingServiceSchema,
  BookingServiceSchemaType,
} from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CurrencyIcon } from "@/components/CurrencyIcon";

const BookingPage = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);

  const searchParams = useSearchParams();
  const navigatedBack = searchParams.get("navigated") === "true";

  const form = useForm<BookingServiceSchemaType>({
    resolver: zodResolver(BookingServiceSchema),
    defaultValues: {
      date: "",
      time: "",
      requirements: "",
      images: [],
    },
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // 1. Fetch the actual service details from API
        const data = await serviceService.getPublicServiceDetails(
          slug as string,
        );
        setService(data);

        // 2. Only restore draft when navigating back from review page
        if (navigatedBack) {
          const savedRaw = localStorage.getItem("pending_booking");
          if (savedRaw) {
            const savedData = JSON.parse(savedRaw);
            if (savedData.serviceId === data.id) {
              form.reset({
                date: savedData.date || "",
                time: savedData.time || "",
                requirements: savedData.requirements || "",
                images: [],
              });
            }
          }
        } else {
          // Fresh visit — clear stale data from previous booking attempts
          localStorage.removeItem("pending_booking");
          clearFiles(data.id);
        }
      } catch (error) {
        console.error("Error loading service", error);
        toast.error("Could not load service details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug, form]); // Adding form to dependency array ensures reset works reliably

  useEffect(() => {
    if (!service || !navigatedBack) return;

    const restoreFiles = async () => {
      const storedFiles = await getFiles(service.id);
      if (storedFiles.length > 0) {
        form.setValue("images", storedFiles);
      }
    };

    restoreFiles();
  }, [service, form, navigatedBack]);

  //   const handleFiles = (files: FileList | null) => {
  //     if (!files) return;

  //     const fileArray = Array.from(files);
  //     const currentFiles = form.watch("images") || [];

  //     // Check if adding these files would exceed the limit
  //     if (currentFiles.length + fileArray.length > 6) {
  //       toast.error("Maximum 6 files allowed");
  //       return;
  //     }

  //     // Check file size (10MB max per file)
  //     const oversizedFiles = fileArray.filter(
  //       (file) => file.size > 10 * 1024 * 1024,
  //     );
  //     if (oversizedFiles.length > 0) {
  //       toast.error("Some files exceed 10MB limit");
  //       return;
  //     }

  //     form.setValue("images", [...currentFiles, ...fileArray]);
  //   };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !service) return;

    const fileArray = Array.from(files);
    const currentFiles = form.watch("images") || [];

    if (currentFiles.length + fileArray.length > 6) {
      toast.error("Maximum 6 files allowed");
      return;
    }

    const oversizedFiles = fileArray.filter(
      (file) => file.size > 10 * 1024 * 1024,
    );

    if (oversizedFiles.length > 0) {
      toast.error("Some files exceed 10MB limit");
      return;
    }

    const updatedFiles = [...currentFiles, ...fileArray];

    form.setValue("images", updatedFiles);

    // ✅ Persist files
    await saveFiles(service.id, updatedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    const currentFiles = form.watch("images") || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("images", updatedFiles);
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    } else if (file.type === "application/pdf") {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else {
      return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const onSubmit = async (data: BookingServiceSchemaType) => {
    // Exclude images — File objects can't be serialized to JSON.
    // Files are already persisted in IndexedDB via saveFiles().
    const { images, ...rest } = data;
    const bookingSessionData = {
      ...rest,
      serviceId: service?.id,
      serviceName: service?.name,
      price: service?.price,
    };

    localStorage.setItem("pending_booking", JSON.stringify(bookingSessionData));
    router.push(`/services/${slug}/review?navigated=true`);
  };

  if (loading) return <Loader />;
  if (!service)
    return <div className="py-20 text-center">Service not found.</div>;

  return (
    <div className="py-12 container">
      <PageHeader
        back
        title="Book Service"
        description={`Complete your request for ${service.name}`}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4"
        >
          {/* LEFT: FORM FIELDS */}
          <div className="lg:col-span-2 space-y-4">
            {service.type === "CONSULTATION" && (
              <Card>
                <CardContent>
                  <CardTitle className="flex items-center gap-2 mb-6">
                    <Calendar className="text-primary size-4" /> Schedule
                    Session
                  </CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Slot</FormLabel>
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
                              <SelectItem value="09:00">09:00 AM</SelectItem>
                              <SelectItem value="13:00">01:00 PM</SelectItem>
                              <SelectItem value="16:00">04:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent>
                <CardTitle className="flex items-center gap-2 mb-4">
                  <FileText className="text-primary size-4" /> Requirements
                </CardTitle>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us about your project</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide details, goals, or specific questions..."
                            {...field}
                          />
                        </FormControl>
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
                          Reference Materials (Optional)
                          <span className="text-muted-foreground">
                            (Max 6 files)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <div>
                            {/* Upload Area */}
                            <div
                              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                                isDragging
                                  ? "border-primary bg-primary/5"
                                  : "border-gray-200 hover:bg-gray-50"
                              } group cursor-pointer`}
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onClick={() =>
                                document.getElementById("file-upload")?.click()
                              }
                            >
                              <Upload className="w-10 h-10 mx-auto text-gray-400 group-hover:text-primary transition-colors mb-4" />
                              <p className="text-sm font-medium text-gray-700">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF, JPG, PNG (Max 10MB per file)
                              </p>

                              <input
                                type="file"
                                multiple
                                className="hidden"
                                id="file-upload"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                              />
                            </div>

                            {/* File Previews Grid */}
                            {field.value && field.value.length > 0 && (
                              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
                                {field.value.map((file, index) => {
                                  const preview = getFilePreview(file);
                                  const isImage =
                                    file.type.startsWith("image/");

                                  return (
                                    <div
                                      key={index}
                                      className="relative group rounded-xl border border-gray-200 overflow-hidden bg-gray-50 hover:shadow-md transition-all"
                                    >
                                      {/* Preview */}
                                      <div className="aspect-square flex items-center justify-center p-2">
                                        {isImage && preview ? (
                                          <Image
                                            src={preview}
                                            alt={file.name}
                                            width={200}
                                            height={200}
                                            className="w-full h-full object-cover rounded-lg"
                                          />
                                        ) : (
                                          <div className="flex flex-col items-center gap-2">
                                            {getFileIcon(file)}
                                            <p className="text-xs text-gray-600 font-medium text-center line-clamp-2 px-2">
                                              {file.name}
                                            </p>
                                          </div>
                                        )}
                                      </div>

                                      {/* File Info */}
                                      <div className="p-2 bg-white border-t border-gray-100">
                                        <p className="text-xs text-gray-600 truncate">
                                          {file.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                      </div>

                                      {/* Remove Button */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeFile(index);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                        {navigatedBack && form.watch("requirements") && (
                          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md mb-4">
                            Note: Please re-attach any reference files if you
                            have navigated back.
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isPending} className="w-full">
              Continue to Review <ChevronRight />
            </Button>
          </div>

          {/* RIGHT: STICKY SUMMARY */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent>
                <div className="rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={service.thumbnail || "/placeholder-service.jpg"}
                    alt={service.name}
                    width={1000}
                    height={1000}
                    className="aspect-auto size-full object-cover transition-all"
                  />
                </div>
                <div className="mt-2.5 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold line-clamp-2">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Professional Service
                    </p>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Clock className="size-4" /> Duration
                    </span>
                    <span className="font-semibold text-gray-900">
                      {service.duration} mins
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <MapPin className="size-4" /> Mode
                    </span>
                    <span className="font-semibold text-primary px-3 py-1 bg-primary/5 rounded-full text-xs">
                      {service.deliveryMode}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-500 text-sm font-medium">
                      Service Fee
                    </span>
                    <span className="text-2xl font-black text-primary">
                      <CurrencyIcon currency="NGN" />
                      {Number(service.price).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    By continuing, you agree to our Terms of Service and the
                    provider's cancellation policy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookingPage;
