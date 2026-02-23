"use client";

import React, { useEffect, useState, useCallback } from "react";
import { IconLoader2, IconStarFilled } from "@tabler/icons-react";
import { env } from "@/lib/env";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import api from "@/lib/api";
import { categories } from "@/constants";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "rating", label: "Top Rated" },
];

const MIN_RATING_OPTIONS = [
  { value: "", label: "Any Rating" },
  { value: "4", label: "4★ & up" },
  { value: "3", label: "3★ & up" },
];

export const CuratedShop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minRating, setMinRating] = useState("");

  const fetchMarketplace = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory) params.set("category", activeCategory);
      if (sortBy) params.set("sortBy", sortBy);
      if (minRating) params.set("minRating", minRating);
      const res = await api(
        `${env.NEXT_PUBLIC_BACKEND_URL}/products/public/all?${params.toString()}`,
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to load marketplace", error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, sortBy, minRating]);

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

          {/* Sort + Rating filters */}
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            {/* Min rating pills */}
            <div className="flex items-center gap-1">
              {MIN_RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMinRating(minRating === opt.value ? "" : opt.value)}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                    minRating === opt.value
                      ? "bg-amber-400 text-white border-amber-400"
                      : "border-input text-muted-foreground hover:border-amber-400/60"
                  )}
                >
                  {opt.value && <IconStarFilled size={10} />}
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sort pills */}
            <div className="flex items-center gap-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                    sortBy === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-input text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
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
