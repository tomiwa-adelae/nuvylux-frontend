"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Loader } from "@/components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { TimelineItem } from "@/components/TimelineItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconCalendar,
  IconClock,
  IconFileDownload,
  IconReceipt2,
  IconCheck,
  IconLoader2,
  IconPlayerPlay,
  IconX,
  IconMail,
  IconPhone,
  IconClipboardCheck,
  IconBriefcase,
} from "@tabler/icons-react";
import Image from "next/image";
import { bookingService } from "@/lib/bookings";
import { Booking, BookingStatus } from "@/types";
import { toast } from "sonner";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";

const STATUS_ORDER: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
];

const statusVariant = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "CONFIRMED":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
};

const ProviderBookingDetailPage = () => {
  const { bookingNumber } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchBooking = async () => {
    try {
      const data = await bookingService.getProviderBookingDetails(
        bookingNumber as string,
      );
      setBooking(data);
    } catch (error: any) {
      console.error("Failed to load booking:", error);
      toast.error(
        error.response?.data?.message || "Failed to load booking details",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingNumber) fetchBooking();
  }, [bookingNumber]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      await bookingService.updateBookingStatus(
        bookingNumber as string,
        newStatus,
      );
      toast.success(
        `Booking ${newStatus === "CANCELLED" ? "cancelled" : `marked as ${newStatus.toLowerCase().replace("_", " ")}`}`,
      );
      await fetchBooking();
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
        <p>Loading booking details...</p>
      </div>
    );

  if (!booking)
    return <div className="p-10 text-center">Booking not found.</div>;

  const isAtLeast = (target: BookingStatus) =>
    STATUS_ORDER.indexOf(booking.status) >= STATUS_ORDER.indexOf(target);

  const canCancel =
    booking.status !== "COMPLETED" && booking.status !== "CANCELLED";

  return (
    <div>
      <PageHeader
        back
        title="Booking Brief"
        description={booking.bookingNumber}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarImage
                    src={booking.client?.image || DEFAULT_PROFILE_IMAGE}
                    alt={`${booking.client?.firstName}'s picture`}
                    className="object-cover size-full"
                  />
                  <AvatarFallback>
                    {booking.client?.firstName?.[0]}
                    {booking.client?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-base">
                    {booking.client?.firstName} {booking.client?.lastName}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <IconMail size={14} /> {booking.client?.email}
                    </span>
                    {booking.client?.phoneNumber && (
                      <a
                        href={`tel:${booking.client.phoneNumber}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <IconPhone size={14} />{" "}
                        {formatPhoneNumber(booking.client.phoneNumber)}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Badge variant={statusVariant(booking.status)}>
                  {booking.status.replace("_", " ")}
                </Badge>
                <Badge
                  variant={
                    booking.paymentStatus === "PAID" ? "default" : "destructive"
                  }
                >
                  {booking.paymentStatus === "PAID"
                    ? "Payment Received"
                    : "Awaiting Payment"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Service & Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service & Schedule</CardTitle>
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
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {booking.service.shortDescription}
                      </p>
                    )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
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

              {"type" in booking.service && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Service Type
                    </p>
                    <p className="font-medium text-sm mt-1 capitalize">
                      {(booking.service as any).type?.toLowerCase()}
                    </p>
                  </div>
                  {"deliveryMode" in booking.service && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Delivery Mode
                      </p>
                      <p className="font-medium text-sm mt-1 capitalize">
                        {(booking.service as any).deliveryMode
                          ?.toLowerCase()
                          .replace("_", " ")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Requirements & Attachments */}
          <Card className="gap-1.5">
            <CardHeader>
              <CardTitle className="text-lg">
                Requirements & Attachments
              </CardTitle>
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

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="space-y-4">
          {/* Card 4: Booking Management */}
          <Card className="border-primary/20 bg-primary/5 gap-1">
            <CardHeader>
              <CardTitle className="text-base">Booking Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={statusVariant(booking.status)}
                  className="capitalize"
                >
                  {booking.status.toLowerCase().replace("_", " ")}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                {/* PENDING + PAID → Accept */}
                {booking.status === "PENDING" &&
                  booking.paymentStatus === "PAID" && (
                    <Button
                      className="w-full gap-2"
                      onClick={() => updateStatus("CONFIRMED")}
                      disabled={updating}
                    >
                      {updating ? (
                        <IconLoader2 className="animate-spin" size={18} />
                      ) : (
                        <IconCheck size={18} />
                      )}
                      Accept Booking
                    </Button>
                  )}

                {/* PENDING + NOT PAID → Info */}
                {booking.status === "PENDING" &&
                  booking.paymentStatus !== "PAID" && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 p-3 rounded-md text-center text-sm font-medium">
                      Awaiting client payment
                    </div>
                  )}

                {/* CONFIRMED → Start */}
                {booking.status === "CONFIRMED" && (
                  <Button
                    className="w-full gap-2"
                    onClick={() => updateStatus("IN_PROGRESS")}
                    disabled={updating}
                  >
                    {updating ? (
                      <IconLoader2 className="animate-spin" size={18} />
                    ) : (
                      <IconPlayerPlay size={18} />
                    )}
                    Start Service
                  </Button>
                )}

                {/* IN_PROGRESS → Complete */}
                {booking.status === "IN_PROGRESS" && (
                  <Button
                    className="w-full gap-2"
                    onClick={() => updateStatus("COMPLETED")}
                    disabled={updating}
                  >
                    {updating ? (
                      <IconLoader2 className="animate-spin" size={18} />
                    ) : (
                      <IconClipboardCheck size={18} />
                    )}
                    Mark as Completed
                  </Button>
                )}

                {/* COMPLETED → Success */}
                {booking.status === "COMPLETED" && (
                  <div className="bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 p-3 rounded-md text-center text-sm font-medium">
                    Service completed successfully
                  </div>
                )}

                {/* CANCELLED → Info */}
                {booking.status === "CANCELLED" && (
                  <div className="bg-muted text-muted-foreground p-3 rounded-md text-center text-sm font-medium">
                    This booking has been cancelled
                  </div>
                )}

                {/* Cancel button */}
                {canCancel && (
                  <>
                    <Separator />
                    <Button
                      className="w-full gap-2"
                      variant="destructive"
                      onClick={() => updateStatus("CANCELLED")}
                      disabled={updating}
                    >
                      {updating ? (
                        <IconLoader2 className="animate-spin" size={18} />
                      ) : (
                        <IconX size={18} />
                      )}
                      Cancel Booking
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <IconReceipt2 size={18} /> Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
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
                <span>Total</span>
                <span className="text-primary">
                  <CurrencyIcon currency="NGN" />
                  {Number(booking.totalAmount).toLocaleString()}
                </span>
              </div>

              {booking.paymentStatus === "PAID" && booking.transactionRef && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Transaction Reference
                    </p>
                    <code className="text-sm block p-2.5 bg-green-500/5 text-green-700 dark:text-green-400 border border-green-500/20 rounded-lg truncate">
                      {booking.transactionRef}
                    </code>
                    <p className="text-xs text-muted-foreground">
                      Paid on:{" "}
                      {booking.paidAt ? formatDate(booking.paidAt) : "N/A"}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card 6: Activity Timeline */}
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

export default ProviderBookingDetailPage;
