export type Color = {
  name: string;
  colorCode: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice?: string | null;
  stock: number;
  sku: string;
  thumbnail: string;
  images: string[];
  sizes?: string[];
  availableColors?: Color[];
  brandId: string;
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; // adjust based on your app
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};
