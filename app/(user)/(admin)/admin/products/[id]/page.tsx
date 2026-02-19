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
import { IconMail, IconExternalLink } from "@tabler/icons-react";
import { RenderDescription } from "@/components/text-editor/RenderDescription";

const DEFAULT_IMAGE = "/assets/images/profile-img.jpg";
const PRODUCT_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const data = await adminService.getProductDetails(id as string);
      setProduct(data);
    } catch (error) {
      console.error("Failed to fetch product", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await adminService.updateProductStatus(id as string, newStatus);
      toast.success("Product status updated");
      fetchProduct();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminService.deleteProduct(id as string);
      toast.success("Product deleted");
      fetchProduct();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  if (!product)
    return <div className="py-20 text-center">Product not found</div>;

  const colors = product.availableColors as
    | { name: string; colorCode: string }[]
    | null;

  return (
    <div>
      <PageHeader
        back
        title={product.name}
        description={`SKU: ${product.sku}`}
        badges={[product.status]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Images */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.thumbnail && (
                  <div className="relative">
                    <Image
                      src={product.thumbnail}
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
                {product.images?.map((url: string, i: number) => (
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
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.shortDescription && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Short Description
                  </p>
                  <p className="text-sm">{product.shortDescription}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Full Description
                </p>
                <div className="text-sm prose prose-sm max-w-none">
                  <RenderDescription json={product.description} />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-semibold flex items-center">
                    <CurrencyIcon currency="NGN" />
                    {Number(product.price).toLocaleString()}
                  </p>
                </div>
                {product.compareAtPrice && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Compare at Price
                    </p>
                    <p className="font-medium line-through text-muted-foreground flex items-center">
                      <CurrencyIcon currency="NGN" />
                      {Number(product.compareAtPrice).toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Stock</p>
                  <p className="font-medium">{product.stock} units</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="font-medium">
                    {product._count?.orderItems || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Saved By</p>
                  <p className="font-medium">
                    {product._count?.savedBy || 0} users
                  </p>
                </div>
              </div>

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Available Sizes
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size: string) => (
                      <Badge key={size} variant="secondary">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {console.log(colors)}

              {/* Colors */}
              {colors && colors.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Available Colors
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((c) => (
                      <div
                        key={c.colorCode}
                        className="flex items-center gap-1.5 border rounded-full px-2.5 py-1"
                      >
                        <div
                          className="size-3 rounded-full border"
                          style={{ backgroundColor: c.colorCode }}
                        />
                        <span className="text-xs">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
                defaultValue={product.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!product.isDeleted && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  <Trash2 />
                  Delete Product
                </Button>
              )}
              {product.isDeleted && (
                <Badge variant="destructive">Deleted</Badge>
              )}
            </CardContent>
          </Card>

          {/* Brand Info */}
          {product.brand && (
            <Card className="gap-1">
              <CardHeader>
                <CardTitle className="text-base">Brand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  {product.brand.brandLogo && (
                    <Image
                      src={product.brand.brandLogo}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded size-10 object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{product.brand.brandName}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.brand.brandType}
                    </p>
                  </div>
                </div>

                {product.brand.user && (
                  <>
                    <Separator className="my-3" />
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Brand Owner
                    </p>
                    <Link
                      href={`/admin/users/${product.brand.user.id}`}
                      className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    >
                      <Image
                        src={product.brand.user.image || DEFAULT_IMAGE}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full size-9 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {product.brand.user.firstName}{" "}
                          {product.brand.user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand.user.email}
                        </p>
                      </div>
                      <IconExternalLink className="size-4 text-muted-foreground shrink-0" />
                    </Link>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" className="flex-1" asChild>
                        <a href={`mailto:${product.brand.user.email}`}>
                          <IconMail />
                          Email Owner
                        </a>
                      </Button>
                    </div>
                  </>
                )}
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
                <span>{formatDate(product.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated</span>
                <span>{formatDate(product.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Featured</span>
                <span>{product.isFeatured ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span>Slug</span>
                <span className="truncate ml-4">{product.slug}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
