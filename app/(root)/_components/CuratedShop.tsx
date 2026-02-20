"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  IconGridDots,
  IconList,
  IconSettings2,
  IconLoader2,
} from "@tabler/icons-react";
import { env } from "@/lib/env";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import api from "@/lib/api";

export const CuratedShop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const res = await api(
          `${env.NEXT_PUBLIC_BACKEND_URL}/products/public/all`,
        );

        setProducts(res.data);
      } catch (error) {
        console.error("Failed to load marketplace", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 mb-8">
          <h2 className="font-semibold text-2xl md:text-3xl text-primary">
            Curated Collection {products.length > 0 && `(${products.length})`}
          </h2>
          <div className="hidden  justify-between md:justify-end w-full md:w-auto items-center space-x-2">
            <Button variant={"ghost"}>
              <IconSettings2 />
              Filters
            </Button>
            <div className="text-muted-foreground hidden md:block">|</div>
            <div className="flex items-center gap-1">
              <Button variant={"outline"} size={"icon"}>
                <IconGridDots className="w-5 h-5" />
              </Button>
              <Button variant={"outline"} size={"icon"}>
                <IconList className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <IconLoader2 className="animate-spin size-8 text-primary" />
            <p className="mt-2 text-muted-foreground">Loading marketplace...</p>
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No products found in the marketplace yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {products?.length !== 0 &&
              products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
};
