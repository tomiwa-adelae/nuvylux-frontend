import api from "./api";
import axios from "axios";

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const brandService = {
  getBrandDetails: async () => {
    const res = await api.get(`/brand/details`);
    return res.data;
  },

  getPublicBrands: async (params?: {
    search?: string;
    brandType?: string;
  }) => {
    const res = await publicApi.get(`/brand/public/explore`, { params });
    return res.data as Brand[];
  },

  getPublicBrandById: async (id: string) => {
    const res = await publicApi.get(`/brand/public/${id}`);
    return res.data as BrandDetail;
  },
};

export interface BrandProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  price: string;
  compareAtPrice: string | null;
  thumbnail: string | null;
  images: string[];
  sizes: string[];
  availableColors: { name: string; colorCode: string }[] | null;
  category: string;
  isFeatured: boolean;
  stock: number;
  sku: string;
  status: string;
  brandId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandDetail extends Brand {
  products: BrandProduct[];
}

export interface Brand {
  id: string;
  brandName: string;
  brandLogo: string | null;
  brandType: string;
  description: string | null;
  website: string | null;
  brandColor: string | null;
  socials: { id: string; url: string }[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
    city: string | null;
    state: string | null;
  };
}
