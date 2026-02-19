"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Loader } from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { TimelineItem } from "@/components/TimelineItem";
import {
  IconCalendar,
  IconClock,
  IconCreditCard,
  IconFileDownload,
  IconInfoCircle,
  IconReceipt2,
  IconCheck,
  IconPlayerPlay,
  IconClipboardCheck,
  IconBriefcase,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { bookingService } from "@/lib/bookings";
import { Booking, BookingStatus } from "@/types";
import { toast } from "sonner";
import api from "@/lib/api";

const STATUS_ORDER: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
];

const statusVariant = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "default" as const;
    case "CONFIRMED":
      return "default" as const;
    case "IN_PROGRESS":
      return "secondary" as const;
    case "CANCELLED":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "CONFIRMED":
      return "Confirmed";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking>();
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchDetails = async () => {
    try {
      const data = await bookingService.getMyBookingDetails(id as string);
      setBooking(data);
    } catch (error) {
      console.error("Failed to load booking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handlePayment = async () => {
    setIsPaying(true);
    toast.loading("Preparing payment gateway...", { id: "payment" });

    try {
      const res = await api.post(`/bookings/${booking?.id}/pay`);
      const { data } = res.data;

      if (data?.link) {
        toast.success("Redirecting to Flutterwave...", { id: "payment" });
        window.location.href = data.link;
      } else {
        throw new Error("Could not retrieve payment link");
      }
    } catch (error: any) {
      console.error("Payment Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment",
        { id: "payment" },
      );
    } finally {
      setIsPaying(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await bookingService.cancelMyBooking(booking!.bookingNumber);
      toast.success(
        booking?.paymentStatus === "PAID"
          ? "Booking cancelled. A refund has been initiated."
          : "Booking cancelled successfully.",
      );
      await fetchDetails();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return <Loader />;
  if (!booking)
    return <div className="p-20 text-center">Booking not found.</div>;

  const isAtLeast = (target: BookingStatus) =>
    STATUS_ORDER.indexOf(booking.status) >= STATUS_ORDER.indexOf(target);

  const canCancel =
    booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
    <div>
      <PageHeader
        back
        title={`Booking ${booking.bookingNumber}`}
        description="Detailed overview of your service request"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-3">
          {/* Status Banner */}
          <Card>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <IconInfoCircle className="text-primary size-5" />
                Status:{" "}
                <Badge variant={statusVariant(booking.status)}>
                  {statusLabel(booking.status)}
                </Badge>
              </div>
              <Badge
                variant={
                  booking.paymentStatus === "PAID"
                    ? "default"
                    : booking.paymentStatus === "REFUNDED"
                      ? "secondary"
                      : "destructive"
                }
              >
                {booking.paymentStatus === "PAID"
                  ? "Payment Successful"
                  : booking.paymentStatus === "REFUNDED"
                    ? "Refund Initiated"
                    : "Payment Pending"}
              </Badge>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="relative size-20 rounded-lg overflow-hidden shrink-0 border">
                  <Image
                    src={booking.service.thumbnail || "/placeholder.png"}
                    alt="service"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">
                    {booking.service.name}
                  </h3>
                  {"shortDescription" in booking.service &&
                    booking.service.shortDescription && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {booking.service.shortDescription}
                      </p>
                    )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Scheduled For
                  </p>
                  <p className="font-medium flex items-center text-base gap-2 mt-1">
                    <IconCalendar size={16} />
                    {booking.scheduledAt
                      ? formatDate(booking.scheduledAt)
                      : "Project-based"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Time Slot
                  </p>
                  <p className="font-medium text-base flex items-center gap-2 mt-1">
                    <IconClock size={16} />
                    {booking.scheduledAt
                      ? new Date(booking.scheduledAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Flexible"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements & Attachments */}
          <Card className="gap-1.5">
            <CardHeader>
              <CardTitle>Requirements & Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted text-sm italic">
                &ldquo;
                {booking.requirements || "No specific requirements provided."}
                &rdquo;
              </div>

              {booking.attachments?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Uploaded Files ({booking.attachments.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {booking.attachments.map((url: string, index: number) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative aspect-square rounded-md overflow-hidden border hover:border-primary transition-all"
                      >
                        <Image
                          src={url}
                          alt={`attachment-${index}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <IconFileDownload className="text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 space-y-4">
          {/* Payment Summary */}
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconReceipt2 /> Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Price</span>
                <span>
                  <CurrencyIcon currency="NGN" />
                  {Number(booking.price).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee (5%)</span>
                <span>
                  <CurrencyIcon currency="NGN" />
                  {Number(booking.serviceFee).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total Amount</span>
                <span className="text-primary">
                  <CurrencyIcon currency="NGN" />
                  {Number(booking.totalAmount).toLocaleString()}
                </span>
              </div>

              <Separator />

              {booking.paymentStatus === "REFUNDED" ? (
                <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 p-3 rounded-md text-center text-sm font-medium">
                  Refund has been initiated
                </div>
              ) : booking.paymentStatus !== "PAID" ? (
                <div>
                  <Button
                    onClick={handlePayment}
                    disabled={isPaying || booking.status === "CANCELLED"}
                    className="w-full"
                  >
                    {isPaying ? (
                      <IconLoader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <IconCreditCard /> Pay Now & Confirm
                      </>
                    )}
                  </Button>
                  {booking.status !== "CANCELLED" && (
                    <p className="text-xs text-center text-muted-foreground mt-2 leading-tight">
                      Secure payment powered by Flutterwave. Your booking will
                      be confirmed immediately after payment.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase font-semibold">
                    Transaction Reference
                  </p>
                  <code className="text-sm block p-2.5 bg-green-500/5 text-green-700 dark:text-green-400 border border-green-500/20 rounded-lg truncate">
                    {booking.transactionRef || "N/A"}
                  </code>
                  <p className="text-xs text-muted-foreground">
                    Paid on:{" "}
                    {booking.paidAt ? formatDate(booking.paidAt) : "N/A"}
                  </p>
                </div>
              )}

              {/* Cancel Booking */}
              {canCancel && (
                <>
                  <Separator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="w-full gap-2"
                        variant="destructive"
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <IconLoader2 className="animate-spin" size={18} />
                        ) : (
                          <IconX size={18} />
                        )}
                        Cancel Booking
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Cancel this booking?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {booking.paymentStatus === "PAID"
                            ? "This booking has already been paid for. Cancelling will initiate a refund to your original payment method. This action cannot be undone."
                            : "Are you sure you want to cancel this booking? This action cannot be undone."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancel}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, Cancel Booking
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TimelineItem
                label="Booking Requested"
                date={booking.createdAt}
                icon={<IconBriefcase size={14} />}
                active
              />
              <TimelineItem
                label="Payment Received"
                date={booking.paidAt}
                icon={<IconReceipt2 size={14} />}
                active={
                  booking.paymentStatus === "PAID" ||
                  booking.paymentStatus === "REFUNDED"
                }
              />
              {booking.status === "CANCELLED" ? (
                <TimelineItem
                  label="Booking Cancelled"
                  date={booking.updatedAt}
                  icon={<IconX size={14} />}
                  active
                  destructive
                  isLast
                />
              ) : (
                <>
                  <TimelineItem
                    label="Booking Accepted"
                    date={isAtLeast("CONFIRMED") ? booking.updatedAt : null}
                    icon={<IconCheck size={14} />}
                    active={isAtLeast("CONFIRMED")}
                  />
                  <TimelineItem
                    label="Service In Progress"
                    date={isAtLeast("IN_PROGRESS") ? booking.updatedAt : null}
                    icon={<IconPlayerPlay size={14} />}
                    active={isAtLeast("IN_PROGRESS")}
                  />
                  <TimelineItem
                    label="Service Completed"
                    date={isAtLeast("COMPLETED") ? booking.updatedAt : null}
                    icon={<IconClipboardCheck size={14} />}
                    active={isAtLeast("COMPLETED")}
                    isLast
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
