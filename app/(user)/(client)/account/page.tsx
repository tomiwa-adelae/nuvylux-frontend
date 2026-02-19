"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { OrderCard } from "../_components/OrderCard";
import { formatDate, formatMoneyInput } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import { orderService } from "@/lib/orders";
import { bookingService } from "@/lib/bookings";
import { savedService } from "@/lib/saved";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";
import { Order, Booking } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  IconShoppingBag,
  IconCalendar,
  IconHeart,
  IconWallet,
  IconSettings,
  IconCompass,
  IconClock,
  IconMapPin,
  IconChevronRight,
} from "@tabler/icons-react";

const AccountPage = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, bookingsData, savedData] = await Promise.all([
          orderService.getMyOrders(),
          bookingService.getMyBookings(),
          savedService.getMySavedProducts(),
        ]);
        setOrders(ordersData);
        setBookings(bookingsData);
        setSavedCount(savedData.length);
      } catch (error) {
        console.error("Failed to fetch account data", error);
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

  const activeBookings = bookings.filter((b) =>
    ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(b.status)
  ).length;

  const totalSpent = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const recentOrders = orders.slice(0, 3);
  const recentBookings = bookings.slice(0, 3);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName}`}
        description="Here's an overview of your account activity"
      />

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6">
          <Image
            src={user?.image || DEFAULT_PROFILE_IMAGE}
            alt={`${user?.firstName} ${user?.lastName}`}
            width={80}
            height={80}
            className="rounded-full object-cover size-20 border"
          />
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{user?.email}</span>
              {user?.city && user?.state && (
                <span className="flex items-center gap-1">
                  <IconMapPin className="size-3.5" />
                  {user.city}, {user.state}
                </span>
              )}
              {user?.createdAt && (
                <span className="flex items-center gap-1">
                  <IconClock className="size-3.5" />
                  Member since {formatDate(user.createdAt)}
                </span>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">
              <IconSettings className="size-4" />
              Edit Profile
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={<IconShoppingBag className="size-5 text-primary" />}
          label="Total Orders"
          value={orders.length.toString()}
        />
        <StatCard
          icon={<IconCalendar className="size-5 text-primary" />}
          label="Active Bookings"
          value={activeBookings.toString()}
        />
        <StatCard
          icon={<IconHeart className="size-5 text-primary" />}
          label="Saved Items"
          value={savedCount.toString()}
        />
        <StatCard
          icon={<IconWallet className="size-5 text-primary" />}
          label="Total Spent"
          value={
            <>
              <CurrencyIcon currency="NGN" />
              {formatMoneyInput(totalSpent)}
            </>
          }
        />
      </div>

      {/* Recent Orders */}
      <SectionHeader title="Recent Orders" href="/orders" />
      <div className="space-y-4 mb-8">
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <EmptyState
            icon={<IconShoppingBag className="size-10" />}
            message="No orders yet"
            actionLabel="Browse Marketplace"
            actionHref="/explore"
          />
        )}
      </div>

      {/* Recent Bookings */}
      <SectionHeader title="Recent Bookings" href="/bookings" />
      <div className="space-y-2 mb-8">
        {recentBookings.length > 0 ? (
          recentBookings.map((booking) => (
            <Card
              key={booking.id}
              className="hover:border-primary/50 transition-colors group p-1.5"
            >
              <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-2 p-1.5">
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
                <div className="w-full flex-1 space-y-1">
                  <div className="flex items-center justify-between w-full">
                    <CardTitle className="group-hover:text-primary hover:underline">
                      <Link href={`/bookings/${booking.bookingNumber}`}>
                        {booking.service.name}
                      </Link>
                    </CardTitle>
                    <p className="font-bold">
                      <CurrencyIcon currency="NGN" />
                      {formatMoneyInput(Number(booking.totalAmount))}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <IconClock className="size-4" />
                      ID: {booking.bookingNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconCalendar className="size-4" />
                      {booking.scheduledAt
                        ? formatDate(booking.scheduledAt)
                        : "Project-based"}
                    </span>
                  </div>
                </div>
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
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={<IconCalendar className="size-10" />}
            message="No bookings yet"
            actionLabel="Explore Services"
            actionHref="/services"
          />
        )}
      </div>

      {/* Quick Actions */}
      <Separator className="mb-6" />
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/explore">
            <IconCompass className="size-4" />
            Browse Marketplace
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/saved">
            <IconHeart className="size-4" />
            Saved Items
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/settings">
            <IconSettings className="size-4" />
            Account Settings
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
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <Card>
    <CardContent className="py-4 px-5">
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">{value}</p>
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

export default AccountPage;
