"use client";

import { PageHeader } from "@/components/PageHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { orderService } from "@/lib/orders";
import { OrderCard } from "../_components/OrderCard";
import { Order } from "@/types";

const page = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders based on your OrderStatus enum from Prisma
  const shippingOrders = orders.filter((o) =>
    ["PENDING", "PROCESSING", "SHIPPED"].includes(o.status)
  );
  const arrivedOrders = orders.filter((o) => o.status === "DELIVERED");
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED");

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader title={"My Orders"} back />

      <Tabs defaultValue="shipping" className="mt-2">
        <ScrollArea className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="shipping">
              On Shipping ({shippingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="arrived">
              Arrived ({arrivedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="mt-2">
          <TabsContent value="shipping" className="space-y-6">
            {shippingOrders.length > 0 ? (
              shippingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState message="No active orders" />
            )}
          </TabsContent>

          <TabsContent value="arrived" className="space-y-6">
            {arrivedOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-6">
            {cancelledOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
    <ShoppingBag className="mx-auto size-12 text-muted-foreground/50" />
    <p className="mt-4 text-muted-foreground font-medium">{message}</p>
  </div>
);

export default page;
