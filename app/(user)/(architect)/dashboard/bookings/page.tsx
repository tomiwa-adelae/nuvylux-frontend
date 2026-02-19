"use client";
import React, { useEffect, useState } from "react";
import { bookingService } from "@/lib/bookings";
import { PageHeader } from "@/components/PageHeader";
import { Loader } from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { formatDate } from "@/lib/utils";
import { IconUser, IconCalendar, IconMail } from "@tabler/icons-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Booking } from "@/types";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";
import { Button } from "@/components/ui/button";

const page = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(bookings);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getIncomingBookings();
        setBookings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHeader
        back
        title="Incoming Requests"
        description="Manage services booked by your clients"
      />

      <div className="mt-4 space-y-2">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden p-0">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Client Profile Side */}
                <div className="p-6 md:w-64 border-r">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={booking.client?.image || DEFAULT_PROFILE_IMAGE}
                        alt={`${booking.client?.firstName}'s picture` || ""}
                        className="object-cover size-full"
                      />
                      <AvatarFallback>Nuvylux</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {booking?.client?.firstName} {booking?.client?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <IconMail size={10} /> {booking?.client?.email}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className="w-full justify-center"
                    variant={
                      booking.paymentStatus === "PAID" ? "default" : "outline"
                    }
                  >
                    {booking.paymentStatus}
                  </Badge>
                </div>

                {/* Service Details Side */}
                <div className="pt-0 p-6 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>{booking.service.name}</CardTitle>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IconCalendar size={14} />{" "}
                        {booking.scheduledAt
                          ? formatDate(booking.scheduledAt)
                          : "Project-based"}
                      </span>
                      <span className="font-medium text-foreground">
                        <CurrencyIcon currency="NGN" />{" "}
                        {booking.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full md:w-auto"
                    size={"sm"}
                    variant={"outline"}
                    asChild
                  >
                    <Link href={`/dashboard/bookings/${booking.bookingNumber}`}>
                      View Brief
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
