"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CurrencyIcon } from "@/components/CurrencyIcon";
import { OrderCard } from "@/app/(user)/(client)/_components/OrderCard";
import { formatMoneyInput } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import { productService } from "@/lib/products";
import api from "@/lib/api";
import { Order, Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  IconBox,
  IconShoppingBag,
  IconClock,
  IconWallet,
  IconPlus,
  IconChevronRight,
} from "@tabler/icons-react";

export const BrandDashboard = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, ordersRes] = await Promise.all([
          productService.getMyProducts(),
          api.get("/orders/brand/all"),
        ]);
        setProducts(productsData);
        setOrders(ordersRes.data);
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

  const activeProducts = products.filter(
    (p) => p.status === "PUBLISHED"
  ).length;

  const pendingOrders = orders.filter((o) =>
    o.items.some(
      (item: any) => item.status === "PENDING" || item.status === "PROCESSING"
    )
  ).length;

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + Number(o.brandEarnings || 0), 0);

  const recentOrders = orders.slice(0, 3);
  const recentProducts = products.slice(0, 3);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName}`}
        description="Here's an overview of your brand's performance"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={<IconBox className="size-5 text-primary" />}
          label="Total Products"
          value={products.length.toString()}
          sub={`${activeProducts} active`}
        />
        <StatCard
          icon={<IconShoppingBag className="size-5 text-primary" />}
          label="Total Orders"
          value={orders.length.toString()}
        />
        <StatCard
          icon={<IconClock className="size-5 text-primary" />}
          label="Pending Orders"
          value={pendingOrders.toString()}
        />
        <StatCard
          icon={<IconWallet className="size-5 text-primary" />}
          label="Revenue"
          value={
            <>
              <CurrencyIcon currency="NGN" />
              {formatMoneyInput(totalRevenue)}
            </>
          }
        />
      </div>

      {/* Recent Orders */}
      <SectionHeader title="Recent Orders" href="/dashboard/orders" />
      <div className="space-y-4 mb-8">
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <OrderCard key={order.id} order={order} isBrandView={true} />
          ))
        ) : (
          <EmptyState
            icon={<IconShoppingBag className="size-10" />}
            message="No orders received yet"
            actionLabel="Manage Products"
            actionHref="/dashboard/products"
          />
        )}
      </div>

      {/* Recent Products */}
      <SectionHeader title="Your Products" href="/dashboard/products" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {recentProducts.length > 0 ? (
          recentProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:border-primary/50 transition-colors group p-0"
            >
              <Link href={`/dashboard/products/${product.slug}`}>
                <div className="relative h-40 bg-muted">
                  <Image
                    src={product.thumbnail || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm truncate group-hover:text-primary">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm font-bold mt-1">
                        <CurrencyIcon currency="NGN" />
                        {formatMoneyInput(Number(product.price))}
                      </p>
                    </div>
                    <Badge
                      variant={
                        product.status === "PUBLISHED" ? "default" : "secondary"
                      }
                      className="shrink-0 text-[10px]"
                    >
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {product.stock} in stock
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              icon={<IconBox className="size-10" />}
              message="No products yet"
              actionLabel="Add your first product"
              actionHref="/dashboard/products/new"
            />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Separator className="mb-6" />
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/dashboard/products/new">
            <IconPlus className="size-4" />
            Add New Product
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/orders">
            <IconShoppingBag className="size-4" />
            View All Orders
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/products">
            <IconBox className="size-4" />
            Manage Products
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
