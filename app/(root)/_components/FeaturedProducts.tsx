"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import api from "@/lib/api";
import { env } from "@/lib/env";

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api(
          `${env.NEXT_PUBLIC_BACKEND_URL}/products/public/all`,
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50/60">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-2">
              The Marketplace
            </p>
            <h2 className="font-semibold text-2xl md:text-3xl 2xl:text-4xl text-gray-900">
              Shop the Collection
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Curated beauty and fashion products from verified brands — all in
              one place.
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/marketplace" className="flex items-center gap-2">
              Browse marketplace <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {loading
            ? Array(8)
                .fill(0)
                .map((_, i) => <ProductSkeleton key={i} />)
            : products
                .slice(0, 8)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
        </div>

        {!loading && products.length > 8 && (
          <div className="text-center mt-10">
            <Button asChild>
              <Link href="/marketplace">
                Shop All {products.length}+ Products
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

const ProductSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-1/3" />
  </div>
);
