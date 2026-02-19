"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminService } from "@/lib/admin";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DEFAULT_IMAGE = "/assets/images/profile-img.jpg";
const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminBookingsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "20",
      };
      if (search) params.search = search;
      if (status) params.status = status;
      const result = await adminService.getBookings(params);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  return (
    <div>
      <PageHeader
        title="Booking Management"
        description="View and manage all service bookings"
      />

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by booking number, client, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="animate-spin size-6 text-primary" />
        </div>
      ) : (
        <Card className="mt-4 py-3 px-0 gap-0">
          <CardContent className="overflow-x-auto px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Booking #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center">
                      <div className="flex justify-center">
                        <Loader2 className="animate-spin size-6 text-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.bookings?.length > 0 ? (
                  data.bookings.map((booking: any) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-[11px] font-medium">
                        #{booking.bookingNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="relative size-7 shrink-0">
                            <Image
                              src={booking.client?.image || DEFAULT_IMAGE}
                              alt=""
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <span className="truncate max-w-[100px]">
                            {booking.client?.firstName}{" "}
                            {booking.client?.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate text-muted-foreground">
                        {booking.service?.name}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {booking.user?.firstName} {booking.user?.lastName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center font-semibold">
                          <CurrencyIcon currency="NGN" />
                          {Number(booking.totalAmount).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(booking.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link
                            href={`/admin/bookings/${booking.bookingNumber}`}
                          >
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {data?.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {data.page} of {data.totalPages} ({data.total} bookings)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= data.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colorMap[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}
