"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { IconMail, IconExternalLink } from "@tabler/icons-react";

const DEFAULT_IMAGE = "/assets/images/profile-img.jpg";
const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrderDetailPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const data = await adminService.getOrderDetails(orderNumber as string);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderNumber as string, newStatus);
      toast.success("Order status updated");
      fetchOrder();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  if (!order) return <div className="py-20 text-center">Order not found</div>;

  // Collect unique brands from order items
  const brandsMap = new Map<string, any>();
  order.items?.forEach((item: any) => {
    const brand = item.product?.brand;
    if (brand && !brandsMap.has(brand.id)) {
      brandsMap.set(brand.id, brand);
    }
  });
  const brands = Array.from(brandsMap.values());

  return (
    <div>
      <PageHeader
        back
        title={`Order #${order.orderNumber}`}
        description={`Placed on ${formatDate(order.createdAt)}`}
        badges={[order.status, order.paymentStatus]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                  >
                    <Image
                      src={item.productImage || DEFAULT_IMAGE}
                      alt={item.productName}
                      width={60}
                      height={60}
                      className="rounded-lg size-14 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.productName}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                      {item.product?.brand && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Brand:{" "}
                          <span className="font-medium text-foreground">
                            {item.product.brand.brandName}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold flex items-center justify-end">
                        <CurrencyIcon currency="NGN" />
                        {Number(item.price).toLocaleString()}
                      </p>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="flex items-center">
                    <CurrencyIcon currency="NGN" />
                    {Number(order.subtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="flex items-center">
                    <CurrencyIcon currency="NGN" />
                    {Number(order.deliveryFee).toLocaleString()}
                  </span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -<CurrencyIcon currency="NGN" />
                      {Number(order.discount).toLocaleString()}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="flex items-center">
                    <CurrencyIcon currency="NGN" />
                    {Number(order.total).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Update */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                defaultValue={order.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/admin/users/${order.user?.id}`}
                className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
              >
                <Image
                  src={order.user?.image || DEFAULT_IMAGE}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full size-10 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    {order.user?.firstName} {order.user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.user?.email}
                  </p>
                </div>
                <IconExternalLink className="size-4 text-muted-foreground shrink-0" />
              </Link>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`mailto:${order.user?.email}`}>
                    <IconMail />
                    Email Customer
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Brand / Seller Info */}
          {brands.length > 0 && (
            <Card className="gap-1">
              <CardHeader>
                <CardTitle className="text-base">
                  {brands.length === 1 ? "Brand / Seller" : "Brands / Sellers"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {brands.map((brand: any) => (
                  <div key={brand.id}>
                    <Link
                      href={`/admin/users/${brand.user?.id}`}
                      className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                    >
                      <Image
                        src={
                          brand.brandLogo || brand.user?.image || DEFAULT_IMAGE
                        }
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full size-10 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{brand.brandName}</p>
                        <p className="text-xs text-muted-foreground">
                          {brand.user?.firstName} {brand.user?.lastName}
                        </p>
                      </div>
                      <IconExternalLink className="size-4 text-muted-foreground shrink-0" />
                    </Link>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" className="flex-1" asChild>
                        <a href={`mailto:${brand.user?.email}`}>
                          <IconMail />
                          Email Brand
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card className="gap-1">
              <CardHeader>
                <CardTitle className="text-base">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phone}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    PAID: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colorMap[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}
