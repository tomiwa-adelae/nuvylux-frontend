// components/RelatedProducts.tsx
import { Product } from "@/types";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { formatMoneyInput } from "@/lib/utils";
import { NairaIcon } from "./NairaIcon";
import { ProductCard } from "@/app/(root)/_components/ProductCard";

export const RelatedProducts = ({
  currentProduct,
}: {
  currentProduct: Product;
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await api.get(
          `/products/public/related/${currentProduct.id}?category=${currentProduct.category}`
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to load related products");
      }
    };
    fetchRelated();
  }, [currentProduct]);

  if (products.length === 0) return null;

  return (
    <div className="border-t pt-4 mt-8">
      <h3 className="text-lg md:text-2xl font-medium mb-2">
        You May Also Like
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((item) => (
          <ProductCard product={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};
