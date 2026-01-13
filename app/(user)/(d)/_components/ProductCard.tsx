"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { IconSparkles } from "@tabler/icons-react";
import { Product } from "@/types";
import { NairaIcon } from "@/components/NairaIcon";
import { formatMoneyInput } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  console.log(product);
  return (
    <Card className="p-0">
      <CardContent className="p-1.5">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.thumbnail}
            alt={product.name}
            width={1000}
            height={1000}
            className="aspect-square object-cover rounded-md"
          />
        </Link>

        {/* Content */}
        <div className="mt-2 pb-4 space-y-1">
          <CardDescription className="hidden lg:block text-xs font-medium">
            {product.category}
          </CardDescription>
          <Link href={`/products/${product.slug}`}>
            <CardTitle className="text-primary hover:underline">
              {product.name}
            </CardTitle>
          </Link>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold">
              <NairaIcon />
              {formatMoneyInput(product.price)}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              Stock: {product.stock}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
