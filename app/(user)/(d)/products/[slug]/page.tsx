"use client";

import { NairaIcon } from "@/components/NairaIcon";
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
import { cn, formatMoneyInput } from "@/lib/utils";
import { IconStar, IconStarFilled, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { ComingSoon } from "@/components/ComingSoon";
import { ProductGallery } from "@/components/ProductGallery";
import { DeleteProductModal } from "../../_components/DeleteProductModal";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const data = await productService.getMyProductsDetails(slug as string);
        setProduct(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading)
    return <div className="p-10 text-center">Loading Product...</div>;
  if (!product)
    return <div className="p-10 text-center">Product not found.</div>;

  // Combine thumbnail and gallery for the sidebar
  const allImages = [product.thumbnail, ...(product.images || [])];

  const remainingCount = product.images.length - 3;

  return (
    <div>
      {openModal && (
        <DeleteProductModal
          closeModal={() => setOpenModal(false)}
          open={openModal}
          id={product?.id}
          name={product?.name}
        />
      )}
      <PageHeader
        back
        description="View and manage your product details"
        title="Product Details"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        <div className="lg:col-span-2">
          <div>
            <Image
              src={product.thumbnail}
              alt={product.name}
              width={1000}
              height={1000}
              className="aspect-auto size-full object-cover rounded-md"
            />
            <div className="grid mt-2 grid-cols-3 gap-2">
              {product.images.slice(0, 3).map((img, index) => {
                const isLastVisible = index === 2 && remainingCount > 0;
                return (
                  <div
                    key={index}
                    className="relative cursor-pointer group"
                    onClick={() => {
                      if (isLastVisible) {
                        setIsGalleryOpen(true);
                      } else {
                        // setSelectedImage(img);
                      }
                    }}
                  >
                    <Image
                      src={img}
                      alt={"Product image"}
                      width={1000}
                      height={1000}
                      className="aspect-auto size-full object-cover rounded-md border p-1"
                    />
                    {/* View More Overlay */}
                    {isLastVisible && (
                      <div className="absolute inset-0 bg-black/60 rounded-md flex flex-col items-center justify-center text-white font-medium text-sm">
                        <span>+{remainingCount}</span>
                        <span>View more</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 grid gap-2 md:col-span-1">
          <Card>
            <CardContent>
              <h1 className="font-semibold text-2xl md:text-3xl">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center justify-start gap-2">
                <div className="flex items-center justify-start gap-1">
                  <IconStarFilled className="text-yellow-500 size-4" />
                  <IconStarFilled className="text-yellow-500 size-4" />
                  <IconStarFilled className="text-yellow-500 size-4" />
                  <IconStarFilled className="text-yellow-500 size-4" />
                </div>
                <p className="text-sm font-medium">[4.5]</p>
                <p className="text-sm font-medium text-primary">623 reviews</p>
                <p className="text-sm font-medium text-primary">19 sold</p>
              </div>
              <h2 className="text-primary font-semibold text-lg md:text-xl mt-2.5">
                <NairaIcon /> {formatMoneyInput(product.price)}{" "}
                {product.compareAtPrice && (
                  <span className="line-through text-muted-foreground font-medium text-base">
                    <NairaIcon />
                    {formatMoneyInput(product.compareAtPrice)}
                  </span>
                )}
              </h2>
              <div className="mt-2">
                <p className="font-medium text-sm mb-1.5">Available Colors:</p>
                <div className="flex flex-wrap gap-1">
                  {product.availableColors?.map((color, index) => (
                    <Button
                      key={index}
                      className={`relative size-7 rounded-full overflow-hidden transition-all duration-200 `}
                      aria-label={`${color.name} color`}
                      title={color.name}
                      size={"icon"}
                      variant={"outline"}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: color.colorCode,
                        }}
                      />
                    </Button>
                  ))}
                </div>
              </div>
              {product?.sizes?.length !== 0 && (
                <div className="mt-2">
                  <p className="font-medium text-sm mb-1.5">Available Size:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product?.sizes?.map((size) => (
                      <Badge key={size} variant="secondary" className="gap-1">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-2">
                <p className="text-sm font-medium">Description:</p>
                <p className="text-muted-foreground text-sm">
                  <RenderDescription json={product.description} />
                </p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button asChild>
                  <Link href={`/products/${product.slug}/edit`}>Edit</Link>
                </Button>
                <Button
                  onClick={() => setOpenModal(true)}
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="gap-1">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <ComingSoon />
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
              magnam architecto velit quae, unde vel placeat debitis maiores
              numquam sunt error minima quod, facere aut veritatis quia. Sequi
              tempora maiores quis velit obcaecati earum sit, eos odio unde ab
              harum illo porro est dolor vel voluptates repellendus minus
              eligendi, aspernatur delectus! Sint, quos quod. Vel maxime aperiam
              laudantium corrupti, reiciendis dignissimos facere odio modi, quia
              iusto quisquam consequuntur deserunt adipisci sint dolorum quam
              voluptate mollitia aspernatur in tenetur. Laboriosam molestiae
              iusto excepturi ullam praesentium nihil quidem harum, tenetur
            </CardContent>
          </Card>
        </div>
      </div>
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

export default ProductDetailsPage;
