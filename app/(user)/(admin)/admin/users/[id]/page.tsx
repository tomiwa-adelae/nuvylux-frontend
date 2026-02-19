"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Loader2, KeyRound } from "lucide-react";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconShoppingBag,
  IconBriefcase,
  IconFolder,
  IconChevronRight,
  IconExternalLink,
} from "@tabler/icons-react";

const DEFAULT_IMAGE = "/assets/images/profile-img.jpg";
const ROLES = [
  "USER",
  "CLIENT",
  "BRAND",
  "PROFESSIONAL",
  "ARTISAN",
  "ADMINISTRATOR",
];

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const fetchUser = async () => {
    try {
      const data = await adminService.getUserDetails(id as string);
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleRoleChange = async (newRole: string) => {
    try {
      await adminService.updateUser(id as string, { role: newRole });
      toast.success("User role updated");
      fetchUser();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleResetPassword = async () => {
    if (
      !confirm(
        "This will generate a new password and send it to the user's email. Continue?",
      )
    )
      return;
    setResetting(true);
    try {
      await adminService.resetUserPassword(id as string);
      toast.success("Password reset. New password sent to user's email.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setResetting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await adminService.deleteUser(id as string);
      toast.success("User deactivated");
      fetchUser();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to deactivate");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  if (!user) return <div className="py-20 text-center">User not found</div>;

  return (
    <div>
      <PageHeader
        back
        title="User Details"
        description={`Managing ${user.firstName} ${user.lastName}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Profile Card */}
        <div>
          <Card>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Image
                  src={user.image || DEFAULT_IMAGE}
                  alt=""
                  width={80}
                  height={80}
                  className="rounded-full size-20 object-cover"
                />
                <h2 className="mt-3 text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {user.role}
                </Badge>
                {user.isDeleted && (
                  <Badge variant="destructive" className="mt-1">
                    Deactivated
                  </Badge>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconMail className="size-4" />
                  <a
                    href={`mailto:${user.email}`}
                    className="hover:underline hover:text-primary"
                  >
                    {user.email}
                  </a>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconPhone className="size-4" />
                    <a
                      href={`tel:${user.phoneNumber}`}
                      className="hover:underline hover:text-primary"
                    >
                      {formatPhoneNumber(user.phoneNumber)}
                    </a>
                  </div>
                )}
                {(user.city || user.state || user.country) && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconMapPin className="size-4" />
                    <span>
                      {[user.city, user.state, user.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IconCalendar className="size-4" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Quick Actions */}
              <div className="space-y-2">
                <a
                  href={`mailto:${user.email}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <IconMail className="size-4" />
                  Send Email
                </a>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResetPassword}
                  disabled={resetting}
                >
                  {resetting ? (
                    <Loader2 className="animate-spin size-4 mr-1" />
                  ) : (
                    <KeyRound />
                  )}
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Role Management */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Current role
                  </p>
                  <Select
                    defaultValue={user.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card className="gap-1">
            <CardHeader>
              <CardTitle className="text-base">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-2">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <IconShoppingBag className="size-5 text-primary" />
                  <div>
                    <p className="text-xl font-bold">
                      {user._count?.orders || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <IconCalendar className="size-5 text-primary" />
                  <div>
                    <p className="text-xl font-bold">
                      {user._count?.bookings || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <IconBriefcase className="size-5 text-primary" />
                  <div>
                    <p className="text-xl font-bold">
                      {user._count?.services || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Services</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <IconFolder className="size-5 text-primary" />
                  <div>
                    <p className="text-xl font-bold">
                      {user._count?.brand || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Brands</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          {user.recentOrders?.length > 0 && (
            <Card className="gap-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recent Orders</CardTitle>
                  <Link
                    href={`/admin/orders`}
                    className="text-xs text-primary hover:underline flex items-center gap-0.5"
                  >
                    View All <IconChevronRight className="size-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.recentOrders.map((order: any) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.orderNumber}`}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          #{order.orderNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order._count?.items || 0} items &middot;{" "}
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold flex items-center">
                          <CurrencyIcon currency="NGN" />
                          {Number(order.total).toLocaleString()}
                        </p>
                        <div className="flex gap-1 mt-0.5 justify-end">
                          <StatusBadge status={order.status} />
                          <StatusBadge status={order.paymentStatus} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Bookings */}
          {user.recentBookings?.length > 0 && (
            <Card className="gap-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recent Bookings</CardTitle>
                  <Link
                    href={`/admin/bookings`}
                    className="text-xs text-primary hover:underline flex items-center gap-0.5"
                  >
                    View All <IconChevronRight className="size-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.recentBookings.map((booking: any) => (
                    <Link
                      key={booking.id}
                      href={`/admin/bookings/${booking.bookingNumber}`}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {booking.service?.thumbnail && (
                          <Image
                            src={booking.service.thumbnail}
                            alt=""
                            width={36}
                            height={36}
                            className="rounded size-9 object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {booking.service?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            #{booking.bookingNumber} &middot;{" "}
                            {formatDate(booking.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold flex items-center">
                          <CurrencyIcon currency="NGN" />
                          {Number(booking.totalAmount).toLocaleString()}
                        </p>
                        <StatusBadge status={booking.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services */}
          {user.services?.length > 0 && (
            <Card className="gap-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Services</CardTitle>
                  <Link
                    href={`/admin/services`}
                    className="text-xs text-primary hover:underline flex items-center gap-0.5"
                  >
                    View All <IconChevronRight className="size-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.services.map((service: any) => (
                    <Link
                      key={service.id}
                      href={`/admin/services/${service.id}`}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {service.thumbnail && (
                          <Image
                            src={service.thumbnail}
                            alt=""
                            width={36}
                            height={36}
                            className="rounded size-9 object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {service.name}
                          </p>
                          <div className="flex gap-1.5 mt-0.5">
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                              {service.type}
                            </span>
                            <StatusBadge status={service.status} />
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold flex items-center">
                          <CurrencyIcon currency="NGN" />
                          {Number(service.price).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {service._count?.bookings || 0} bookings
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Brands */}
          {user.brands?.length > 0 && (
            <Card className="gap-1">
              <CardHeader>
                <CardTitle className="text-base">Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.brands.map((brand: any) => (
                    <div
                      key={brand.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {brand.brandLogo && (
                          <Image
                            src={brand.brandLogo}
                            alt=""
                            width={36}
                            height={36}
                            className="rounded size-9 object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {brand.brandName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {brand.brandType}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground shrink-0">
                        {brand._count?.products || 0} products
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          {!user.isDeleted && user.role !== "ADMINISTRATOR" && (
            <Card className="border-red-200 gap-1">
              <CardHeader>
                <CardTitle className="text-base text-red-600">
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Deactivating a user will prevent them from logging in or using
                  the platform.
                </p>
                <Button variant="destructive" onClick={handleDeactivate}>
                  Deactivate User
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
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
    DRAFT: "bg-gray-100 text-gray-800",
    ACTIVE: "bg-green-100 text-green-800",
    PAUSED: "bg-yellow-100 text-yellow-800",
    PUBLISHED: "bg-green-100 text-green-800",
    ARCHIVED: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colorMap[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}
