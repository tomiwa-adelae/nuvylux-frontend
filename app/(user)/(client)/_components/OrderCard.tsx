"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatMoneyInput, formatPhoneNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  IconShoppingBag,
  IconUser,
  IconMapPin,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types";
import { CurrencyIcon } from "@/components/CurrencyIcon";

interface OrderCardProps {
  order: Order;
  isBrandView?: boolean; // New prop
}

export const OrderCard = ({ order, isBrandView = false }: OrderCardProps) => {
  const displayStatus = isBrandView
    ? order.items[0]?.status // Status of the brand's items
    : order.status; // Global order status

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "default";
      case "CANCELLED":
        return "destructive";
      case "PROCESSING":
      case "PENDING":
        return "secondary"; // Grouping similar states
      case "SHIPPED":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className="gap-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-bold">
            <IconShoppingBag size={20} className="text-primary" />
            <span className="tracking-tight">{order?.orderNumber}</span>
          </div>
          <Badge
            variant={getStatusVariant(displayStatus)}
            className="capitalize px-3 py-1"
          >
            {displayStatus?.toLowerCase().replace("_", " ")}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Brand View Only: Customer Summary */}
        {isBrandView && (
          <div className="flex flex-col gap-2 p-3 bg-muted/20 rounded-lg border border-muted-foreground/5 mb-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <IconUser size={16} className="text-muted-foreground" />
              <span>
                {order.shippingAddress?.firstName}{" "}
                {order.shippingAddress?.lastName}
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <a
                href={`tel:${order.shippingAddress.phone}`}
                className="text-xs hover:underline hover:text-primary text-muted-foreground"
              >
                {formatPhoneNumber(order.shippingAddress?.phone)}
              </a>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <IconMapPin size={16} className="shrink-0" />
              <span className="line-clamp-1">
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </span>
            </div>
          </div>
        )}

        {/* Product Items */}
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="relative size-16 rounded-lg shrink-0 overflow-hidden bg-gray-50 border">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">
                  {item.productName}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-muted-foreground">
                    <CurrencyIcon currency="NGN" />{" "}
                    {formatMoneyInput(Number(item.price))} × {item.quantity}
                  </p>
                  {(item.size || item.color) && (
                    <div className="flex gap-1">
                      <span className="text-[10px] text-muted-foreground">
                        |
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">
                        {item.size} {item.color}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {isBrandView ? "Earnings" : "Total Amount"}
            </p>
            <p className="text-lg font-black text-primary">
              <CurrencyIcon currency="NGN" />{" "}
              {formatMoneyInput(
                Number(isBrandView ? order.brandEarnings : order.total),
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link
                href={
                  isBrandView
                    ? `/dashboard/orders/${order.orderNumber}`
                    : `/orders/${order.orderNumber}`
                }
              >
                {isBrandView ? "Manage Order" : "Track Order"}
              </Link>
            </Button>

            {/* Quick action for brand view — also available for POD (CONFIRMED) orders */}
            {isBrandView &&
              (order.status === "PROCESSING" ||
                (order.status === "CONFIRMED" &&
                  order.paymentMethod === "pay_on_delivery")) && (
                <Button size="sm" className="rounded-full gap-1.5">
                  <IconTruckDelivery size={16} />
                  Ship
                </Button>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
