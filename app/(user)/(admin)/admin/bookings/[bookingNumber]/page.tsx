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
const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminBookingDetailPage() {
  const { bookingNumber } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      const data = await adminService.getBookingDetails(
        bookingNumber as string,
      );
      setBooking(data);
    } catch (error) {
      console.error("Failed to fetch booking", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingNumber]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await adminService.updateBookingStatus(
        bookingNumber as string,
        newStatus,
      );
      toast.success("Booking status updated");
      fetchBooking();
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

  if (!booking)
    return <div className="py-20 text-center">Booking not found</div>;

  return (
    <div>
      <PageHeader
        back
        title={`Booking #${booking.bookingNumber}`}
        description={`Created on ${formatDate(booking.createdAt)}`}
        badges={[booking.status, booking.paymentStatus]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Service Details */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {booking.service?.thumbnail && (
                  <Image
                    src={booking.service.thumbnail}
                    alt=""
                    width={60}
                    height={60}
                    className="rounded-lg size-14 object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{booking.service?.name}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {booking.service?.type}
                    </span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {booking.service?.deliveryMode}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {booking.requirements && (
            <Card className="gap-1">
              <CardHeader>
                <CardTitle className="text-base">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm bg-muted p-4 rounded-lg italic">
                  &ldquo;{booking.requirements}&rdquo;
                </p>
              </CardContent>
            </Card>
          )}

          {/* Attachments */}
          {booking.attachments?.length > 0 && (
            <Card className="gap-1">
              <CardHeader>
                <CardTitle className="text-base">Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {booking.attachments.map((url: string, i: number) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={url}
                        alt={`Attachment ${i + 1}`}
                        width={200}
                        height={200}
                        className="rounded-lg w-full aspect-square object-cover hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Summary */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Price</span>
                  <span className="flex items-center">
                    <CurrencyIcon currency="NGN" />
                    {Number(booking.price).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Fee</span>
                  <span className="flex items-center">
                    <CurrencyIcon currency="NGN" />
                    {Number(booking.serviceFee).toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="flex items-center">
                    <CurrencyIcon currency="NGN" />
                    {Number(booking.totalAmount).toLocaleString()}
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
                defaultValue={booking.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOKING_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Client */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Client</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/admin/users/${booking.client?.id}`}
                className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
              >
                <Image
                  src={booking.client?.image || DEFAULT_IMAGE}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full size-10 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    {booking.client?.firstName} {booking.client?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.client?.email}
                  </p>
                </div>
                <IconExternalLink className="size-4 text-muted-foreground shrink-0" />
              </Link>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`mailto:${booking.client?.email}`}>
                    <IconMail />
                    Email Client
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Provider */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Service Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/admin/users/${booking.user?.id}`}
                className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
              >
                <Image
                  src={booking.user?.image || DEFAULT_IMAGE}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full size-10 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">
                    {booking.user?.firstName} {booking.user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.user?.email}
                  </p>
                </div>
                <IconExternalLink className="size-4 text-muted-foreground shrink-0" />
              </Link>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`mailto:${booking.user?.email}`}>
                    <IconMail />
                    Email Provider
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          {booking.scheduledAt && (
            <Card className="gap-1">
              <CardHeader>
                <CardTitle className="text-base">Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{formatDate(booking.scheduledAt)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
