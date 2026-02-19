"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { adminService } from "@/lib/admin";
import { useAuth } from "@/store/useAuth";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  IconUsers,
  IconShoppingBag,
  IconCalendar,
  IconBox,
  IconBriefcase,
  IconWallet,
  IconChevronRight,
} from "@tabler/icons-react";

const DEFAULT_IMAGE = "/assets/images/profile-img.jpg";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.firstName}`}
        description="Platform overview and management"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2 mt-4">
        <StatCard
          icon={<IconUsers className="size-5" />}
          label="Users"
          value={stats.totalUsers}
          href="/admin/users"
        />
        <StatCard
          icon={<IconShoppingBag className="size-5" />}
          label="Orders"
          value={stats.totalOrders}
          href="/admin/orders"
        />
        <StatCard
          icon={<IconCalendar className="size-5" />}
          label="Bookings"
          value={stats.totalBookings}
          href="/admin/bookings"
        />
        <StatCard
          icon={<IconBox className="size-5" />}
          label="Products"
          value={stats.totalProducts}
          href="/admin/products"
        />
        <StatCard
          icon={<IconBriefcase className="size-5" />}
          label="Services"
          value={stats.totalServices}
          href="/admin/services"
        />
        <StatCard
          icon={<IconWallet className="size-5" />}
          label="Revenue"
          value={
            <span className="flex items-center">
              <CurrencyIcon currency="NGN" />
              {Number(stats.totalRevenue).toLocaleString()}
            </span>
          }
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mt-6">
        {/* Recent Orders */}
        <Card className="gap-0">
          <SectionHeader title="Recent Orders" href="/admin/orders" />
          <CardContent>
            <div className="space-y-3 mt-4">
              {stats.recentOrders?.length === 0 && (
                <p className="text-sm text-muted-foreground">No orders yet</p>
              )}
              {stats.recentOrders?.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.orderNumber}`}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={order.user?.image || DEFAULT_IMAGE}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full size-8 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {order.user?.firstName} {order.user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{order.orderNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold flex items-center">
                      <CurrencyIcon currency="NGN" />
                      {Number(order.total).toLocaleString()}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="gap-0">
          <SectionHeader title="Recent Bookings" href="/admin/bookings" />
          <CardContent>
            <div className="space-y-3 mt-4">
              {stats.recentBookings?.length === 0 && (
                <p className="text-sm text-muted-foreground">No bookings yet</p>
              )}
              {stats.recentBookings?.map((booking: any) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.bookingNumber}`}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={booking.client?.image || DEFAULT_IMAGE}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full size-8 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {booking.client?.firstName} {booking.client?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {booking.service?.name}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="gap-0">
          <SectionHeader title="New Users" href="/admin/users" />
          <CardContent>
            <div className="space-y-3 mt-4">
              {stats.recentUsers?.length === 0 && (
                <p className="text-sm text-muted-foreground">No users yet</p>
              )}
              {stats.recentUsers?.map((u: any) => (
                <Link
                  key={u.id}
                  href={`/admin/users/${u.id}`}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={u.image || DEFAULT_IMAGE}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full size-8 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {u.role}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  href?: string;
}) {
  const content = (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent>
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          {icon}
          <span className="text-xs font-medium">{label}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <CardHeader className="flex items-center justify-between">
      <CardTitle>{title}</CardTitle>
      <Link
        href={href}
        className="text-xs text-primary hover:underline flex items-center gap-0.5"
      >
        View All <IconChevronRight className="size-3" />
      </Link>
    </CardHeader>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    PAID: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colorMap[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}
