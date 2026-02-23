"use client";

import React, { useEffect, useState, useCallback } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { env } from "@/lib/env";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import api from "@/lib/api";
import { categories } from "@/constants";
import { cn } from "@/lib/utils";

export const CuratedShop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  const fetchMarketplace = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.set("category", activeCategory);
      const res = await api(
        `${env.NEXT_PUBLIC_BACKEND_URL}/products/public/all?${params.toString()}`,
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load marketplace", error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchMarketplace();
  }, [fetchMarketplace]);

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 mb-6">
          <h2 className="font-semibold text-2xl md:text-3xl text-primary">
            Curated Collection {!loading && products.length > 0 && `(${products.length})`}
          </h2>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
              activeCategory === ""
                ? "bg-primary text-primary-foreground border-primary"
                : "border-input text-muted-foreground hover:border-primary/40"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input text-muted-foreground hover:border-primary/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <IconLoader2 className="animate-spin size-8 text-primary" />
            <p className="mt-2 text-muted-foreground">Loading marketplace...</p>
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No products found{activeCategory ? ` in ${activeCategory}` : " in the marketplace"} yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
