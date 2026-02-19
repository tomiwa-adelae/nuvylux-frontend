"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Loader } from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { IconCalendar, IconChevronRight, IconClock } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { bookingService } from "@/lib/bookings";
import { Booking } from "@/types";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  console.log(bookings);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader
        title="My Bookings"
        back
        description="Manage your service requests and appointments"
      />

      <div className="mt-4 space-y-2">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
            <p className="text-muted-foreground">
              You haven't made any bookings yet.
            </p>
            <Link
              href="/services"
              className="text-primary font-medium mt-2 inline-block"
            >
              Explore Services
            </Link>
          </div>
        ) : (
          bookings.map((booking) => (
            <Card
              key={booking.id}
              className="hover:border-primary/50 transition-colors group p-1.5"
            >
              <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-2 p-1.5">
                {/* Service Thumbnail */}
                <Link
                  href={`/bookings/${booking.bookingNumber}`}
                  className="relative size-16 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                >
                  <Image
                    src={booking.service.thumbnail || "/placeholder.png"}
                    alt={booking.service.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Info */}
                <div className="w-full flex-1 space-y-1">
                  <div className="flex items-center justify-between w-full">
                    <CardTitle className="group-hover:text-primary hover:underline">
                      <Link href={`/bookings/${booking.bookingNumber}`}>
                        {booking.service.name}
                      </Link>
                    </CardTitle>
                    <p className="font-bold">
                      <CurrencyIcon currency="NGN" />
                      {Number(booking.totalAmount).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <IconClock className="size-4" />
                      <span>ID: {booking.bookingNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IconCalendar className="size-4" />
                      <span>
                        {booking.scheduledAt
                          ? formatDate(booking.scheduledAt)
                          : "Project-based"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                  <Badge
                    variant={
                      booking.paymentStatus === "PAID" ? "default" : "outline"
                    }
                  >
                    {booking.paymentStatus}
                  </Badge>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                  {/* <IconChevronRight className="hidden md:block text-muted-foreground" /> */}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Helper for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-500 hover:bg-green-600";
    case "PENDING":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "CANCELLED":
      return "bg-red-500 hover:bg-red-600";
    case "COMPLETED":
      return "bg-blue-500 hover:bg-blue-600";
    default:
      return "bg-gray-500";
  }
};

export default MyBookingsPage;
