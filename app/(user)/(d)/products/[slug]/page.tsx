"use client";

import { NairaIcon } from "@/components/NairaIcon";
import { PageHeader } from "@/components/PageHeader";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import { productService } from "@/lib/products";
import { Product } from "@/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const data = await productService.getMyProductsDetails(slug as string);
        setProduct(data);
        setSelectedImage(data.thumbnail); // Set initial main image
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading)
    return <div className="p-10 text-center">Loading Product...</div>;
  if (!product)
    return <div className="p-10 text-center">Product not found.</div>;

  // Combine thumbnail and gallery for the sidebar
  const allImages = [product.thumbnail, ...(product.images || [])];

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <PageHeader
        back
        description="View and manage your product details"
        title="Product Details"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* LEFT COLUMN: IMAGE GALLERY (Lg: 7 cols) */}
        <div className="lg:col-span-7 flex gap-4">
          {/* Thumbnails Sidebar */}
          <div className="flex flex-col gap-3">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={cn(
                  "size-20 rounded-lg overflow-hidden border-2 cursor-pointer transition-all",
                  selectedImage === img
                    ? "border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={img}
                  alt="thumb"
                  width={80}
                  height={80}
                  className="object-cover size-full"
                />
              </div>
            ))}
          </div>

          {/* Main Large Image */}
          <Card className="flex-1 overflow-hidden border-none shadow-none bg-gray-50 flex items-center justify-center rounded-2xl">
            <div className="relative aspect-square w-full">
              <Image
                src={selectedImage}
                alt={product.name}
                width={1000}
                height={1000}
                className="object-cover aspect-auto p-4"
                priority
              />
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: INFO (Lg: 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider">
              {product.category}
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mt-1">
              {product.name}
            </h1>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center text-3xl font-bold text-primary">
              <NairaIcon />
              <span>{Number(product.price).toLocaleString()}</span>
            </div>
            {product.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through flex items-center">
                <NairaIcon />
                {Number(product.compareAtPrice).toLocaleString()}
              </span>
            )}
            {product.compareAtPrice && (
              <Badge variant="destructive" className="bg-orange-500">
                -
                {Math.round(
                  ((Number(product.compareAtPrice) - Number(product.price)) /
                    Number(product.compareAtPrice)) *
                    100
                )}
                % off
              </Badge>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* SIZES */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Available Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <div
                    key={size}
                    className="px-4 py-2 border rounded-md text-sm font-medium hover:border-primary cursor-pointer transition-colors"
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COLORS */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Available Colors</h3>
              <div className="flex gap-3">
                {product.availableColors.map((color: any) => (
                  <div
                    key={color.colorCode}
                    title={color.name}
                    className="size-8 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.colorCode }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS (Brand Owner Context) */}
          <div className="flex gap-3 pt-6">
            <Button size="lg" className="flex-1 h-14 text-lg rounded-xl">
              Edit Product
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 h-14 text-lg rounded-xl"
            >
              Manage Stock ({product.stock})
            </Button>
          </div>
        </div>
      </div>

      {/* BOTTOM TABS: DESCRIPTION */}
      <div className="mt-16 border-t pt-10">
        <div className="flex gap-8 border-b mb-6">
          <button className="pb-4 border-b-2 border-primary font-semibold text-lg">
            Description
          </button>
          <button className="pb-4 text-muted-foreground font-medium text-lg hover:text-black">
            Reviews
          </button>
        </div>
        <div className="prose max-w-none">
          <RenderDescription json={product.description} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
