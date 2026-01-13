"use client";

import { PageHeader } from "@/components/PageHeader";
import { productService } from "@/lib/products";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ProductCard } from "../_components/ProductCard";
import { Product } from "@/types";

const page = () => {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [products] = await Promise.all([productService.getMyProducts()]);

        setProducts(products);
      } catch (error: any) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div>
      <PageHeader
        title="My Products"
        description={"View and manage all listed products easily"}
        back
      />
      <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default page;
