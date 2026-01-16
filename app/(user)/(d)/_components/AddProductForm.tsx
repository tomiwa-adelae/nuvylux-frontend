"use client";

import React, { useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NairaIcon } from "@/components/NairaIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories, DEFAULT_IMAGE } from "@/constants";
import { IconPhoto, IconUpload, IconX, IconLoader2 } from "@tabler/icons-react";
import Image from "next/image";
import {
  AddProductFormSchema,
  AddProductFormSchemaType,
} from "@/lib/zodSchemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/text-editor/Editor";
import { ColorsSelector } from "./ColorsManagement";
import { SizesSelector } from "./SizesSelector";
import { MultiImageUploader } from "./MultiImageUploader";
import api from "@/lib/api";
import { base64ToFile } from "@/lib/utils";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/navigation";

export const AddProductForm = ({ brandId }: { brandId: string }) => {
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  const form = useForm<AddProductFormSchemaType>({
    resolver: zodResolver(AddProductFormSchema),
    defaultValues: {
      name: "",
      category: "",
      shortDescription: "",
      description: "",
      brandId,
      price: "",
      // currency: "NGN",
      stock: "",
      images: [],
      thumbnail: "",
      availableColors: [],
    },
  });

  // Watch values for the Preview Card
  const watchedName = form.watch("name");
  const watchedPrice = form.watch("price");
  const watchedDescription = form.watch("shortDescription");
  const watchedThumbnail = form.watch("thumbnail");

  // Handle file read for thumbnail
  const handleFile = (file: File) => {
    if (
      !["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
        file.type
      )
    ) {
      toast.error("Only PNG, JPG, JPEG, or WEBP files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("thumbnail", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: AddProductFormSchemaType) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        // 1. Append basic text fields
        formData.append("name", data.name);
        formData.append("category", data.category);
        formData.append("brandId", data.brandId);
        formData.append("price", data.price);
        formData.append("stock", data.stock);
        formData.append("sku", data.sku);
        formData.append("status", data.status);
        formData.append("description", data.description);
        formData.append("shortDescription", data.shortDescription);

        // 2. Append Arrays as JSON strings (FormData only supports strings/files)
        formData.append("sizes", JSON.stringify(data.sizes || []));
        formData.append(
          "availableColors",
          JSON.stringify(data.availableColors || [])
        );

        // 3. Convert and Append the Thumbnail
        if (data.thumbnail) {
          const thumbFile = base64ToFile(data.thumbnail, "product-thumb.png");
          formData.append("thumbnail", thumbFile);
        }

        // This key MUST match { name: 'images' } in the Controller
        data.images.forEach((base64, index) => {
          const file = base64ToFile(base64, `gallery-${index}.png`);
          formData.append("images", file);
        });

        // 5. Send to API (Do NOT set Content-Type header manually, the browser will do it)
        const res = await api.post("/products", formData, {
          headers: {
            // This tells Axios NOT to set a default Content-Type,
            // allowing the browser to set it to multipart/form-data with the correct boundary
            "Content-Type": "multipart/form-data",
          },
        });

        form.reset();

        toast.success(res.data.message || "Product added successfully!");
        router.push(`/products`);
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to add product");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-8 gap-2"
      >
        {/* LEFT COLUMN: PREVIEW */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="sticky p-0 top-20 overflow-hidden">
            <CardContent className="p-2">
              <div className="rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={watchedThumbnail || DEFAULT_IMAGE}
                  alt="Preview"
                  width={1000}
                  height={1000}
                  className="aspect-auto size-full object-cover transition-all"
                />
              </div>
              <div className="mt-2.5">
                <p className="font-semibold line-clamp-2 text-base leading-tight">
                  {watchedName || "Product Name Display"}
                </p>
                <p className="text-muted-foreground mt-1 text-sm line-clamp-2 min-h-[2.5rem]">
                  {watchedDescription ||
                    "A short description of your product will appear here."}
                </p>
                <div className="flex items-center gap-1 font-bold mt-1.5 text-lg text-primary">
                  <NairaIcon />
                  {watchedPrice
                    ? Number(watchedPrice).toLocaleString()
                    : "0.00"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: FORM FIELDS */}
        <div className="lg:col-span-5 space-y-2">
          {/* IMAGE UPLOAD CARD */}
          <Card>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      {!field.value ? (
                        <div
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
                          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                            isDragging
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/20 bg-muted/30"
                          }`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <IconPhoto
                              size={40}
                              className="text-muted-foreground"
                            />
                            <p className="text-sm font-medium">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG or WEBP (Max 2MB)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group rounded-lg overflow-hidden border">
                          <Image
                            src={field.value}
                            alt="Thumb"
                            width={400}
                            height={400}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => form.setValue("thumbnail", "")}
                            >
                              <IconX size={16} className="mr-1" /> Remove
                            </Button>
                          </div>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Gallery</CardTitle>
              <p className="text-xs text-muted-foreground">
                Add up to 5 high-quality images of your product from different
                angles.
              </p>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiImageUploader
                        value={field.value}
                        onChange={field.onChange}
                        maxImages={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* PRODUCT INFO CARD */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Nike Air Max 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Brief catchy summary..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* COLORS SELECTOR */}
              <FormField
                control={form.control}
                name="availableColors"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ColorsSelector
                        onColorsChange={field.onChange}
                        initialColors={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SizesSelector
                        onSizesChange={field.onChange}
                        initialSizes={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price (₦)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="compareAtPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Original price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="PRD-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                    <FormLabel>Product Status</FormLabel>
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
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              type="button"
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader text="Saving..." /> : "Publish Product"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
