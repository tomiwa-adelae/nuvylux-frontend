import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconGrid3x3,
  IconGridDots,
  IconList,
  IconSettings2,
} from "@tabler/icons-react";
import { Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const CuratedShop = () => {
  // Placeholder data for demonstration
  const products = [
    {
      id: 1,
      name: "AI Precision Skincare Tool",
      price: 299,
      category: "BeautyTech",
      creator: "NuvyLux Labs",
      image: "/assets/images/product-1.jpg",
    },
    {
      id: 2,
      name: "Virtual Chrome Dress NFT",
      price: 0.5,
      category: "Digital Fashion",
      creator: "Aisha K.",
      image: "/assets/images/product-2.jpg",
    },
    {
      id: 3,
      name: "AI Precision Skincare Tool",
      price: 299,
      category: "BeautyTech",
      creator: "NuvyLux Labs",
      image: "/assets/images/product-1.jpg",
    },
    {
      id: 4,
      name: "Virtual Chrome Dress NFT",
      price: 0.5,
      category: "Digital Fashion",
      creator: "Aisha K.",
      image: "/assets/images/product-2.jpg",
    },
    {
      id: 5,
      name: "AI Precision Skincare Tool",
      price: 299,
      category: "BeautyTech",
      creator: "NuvyLux Labs",
      image: "/assets/images/product-1.jpg",
    },
    {
      id: 6,
      name: "Virtual Chrome Dress NFT",
      price: 0.5,
      category: "Digital Fashion",
      creator: "Aisha K.",
      image: "/assets/images/product-2.jpg",
    },
    {
      id: 7,
      name: "Virtual Chrome Dress NFT",
      price: 0.5,
      category: "Digital Fashion",
      creator: "Aisha K.",
      image: "/assets/images/product-2.jpg",
    },
  ];
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 mb-8">
          <h2 className="font-semibold text-2xl md:text-3xl 2xl:text-4xl text-primary">
            Curated Collection ({products.length})
          </h2>
          <div className="flex justify-between md:justify-end w-full md:w-auto items-center space-x-2">
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

        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2 gap-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

/** 2. Reusable Product Card */
interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  category: string;
  creator: string;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  category,
  creator,
  image,
}) => (
  <Card className="bg-transparent border-0 rounded-none shadow-none p-0 group gap-0 overflow-hidden">
    <CardContent className="p-0">
      {/* Image Placeholder */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <Image
          width={1000}
          height={1000}
          src={image}
          alt={name}
          className="aspect-square size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute bottom-4 right-4 bg-white text-primary rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        >
          <Zap className="w-5 h-5" />
        </Button>
        <Badge
          variant={"secondary"}
          className="text-xs absolute top-2 left-2 text-primary uppercase"
        >
          {category}
        </Badge>
      </div>

      <div className="text-sm space-y-1">
        <Link
          href={"/"}
          className="text-base lg:text-lg font-semibold text-primary hover:underline transition-all"
        >
          {name}
        </Link>
        <p className="text-xs lg:text-sm text-muted-foreground">
          By{" "}
          <Link href={`/creator/${creator}`} className="hover:underline">
            {creator}
          </Link>
        </p>
        <p className="text-lg lg:text-xl font-bold mt-2">
          ${price.toFixed(category.includes("NFT") ? 2 : 2)}
        </p>
      </div>
    </CardContent>
  </Card>
);
