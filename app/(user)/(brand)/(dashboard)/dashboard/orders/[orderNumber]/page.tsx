"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Order } from "@/types";
import api from "@/lib/api";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { formatMoneyInput, formatDate, formatPhoneNumber } from "@/lib/utils";
import {
  IconTruckDelivery,
  IconCheck,
  IconPackage,
  IconLoader2,
} from "@tabler/icons-react";
import Image from "next/image";
import { TimelineItem } from "@/components/TimelineItem";
import { CurrencyIcon } from "@/components/CurrencyIcon";

// Extended type to include the brandSubtotal we added in the backend
interface BrandOrder extends Order {
  brandSubtotal: number;
}

const page = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<BrandOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      // 1. Calling the BRAND SPECIFIC endpoint
      const res = await api.get(`/orders/brand/details/${orderNumber}`);
      setOrder(res.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to load brand order",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) fetchOrder();
  }, [orderNumber]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      // UPDATED ENDPOINT: Targets the brand-specific status logic
      await api.patch(`/orders/${order?.id}/brand-status`, {
        status: newStatus,
      });
      toast.success(`Your items are now marked as ${newStatus.toLowerCase()}`);
      await fetchOrder();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center flex flex-col items-center gap-2">
        <IconLoader2 className="animate-spin text-primary" />
        <p>Loading brand order details...</p>
      </div>
    );

  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  const brandItems = order.items;
  const isFullyDelivered = brandItems.every(
    (i: any) => i.status === "DELIVERED",
  );
  const isFullyShipped = brandItems.every(
    (i: any) => i.status === "SHIPPED" || i.status === "DELIVERED",
  );
  const isPartiallyShipped = brandItems.some(
    (i: any) => i.status === "SHIPPED" || i.status === "DELIVERED",
  );

  let brandStatusLabel = "Processing";
  if (isFullyDelivered) brandStatusLabel = "Delivered";
  else if (isFullyShipped) brandStatusLabel = "Shipped";
  else if (isPartiallyShipped) brandStatusLabel = "Partially Shipped";

  return (
    <div className="">
      <PageHeader back title="Manage Order" description={order.orderNumber} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* LEFT: Items (Now filtered by backend to only show THIS brand's items) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="gap-1">
            <CardHeader className="flex flex-row items-center justify-between border-b mb-4">
              <CardTitle className="text-lg">Your Products</CardTitle>
              <Badge variant="outline">{order.items.length} Items</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="relative size-16 rounded-md overflow-hidden bg-gray-50 border">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.productName}</h4>
                    <p className="text-xs text-muted-foreground uppercase">
                      {item.size || "N/A"} • {item.color || "N/A"} • Qty:{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant="outline"
                      className="text-[10px] capitalize bg-blue-50 text-blue-700 border-blue-100"
                    >
                      {item.status.toLowerCase()}
                    </Badge>
                    <div className="text-sm font-semibold">
                      <CurrencyIcon currency="NGN" />{" "}
                      {formatMoneyInput(Number(item.price) * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <div className="flex justify-between font-bold text-base">
                  <span>Your Earnings</span>
                  <span className="text-primary">
                    <CurrencyIcon currency="NGN" />{" "}
                    {formatMoneyInput(order.brandSubtotal)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  * Note: Shipping fees and discounts are managed at the
                  platform level.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase">
                  Recipient
                </p>
                <p className="text-sm font-medium">
                  {order.shippingAddress?.firstName}{" "}
                  {order.shippingAddress?.lastName}
                </p>
                <a
                  href={`tel:${order.shippingAddress?.phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {formatPhoneNumber(order.shippingAddress?.phone || "")}
                </a>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase">
                  Address
                </p>
                <p className="text-sm">{order.shippingAddress?.address}</p>
                <p className="text-sm">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Fulfillment Actions */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5 gap-1">
            <CardHeader>
              <CardTitle className="text-base">
                Your Fulfillment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">My Status</span>
                <Badge variant="secondary" className="capitalize">
                  {brandStatusLabel.toLowerCase()}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                {/* Action 1: Mark as Shipped (Only if items are still processing) */}
                {!isFullyShipped && (
                  <Button
                    className="w-full gap-2"
                    onClick={() => updateStatus("SHIPPED")}
                    disabled={updating || !order.paidAt}
                  >
                    {updating ? (
                      <IconLoader2 className="animate-spin" size={18} />
                    ) : (
                      <IconTruckDelivery size={18} />
                    )}
                    Mark My Items as Shipped
                  </Button>
                )}

                {/* Action 2: Mark as Delivered (Only if shipped but not delivered) */}
                {isFullyShipped && !isFullyDelivered && (
                  <Button
                    className="w-full gap-2"
                    variant="default"
                    onClick={() => updateStatus("DELIVERED")}
                    disabled={updating}
                  >
                    {updating ? (
                      <IconLoader2 className="animate-spin" size={18} />
                    ) : (
                      <IconCheck size={18} />
                    )}
                    Confirm My Delivery
                  </Button>
                )}

                {/* State 3: All done */}
                {isFullyDelivered && (
                  <div className="bg-green-100 text-green-700 p-3 rounded-md text-center text-sm font-medium">
                    Your items have been delivered
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TimelineItem
                label="Order Placed"
                date={order.createdAt}
                icon={<IconPackage size={14} />}
                active
              />
              <TimelineItem
                label="Payment Received"
                date={order.paidAt}
                icon={<IconCheck size={14} />}
                active={!!order.paidAt}
              />
              <TimelineItem
                label={
                  isFullyShipped
                    ? "Items Dispatched"
                    : isPartiallyShipped
                      ? "Partially Dispatched"
                      : "Awaiting Dispatch"
                }
                // We show the platform date only if this specific brand has started shipping
                date={isPartiallyShipped ? order.shippedAt : null}
                icon={<IconTruckDelivery size={14} />}
                active={isPartiallyShipped || isFullyShipped}
              />

              {/* 4. Customer Received - Active ONLY if ALL of YOUR items are DELIVERED */}
              <TimelineItem
                label="Customer Received"
                date={isFullyDelivered ? order.deliveredAt : null}
                icon={<IconCheck size={14} />}
                active={isFullyDelivered}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
