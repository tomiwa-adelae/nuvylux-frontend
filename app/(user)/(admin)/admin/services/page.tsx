"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminService } from "@/lib/admin";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Loader2, Search, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const STATUSES = ["DRAFT", "ACTIVE", "PAUSED"];

export default function AdminServicesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "20",
      };
      if (search) params.search = search;
      if (status) params.status = status;
      const result = await adminService.getServices(params);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchServices();
  };

  const handleStatusChange = async (serviceId: string, newStatus: string) => {
    try {
      await adminService.updateServiceStatus(serviceId, newStatus);
      toast.success("Service status updated");
      fetchServices();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await adminService.deleteService(serviceId);
      toast.success("Service deleted");
      fetchServices();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div>
      <PageHeader
        title="Service Management"
        description="Moderate and manage all platform services"
      />

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
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
          <SelectTrigger className="w-[180px]">
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
          <CardContent className="px-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Service</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex justify-center">
                        <Loader2 className="animate-spin size-6 text-primary" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.services?.length > 0 ? (
                  data.services.map((service: any) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-0">
                          {service.thumbnail && (
                            <div className="relative size-10 shrink-0 overflow-hidden rounded border bg-muted">
                              <Image
                                src={service.thumbnail}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <Link
                              href={`/admin/services/${service.id}`}
                              className="font-medium hover:underline flex items-center gap-1 group"
                            >
                              <span className="truncate max-w-[180px]">
                                {service.name}
                              </span>
                              <ExternalLink className="size-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                              {service.deliveryMode}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {service.user?.firstName} {service.user?.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center font-medium">
                          <CurrencyIcon currency="NGN" />
                          {Number(service.price).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-normal text-[10px] uppercase tracking-wider"
                        >
                          {service.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={service.status}
                          onValueChange={(v) =>
                            handleStatusChange(service.id, v)
                          }
                        >
                          <SelectTrigger className="w-[100px] h-8 text-[11px] md:text-[11px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="text-[11px]"
                              >
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(service.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No services found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {data?.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {data.page} of {data.totalPages} ({data.total} services)
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
