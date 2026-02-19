"use client";

import { PageHeader } from "@/components/PageHeader";
import { RenderDescription } from "@/components/text-editor/RenderDescription";
import { productService } from "@/lib/products";
import { Product } from "@/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoneyInput } from "@/lib/utils";
import {
  IconHeart,
  IconHeartFilled,
  IconMinus,
  IconPlus,
  IconShoppingCartPlus,
  IconStarFilled,
} from "@tabler/icons-react";
import { ProductGallery } from "@/components/ProductGallery";
import api from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { RelatedProducts } from "@/components/RelatedProducts";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { createCartItemId, useCart } from "@/store/useCart";
import { CurrencyIcon } from "@/components/CurrencyIcon";

export const ProductDetailClient = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<
    (Product & { isSaved?: boolean }) | null
  >(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Interaction States
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const data = await productService.getPublicProductDetails(
          slug as string,
        );
        setProduct(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      setIsFavorite(product.isSaved || false);
    }
  }, [product?.isSaved]);

  const toggleFavorite = async () => {
    if (!user) return toast.error("Please login to save items");
    setFavoriteLoading(true);
    try {
      const res = await api.post("/saved/toggle", { productId: product?.id });
      setIsFavorite(res.data.saved);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize && product?.sizes && product.sizes.length > 0) {
      return toast.error("Please select a size before adding to cart");
    }

    if (
      !selectedColor &&
      product?.availableColors &&
      product.availableColors.length > 0
    ) {
      return toast.error("Please select a color before adding to cart");
    }

    if (!product) return;

    const compositeId = createCartItemId(
      product.id,
      selectedSize,
      selectedColor,
    );

    addItem({
      id: compositeId,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image: product.thumbnail,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
    });

    if (user) {
      try {
        await api.post("/cart", {
          productId: product.id,
          quantity: quantity,
          size: selectedSize,
          color: selectedColor,
        });
      } catch (e) {
        console.error("DB Sync failed", e);
      }
    }

    toast.success(`${product.name} added to cart!`, {
      action: {
        label: "View Cart",
        onClick: () => (window.location.href = "/cart"),
      },
    });
  };

  if (loading)
    return <div className="p-10 text-center">Loading Product...</div>;
  if (!product)
    return <div className="p-10 text-center">Product not found.</div>;

  const remainingCount = product.images.length - 3;

  return (
    <div className="container py-12">
      <PageHeader back title={product.name} description={product.category} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 mt-4">
        {/* LEFT: Image Section */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <Image
              src={product.thumbnail}
              alt={product.name}
              width={800}
              height={800}
              className="aspect-square w-full object-cover rounded-xl border shadow-sm cursor-zoom-in"
              onClick={() => setIsGalleryOpen(true)}
            />
            <div className="grid mt-3 grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer aspect-square"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  <Image
                    src={img}
                    alt="Gallery"
                    fill
                    className="object-cover rounded-lg border hover:opacity-80 transition"
                  />
                  {index === 3 && remainingCount > 1 && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white text-xs">
                      +{remainingCount - 1} More
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Selection Section */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="font-semibold text-2xl md:text-3xl">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <IconStarFilled key={i} size={16} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      (4.8 / 5.0)
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shadow-sm"
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                >
                  {isFavorite ? (
                    <IconHeartFilled className="text-red-500" />
                  ) : (
                    <IconHeart />
                  )}
                </Button>
              </div>

              <h2 className="text-primary font-semibold text-lg md:text-xl mt-2.5">
                <CurrencyIcon currency="NGN" />{" "}
                {formatMoneyInput(product.price)}{" "}
                {product.compareAtPrice && (
                  <span className="line-through text-muted-foreground font-medium text-base">
                    <CurrencyIcon currency="NGN" />
                    {formatMoneyInput(product.compareAtPrice)}
                  </span>
                )}
              </h2>

              <hr className="my-4" />

              {/* Color Picker */}
              {product.availableColors?.length! > 0 && (
                <div>
                  <p className="font-medium text-sm mb-1.5">
                    Color:{" "}
                    <span className="text-muted-foreground">
                      {selectedColor}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.availableColors?.map((color, index) => (
                      <Button
                        size="icon"
                        key={index}
                        onClick={() => setSelectedColor(color.name)}
                        className={`size-8 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? "border-primary ring-2 ring-primary/20 scale-110"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.colorCode }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes?.length! > 0 && (
                <div>
                  <p className="font-medium text-sm mb-1.5">Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes?.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className="h-9 w-12 rounded-md"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-2">
                <InputGroup className="h-12 w-full sm:w-fit">
                  <InputGroupAddon>
                    <InputGroupButton
                      variant="ghost"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <IconMinus />
                    </InputGroupButton>
                  </InputGroupAddon>

                  <InputGroupInput
                    value={quantity}
                    readOnly
                    className="w-12 text-center font-semibold px-0"
                    aria-label="Quantity"
                  />

                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      variant="ghost"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <IconPlus />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                <Button onClick={handleAddToCart} className="flex-1">
                  <IconShoppingCartPlus size={22} />
                  Add to Cart
                </Button>
              </div>

              <div className="bg-muted/30 rounded-lg mt-6">
                <p className="text-sm font-semibold mb-1">
                  Product Description
                </p>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <RenderDescription json={product.description} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RelatedProducts currentProduct={product} />

      {isGalleryOpen && (
        <ProductGallery
          open={isGalleryOpen}
          closeModal={() => setIsGalleryOpen(false)}
          images={product.images}
          thumbnail={product.thumbnail}
        />
      )}
    </div>
  );
};
