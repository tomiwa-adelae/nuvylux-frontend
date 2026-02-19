"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { formatDate, formatMoneyInput } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import { serviceService } from "@/lib/services";
import { bookingService } from "@/lib/bookings";
import { Booking, Service } from "@/types";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconFolder,
  IconCalendar,
  IconClock,
  IconWallet,
  IconPlus,
  IconChevronRight,
  IconMail,
} from "@tabler/icons-react";

export const ProviderDashboard = () => {
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, bookingsData] = await Promise.all([
          serviceService.getMyServices(),
          bookingService.getIncomingBookings(),
        ]);
        setServices(servicesData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  const activeServices = services.filter(
    (s) => s.status === "ACTIVE"
  ).length;

  const pendingBookings = bookings.filter(
    (b) => b.status === "PENDING"
  ).length;

  const totalEarnings = bookings
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

  const recentBookings = bookings.slice(0, 3);
  const recentServices = services.slice(0, 3);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName}`}
        description="Here's an overview of your services and bookings"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={<IconFolder className="size-5 text-primary" />}
          label="Active Services"
          value={activeServices.toString()}
          sub={`${services.length} total`}
        />
        <StatCard
          icon={<IconCalendar className="size-5 text-primary" />}
          label="Total Bookings"
          value={bookings.length.toString()}
        />
        <StatCard
          icon={<IconClock className="size-5 text-primary" />}
          label="Pending Requests"
          value={pendingBookings.toString()}
        />
        <StatCard
          icon={<IconWallet className="size-5 text-primary" />}
          label="Total Earnings"
          value={
            <>
              <CurrencyIcon currency="NGN" />
              {formatMoneyInput(totalEarnings)}
            </>
          }
        />
      </div>

      {/* Recent Bookings */}
      <SectionHeader title="Recent Bookings" href="/dashboard/bookings" />
      <div className="space-y-2 mb-8">
        {recentBookings.length > 0 ? (
          recentBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden p-0">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                  {/* Client Info */}
                  <div className="p-4 md:w-56 border-b md:border-b-0 md:border-r">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="size-9">
                        <AvatarImage
                          src={booking.client?.image || DEFAULT_PROFILE_IMAGE}
                          alt={booking.client?.firstName || "Client"}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {booking.client?.firstName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {booking.client?.firstName} {booking.client?.lastName}
                        </p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                          <IconMail size={10} />
                          {booking.client?.email}
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

                  {/* Booking Details */}
                  <div className="p-4 flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <CardTitle className="text-sm">
                        {booking.service.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <IconCalendar size={12} />
                          {booking.scheduledAt
                            ? formatDate(booking.scheduledAt)
                            : "Project-based"}
                        </span>
                        <span className="font-medium text-foreground">
                          <CurrencyIcon currency="NGN" />{" "}
                          {formatMoneyInput(Number(booking.totalAmount))}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={`/dashboard/bookings/${booking.bookingNumber}`}
                        >
                          View Brief
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<IconCalendar className="size-10" />}
            message="No bookings yet"
            actionLabel="Manage your services"
            actionHref="/dashboard/services"
          />
        )}
      </div>

      {/* Your Services */}
      <SectionHeader title="Your Services" href="/dashboard/services" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {recentServices.length > 0 ? (
          recentServices.map((service) => (
            <Card
              key={service.id}
              className="overflow-hidden hover:border-primary/50 transition-colors group p-0"
            >
              <Link href={`/dashboard/services/${service.slug}`}>
                <div className="relative h-40 bg-muted">
                  <Image
                    src={service.thumbnail || "/placeholder.png"}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                  <Badge
                    variant={
                      service.status === "ACTIVE" ? "default" : "secondary"
                    }
                    className="absolute top-2 right-2 text-[10px]"
                  >
                    {service.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-sm truncate group-hover:text-primary">
                    {service.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold">
                      <CurrencyIcon currency="NGN" />
                      {formatMoneyInput(Number(service.price))}
                    </p>
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {service.pricingType}
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              icon={<IconFolder className="size-10" />}
              message="No services yet"
              actionLabel="Create your first service"
              actionHref="/dashboard/services/new"
            />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Separator className="mb-6" />
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/dashboard/services/new">
            <IconPlus className="size-4" />
            Add New Service
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/bookings">
            <IconCalendar className="size-4" />
            View All Bookings
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/services">
            <IconFolder className="size-4" />
            Manage Services
          </Link>
        </Button>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
}) => (
  <Card>
    <CardContent className="py-4 px-5">
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && (
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      )}
    </CardContent>
  </Card>
);

const SectionHeader = ({
  title,
  href,
}: {
  title: string;
  href: string;
}) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-lg font-semibold">{title}</h2>
    <Button variant="ghost" size="sm" asChild>
      <Link href={href}>
        View All
        <IconChevronRight className="size-4" />
      </Link>
    </Button>
  </div>
);

const EmptyState = ({
  icon,
  message,
  actionLabel,
  actionHref,
}: {
  icon: React.ReactNode;
  message: string;
  actionLabel: string;
  actionHref: string;
}) => (
  <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed">
    <div className="text-muted-foreground/50 flex justify-center">{icon}</div>
    <p className="mt-3 text-muted-foreground font-medium">{message}</p>
    <Button variant="link" asChild className="mt-1">
      <Link href={actionHref}>{actionLabel}</Link>
    </Button>
  </div>
);

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
    case "IN_PROGRESS":
      return "bg-indigo-500 hover:bg-indigo-600";
    default:
      return "bg-gray-500";
  }
};
