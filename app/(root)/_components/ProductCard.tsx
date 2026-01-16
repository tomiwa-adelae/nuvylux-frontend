"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconHeart,
  IconHeartFilled,
  IconShoppingCartPlus,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NairaIcon } from "@/components/NairaIcon";
import { formatMoneyInput } from "@/lib/utils";
import { Product } from "@/types";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/store/useAuth";
// 1. Import the cart store
import { createCartItemId, useCart } from "@/store/useCart";

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // 2. Access the addItem action
  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    setIsFavorite(product.isSaved || false);
  }, [product.isSaved]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const response = await api.post("/saved/toggle", {
        productId: product.id,
      });

      const data = response.data;
      setIsFavorite(data.saved);
      toast.success(data.message);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Please login to save items");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Functional Add to Cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigation if the card is wrapped in a Link

    const compositeId = createCartItemId(product.id);

    addItem({
      id: compositeId, // Use composite ID
      productId: product.id, // Store the actual product ID
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image: product.thumbnail,
      quantity: 1,
      // No size or color for quick add from product card
    });

    if (user) {
      try {
        await api.post("/cart", {
          productId: product.id,
          quantity: 1,
          // size: selectedSize,
          // color: selectedColor,
        });
      } catch (e) {
        console.error("DB Sync failed");
      }
    }

    toast.success(`${product.name} added to cart!`, {
      action: {
        label: "View Cart",
        onClick: () => (window.location.href = "/cart"),
      },
    });
  };

  return (
    <Card className="group transition-all p-0 border-none shadow-none hover:shadow-md rounded-2xl overflow-hidden">
      <CardContent className="p-1.5 relative">
        <Link
          href={`/${product.slug}`}
          className="block relative aspect-square overflow-hidden rounded-xl bg-gray-100"
        >
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover aspect-square transition-transform duration-500 group-hover:scale-110"
          />

          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 border-none">
              -
              {Math.round(
                ((Number(product?.compareAtPrice) - Number(product.price)) /
                  Number(product.compareAtPrice)) *
                  100
              )}
              %
            </Badge>
          )}

          {/* Quick Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent hidden md:block">
            <Button
              onClick={handleAddToCart}
              className="w-full gap-2 bg-white text-black hover:bg-gray-100 border-none rounded-lg"
            >
              <IconShoppingCartPlus size={18} />
              Quick Add
            </Button>
          </div>
        </Link>

        {/* Favorite Button */}
        <Button
          size="icon"
          onClick={toggleFavorite}
          disabled={loading}
          variant={"secondary"}
          className="absolute top-3 right-3 rounded-full shadow-sm z-10 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          {isFavorite ? (
            <IconHeartFilled
              className="text-red-500 scale-110 transition-transform"
              size={20}
            />
          ) : (
            <IconHeart className="text-gray-600" size={20} />
          )}
        </Button>

        <div className="mt-3 px-1 pb-2 space-y-1">
          <CardDescription className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            {product.category}
          </CardDescription>
          <Link href={`/${product.slug}`}>
            <CardTitle className="text-sm font-semibold text-primary hover:text-primary/80 truncate">
              {product.name}
            </CardTitle>
          </Link>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-primary">
                <NairaIcon /> {formatMoneyInput(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatMoneyInput(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Mobile-only cart button since overlay is hidden on mobile */}
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden h-8 w-8 rounded-full"
              onClick={handleAddToCart}
            >
              <IconShoppingCartPlus size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
