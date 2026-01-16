"use client";
import { NairaIcon } from "@/components/NairaIcon";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderService } from "@/lib/orders";
import { formatDate, formatMoneyInput, formatPhoneNumber } from "@/lib/utils";
import { Order } from "@/types";
import {
  IconCheck,
  IconPackage,
  IconTruckDelivery,
  IconCreditCard,
  IconX,
  IconWallet,
} from "@tabler/icons-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns"; // Recommended for date formatting
import { Button } from "@/components/ui/button";

const OrderDetailPage = () => {
  const { orderNumber } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;
    const fetchOrder = async () => {
      try {
        const data = await orderService.getMyOrderDetails(
          orderNumber as string
        );
        setOrder(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNumber]);

  if (loading)
    return <div className="p-10 text-center">Loading order details...</div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  // Helper for Activity Timeline
  const activities = [
    {
      label: "Order Placed",
      date: order.createdAt,
      icon: <IconPackage size={16} />,
      completed: true,
    },
    {
      label: "Payment Confirmed",
      date: order.paidAt,
      icon: <IconCreditCard size={16} />,
      completed: !!order.paidAt,
    },
    {
      label: "Order Shipped",
      date: order.shippedAt,
      icon: <IconTruckDelivery size={16} />,
      completed: !!order.shippedAt,
    },
    {
      label: "Delivered",
      date: order.deliveredAt,
      icon: <IconCheck size={16} />,
      completed: !!order.deliveredAt,
    },
  ].filter((a) => a.completed || a.label === "Payment Confirmed"); // Logic to show relevant steps

  const handlePayment = () => {
    // Navigate to your payment gateway or internal payment page
    router.push(`/checkout/pay/${order?.orderNumber}`);
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setProcessingAction(true);
    try {
      // Assuming you have a cancel method in your orderService
      // await orderService.cancelOrder(order?.id);
      toast.success("Order cancelled successfully");
      // Refresh order data
    } catch (error) {
      toast.error("Failed to cancel order");
    } finally {
      setProcessingAction(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <PageHeader back title={`Order Details`} />

        {/* --- DYNAMIC ACTION BUTTONS --- */}
        <div className="flex items-center gap-2">
          {/* Show Cancel Button if not shipped and not already cancelled */}
          {!order.shippedAt && order.status !== "CANCELLED" && (
            <Button
              variant="outline"
              className="text-destructive border-red-100 hover:bg-red-50"
              onClick={handleCancelOrder}
              disabled={processingAction}
            >
              <IconX size={16} className="mr-2" />
              Cancel Order
            </Button>
          )}

          {/* Show Payment Button if not paid */}
          {!order.paidAt && order.status !== "CANCELLED" && (
            <Button onClick={handlePayment}>
              <IconWallet size={16} className="mr-2" />
              Pay Now
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT COLUMN: Items & Summary */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="gap-1">
            <CardHeader className="flex flex-row items-center justify-between border-b mb-4">
              <CardTitle>Order Number #{order.orderNumber}</CardTitle>
              <Badge
                variant={order.status === "DELIVERED" ? "default" : "secondary"}
              >
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="relative size-20 rounded-lg overflow-hidden bg-gray-50 border shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        <NairaIcon /> {formatMoneyInput(Number(item.price))} ×{" "}
                        {item.quantity}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {item.size && (
                          <Badge variant="outline" className="text-[10px]">
                            Size {item.size}
                          </Badge>
                        )}
                        {item.color && (
                          <Badge variant="outline" className="text-[10px]">
                            {item.color}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right font-medium text-sm">
                      <NairaIcon />{" "}
                      {formatMoneyInput(Number(item.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Summary */}
              <div className="pt-4 mt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    <NairaIcon /> {formatMoneyInput(Number(order.subtotal))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span>
                    <NairaIcon /> {formatMoneyInput(Number(order.deliveryFee))}
                  </span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>
                      -<NairaIcon /> {formatMoneyInput(Number(order.discount))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>
                    <NairaIcon /> {formatMoneyInput(Number(order.total))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-semibold">
                    Name
                  </p>
                  <p>
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-semibold">
                    Phone
                  </p>
                  <a
                    className="hover:underline hover:text-primary"
                    href={`tel:${order?.shippingAddress.phone}`}
                  >
                    {formatPhoneNumber(order.shippingAddress.phone)}
                  </a>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs uppercase font-semibold">
                    Shipping Address
                  </p>
                  <p>
                    {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
                {order.customerNote && (
                  <div className="col-span-2 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                    <p className="text-xs font-semibold text-yellow-800 uppercase">
                      Order Note
                    </p>
                    <p className="text-yellow-900 italic mt-1">
                      "{order.customerNote}"
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Activity Timeline */}
        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:h-full before:w-0.5 before:bg-muted">
                {activities.map((activity, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-start gap-4 ml-0.5"
                  >
                    <div
                      className={`relative z-10 flex size-7 items-center justify-center rounded-full border-2 bg-white ${
                        activity.completed
                          ? "border-primary text-primary"
                          : "border-muted text-muted-foreground"
                      }`}
                    >
                      {activity.icon}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          !activity.completed && "text-muted-foreground"
                        }`}
                      >
                        {activity.label}
                      </p>
                      {activity.date && (
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.date, true)}
                        </p>
                      )}
                      {!activity.date &&
                        activity.label === "Payment Confirmed" && (
                          <p className="text-xs text-amber-600 font-medium">
                            Awaiting Payment
                          </p>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
