"use client";

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
  IconTruck,
  IconCreditCard,
  IconX,
  IconWallet,
  IconLoaderQuarter,
} from "@tabler/icons-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns"; // Recommended for date formatting
import { Button } from "@/components/ui/button";
import { CancelOrderModal } from "../../_components/CancelOrderModal";
import api from "@/lib/api";
import { Loader } from "@/components/Loader";
import { CurrencyIcon } from "@/components/CurrencyIcon";

const page = () => {
  const { orderNumber } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // Modal state
  const [isVerifying, setIsVerifying] = useState(false);

  // 1. Hook for Initial Fetch
  useEffect(() => {
    if (!orderNumber) return;
    const fetchOrder = async () => {
      try {
        const data = await orderService.getMyOrderDetails(
          orderNumber as string,
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

  // 2. Hook for Payment Verification (Will now find the function correctly)
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const status = query.get("status");
    const txRef = query.get("tx_ref");
    const transactionId = query.get("transaction_id");

    if (status === "successful" && transactionId) {
      verifyPaymentOnBackend(txRef, transactionId);
    }
  }, []);

  // 3. Changed to a 'function' declaration so it is hoisted
  async function verifyPaymentOnBackend(
    txRef: string | null,
    transactionId: string | null,
  ) {
    if (!txRef || !transactionId) return;

    if (isVerifying) return; // Prevent duplicate calls

    setIsVerifying(true);

    try {
      const res = await api.get(
        `/orders/verify-payment?tx_ref=${txRef}&transaction_id=${transactionId}`,
      );

      toast.success("Payment verified successfully!");
      const updatedOrder = await orderService.getMyOrderDetails(txRef);
      setOrder(updatedOrder);
      router.replace(`/orders/${txRef}`);
    } catch (error) {
      console.error("Verification failed", error);
      toast.error("Could not verify payment. Please contact support.");
    } finally {
      setIsVerifying(false);
    }
  }

  if (loading)
    return <div className="p-10 text-center">Loading order details...</div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  const brandItems = order.items;

  // Helper flags
  const shippedItemsCount = brandItems.filter((i: any) =>
    ["SHIPPED", "DELIVERED"].includes(i.status),
  ).length;
  const deliveredItemsCount = brandItems.filter(
    (i: any) => i.status === "DELIVERED",
  ).length;
  const totalItems = brandItems.length;

  const isPartiallyShipped =
    shippedItemsCount > 0 && shippedItemsCount < totalItems;
  const isFullyShipped = shippedItemsCount === totalItems;
  const isPartiallyDelivered =
    deliveredItemsCount > 0 && deliveredItemsCount < totalItems;
  const isFullyDelivered = deliveredItemsCount === totalItems;

  const isPOD = order.paymentMethod === "pay_on_delivery";

  const activities = [
    {
      label: "Order Placed",
      date: order.createdAt,
      icon: <IconPackage size={16} />,
      completed: true,
    },
    // Payment Step — differs for POD vs online
    ...(isPOD
      ? [
          {
            label: "Pay on Delivery",
            date: order.deliveredAt ?? null,
            icon: <IconTruck size={16} />,
            completed: !!order.deliveredAt,
          },
        ]
      : isVerifying
        ? [
            {
              label: "Verifying Payment...",
              date: new Date().toISOString(),
              icon: <IconLoaderQuarter className="animate-spin" size={16} />,
              completed: false,
              isLoading: true,
            },
          ]
        : [
            {
              label: "Payment Confirmed",
              date: order.paidAt,
              icon: <IconCreditCard size={16} />,
              completed: !!order.paidAt,
            },
          ]),
    // Shipping Step (Handles Partial)
    {
      label: isPartiallyShipped
        ? `Shipping (${shippedItemsCount}/${totalItems} items)`
        : "Order Shipped",
      date: isFullyShipped ? order.shippedAt : null,
      icon: <IconTruckDelivery size={16} />,
      completed: isFullyShipped,
      isPartial: isPartiallyShipped,
    },
    // Delivery Step (Handles Partial)
    {
      label: isPartiallyDelivered
        ? `Delivered (${deliveredItemsCount}/${totalItems} items)`
        : "Delivered",
      date: isFullyDelivered ? order.deliveredAt : null,
      icon: <IconCheck size={16} />,
      completed: isFullyDelivered,
      isPartial: isPartiallyDelivered,
    },
    // Cancellation Step
    ...(order.status === "CANCELLED"
      ? [
          {
            label: "Cancelled",
            date: order.cancelledAt,
            icon: <IconX size={16} />,
            completed: true,
            isCancelled: true,
          },
        ]
      : []),
  ].filter((a) => {
    if (a.isCancelled) return true;
    if (order.status === "CANCELLED") {
      return !["Order Shipped", "Delivered", "Shipping"].some((s) =>
        a.label.includes(s),
      );
    }
    // Show if there is any progress (completed or partial) or if it's the next logical step
    if (a.completed || a.isPartial || a.isLoading) return true;

    // Show the "Next Step" guide
    if (a.label === "Payment Confirmed" && !order.paidAt && !isPOD) return true;
    if (a.label === "Pay on Delivery" && isPOD) return true;
    // For online orders, shipping step shows after payment. For POD, it shows once order is confirmed.
    if (
      a.label.includes("Shipped") &&
      (order.paidAt || isPOD) &&
      !isFullyShipped
    )
      return true;
    if (a.label.includes("Delivered") && isFullyShipped && !isFullyDelivered)
      return true;

    return false;
  });

  const handlePayment = async () => {
    setProcessingAction(true);
    try {
      // Assuming you add this to your orderService in lib/orders.ts
      const res = await api.post(`/orders/${order?.orderNumber}/pay`);

      const paymentLink = res.data?.data?.link || res.data?.link;

      if (paymentLink) {
        toast.success("Redirecting to payment gateway...");
        // Using replace instead of href can sometimes prevent "back button" loops
        window.location.assign(paymentLink);
      } else {
        console.error("Link missing in response:", res.data);
        toast.error("Payment link not found. Please try again.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Payment failed to initialize",
      );
    } finally {
      setProcessingAction(false);
    }
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
      {order && isCancelModalOpen && (
        <CancelOrderModal
          id={order?.id}
          orderNumber={order.orderNumber}
          open={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={handleCancelOrder}
        />
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <PageHeader back title={`Order Details`} />

        {/* --- DYNAMIC ACTION BUTTONS --- */}
        <div className="flex items-center gap-2">
          {/* Show Cancel Button if not shipped and not already cancelled */}
          {!order.shippedAt && order.status !== "CANCELLED" && (
            <Button
              variant="outline"
              className="text-destructive border-red-100 hover:bg-red-50"
              onClick={() => setIsCancelModalOpen(true)}
            >
              <IconX size={16} className="mr-2" />
              Cancel Order
            </Button>
          )}

          {/* Show Pay Now only for online payment orders that haven't paid */}
          {!order.paidAt &&
            order.status !== "CANCELLED" &&
            order.paymentMethod !== "pay_on_delivery" && (
              <Button disabled={processingAction} onClick={handlePayment}>
                {processingAction ? (
                  <Loader text="Processing..." />
                ) : (
                  <>
                    <IconWallet size={16} className="mr-2" />
                    Pay Now
                  </>
                )}
              </Button>
            )}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT COLUMN: Items & Summary */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="gap-1">
            <CardHeader className="flex flex-row items-center justify-between border-b mb-4">
              <CardTitle>Order Number #{order.orderNumber}</CardTitle>
              <Badge
                variant={
                  order.status === "DELIVERED"
                    ? "default"
                    : order?.status === "CANCELLED"
                      ? "destructive"
                      : "secondary"
                }
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
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className="text-[9px] h-4 px-1.5 uppercase font-bold"
                          variant={
                            item.status === "DELIVERED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
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
                      <CurrencyIcon currency="NGN" />{" "}
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
                    <CurrencyIcon currency="NGN" />{" "}
                    {formatMoneyInput(Number(order.subtotal))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span>
                    <CurrencyIcon currency="NGN" />{" "}
                    {formatMoneyInput(Number(order.deliveryFee))}
                  </span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>
                      -<CurrencyIcon currency="NGN" />{" "}
                      {formatMoneyInput(Number(order.discount))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>
                    <CurrencyIcon currency="NGN" />{" "}
                    {formatMoneyInput(Number(order.total))}
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
          {isPOD && !order.deliveredAt && (
            <Card className="border-amber-100 bg-amber-50/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5 text-amber-800">
                  <IconTruck className="text-amber-600" />
                  Pay on Delivery
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1 text-amber-900">
                <p>
                  Payment will be collected in cash when your order arrives.
                  Please have the exact amount ready.
                </p>
                <p className="font-semibold mt-2">
                  Amount due on delivery:{" "}
                  <CurrencyIcon currency="NGN" />{" "}
                  {formatMoneyInput(Number(order.total))}
                </p>
              </CardContent>
            </Card>
          )}

          {order.paidAt && (
            <Card className="border-green-100 bg-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5">
                  <IconCreditCard className="text-green-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                {order.transactionRef && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Transaction Ref:
                    </span>
                    <span className="font-mono font-medium">
                      {order.transactionRef}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {order.paymentMethod === "pay_on_delivery"
                      ? "Cash on Delivery"
                      : "Online"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge
                    variant="outline"
                    className="bg-white text-green-700 border-green-200 h-5"
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid On:</span>
                  <span>{formatDate(order.paidAt, true)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: Activity Timeline */}
        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-4 before:h-full before:w-0.5 before:bg-muted">
                {/* {activities.map((activity, idx) => {
                  // Determine the color theme for this specific step
                  const isCancelledStep =
                    activity.isCancelled && activity.completed;

                  return (
                    <div
                      key={idx}
                      className="relative flex items-start gap-4 ml-0.5"
                    >
                      <div
                        className={`relative z-10 flex size-7 items-center justify-center rounded-full border-2 bg-white transition-colors ${
                          isCancelledStep
                            ? "border-destructive text-destructive shadow-[0_0_10px_rgba(239,68,68,0.2)]" // Red glow for cancellation
                            : activity.completed
                            ? "border-primary text-primary"
                            : activity.isLoading
                            ? "bg-blue-100 text-blue-600"
                            : "border-muted text-muted-foreground"
                        }`}
                      >
                        {activity.icon}
                      </div>

                      <div className="flex flex-col">
                        <p
                          className={`text-sm font-medium ${
                            isCancelledStep
                              ? "text-destructive"
                              : !activity.completed
                              ? "text-muted-foreground"
                              : "text-foreground"
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
                            <p className="text-xs text-amber-600 font-medium animate-pulse">
                              Awaiting Payment
                            </p>
                          )}
                      </div>
                    </div>
                  );
                })} */}
                {activities.map((activity, idx) => {
                  const isCancelledStep =
                    activity.isCancelled && activity.completed;

                  // Logic for the icon circle colors
                  let circleClass = "border-muted text-muted-foreground"; // Default
                  if (isCancelledStep) {
                    circleClass =
                      "border-destructive text-destructive shadow-[0_0_10px_rgba(239,68,68,0.2)]";
                  } else if (activity.completed) {
                    circleClass = "border-primary text-primary bg-primary/5";
                  } else if (activity.isPartial) {
                    circleClass =
                      "border-blue-500 text-blue-500 bg-blue-50 animate-pulse"; // Blue/Pulse for partial
                  } else if (activity.isLoading) {
                    circleClass = "bg-blue-100 text-blue-600";
                  }

                  return (
                    <div
                      key={idx}
                      className="relative flex items-start gap-4 ml-0.5"
                    >
                      <div
                        className={`relative z-10 flex size-7 items-center justify-center rounded-full border-2 bg-white transition-colors ${circleClass}`}
                      >
                        {activity.icon}
                      </div>

                      <div className="flex flex-col">
                        <p
                          className={`text-sm font-medium ${
                            isCancelledStep
                              ? "text-destructive"
                              : activity.completed
                                ? "text-foreground"
                                : activity.isPartial
                                  ? "text-blue-600"
                                  : "text-muted-foreground"
                          }`}
                        >
                          {activity.label}
                        </p>

                        {activity.date && (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.date, true)}
                          </p>
                        )}

                        {/* Dynamic Help Text */}
                        {!activity.completed && activity.isPartial && (
                          <p className="text-[10px] text-blue-500 font-medium italic">
                            Waiting for remaining items...
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
