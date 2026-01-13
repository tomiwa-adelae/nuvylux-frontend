"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { IconSparkles } from "@tabler/icons-react";

export function ProductCard({ product }: any) {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-neutral-100 hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative">
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-white/90 text-black hover:bg-white border-none backdrop-blur-md">
            <IconSparkles className="size-3 mr-1 text-amber-500" />
            AI Ready
          </Badge>
        </div>
        <img
          src="/api/placeholder/400/600"
          alt="Product"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
          Skincare • Serum
        </p>
        <h3 className="font-semibold text-neutral-900 truncate">
          Advanced Radiance Elixir
        </h3>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium">$120.00</span>
          <span className="text-[10px] text-neutral-400 font-medium">
            Stock: 42
          </span>
        </div>
      </div>
    </div>
  );
}
