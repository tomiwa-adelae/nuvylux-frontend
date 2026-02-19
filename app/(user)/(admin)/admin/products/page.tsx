"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ExternalLink, Loader2, Search, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function AdminProductsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "20",
      };
      if (search) params.search = search;
      if (status) params.status = status;
      const result = await adminService.getProducts(params);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      await adminService.updateProductStatus(productId, newStatus);
      toast.success("Product status updated");
      fetchProducts();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await adminService.deleteProduct(productId);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <PageHeader
        title="Product Management"
        description="Moderate and manage all platform products"
      />

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU..."
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
          <CardContent className="px-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
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
                ) : data?.products?.length > 0 ? (
                  data.products.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.thumbnail && (
                            <div className="relative size-10 shrink-0 overflow-hidden rounded border">
                              <Image
                                src={product.thumbnail}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="font-medium max-w-[220px] truncate hover:underline flex items-center gap-1"
                              title={product.name} // Good for UX: shows full name on hover
                            >
                              <span className="truncate">{product.name}</span>
                              <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                            </Link>

                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.brand?.brandName || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center font-medium">
                          <CurrencyIcon currency="NGN" />
                          {Number(product.price).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            product.stock < 5
                              ? "text-red-500 font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={product.status}
                          onValueChange={(v) =>
                            handleStatusChange(product.id, v)
                          }
                        >
                          <SelectTrigger className="w-[110px] h-8 text-[11px] md:text-[11px]">
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
                        {formatDate(product.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(product.id)}
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
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {data?.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {data.page} of {data.totalPages} ({data.total} products)
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
