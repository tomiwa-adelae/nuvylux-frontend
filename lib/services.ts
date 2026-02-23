import api from "./api";

export type ExploreServicesParams = {
  type?: string;
  search?: string;
  deliveryMode?: string;
  priceMin?: string;
  priceMax?: string;
  city?: string;
  state?: string;
  lat?: string;
  lng?: string;
  radius?: string;
  sortBy?: "newest" | "price_asc" | "price_desc" | "distance";
};

export const serviceService = {
  getMyServices: async () => {
    const res = await api.get(`/services`);
    return res.data;
  },

  getMyServicesDetails: async (slug: string | string[]) => {
    const res = await api.get(`/services/${slug}`);
    return res.data;
  },

  // Public discovery — supports location + filter params
  getExploreServices: async (params?: ExploreServicesParams) => {
    const res = await api.get(`/services/public/explore`, { params });
    return res.data;
  },

  getPublicServiceDetails: async (slug: string) => {
    const response = await api.get(`/services/public/${slug}`);
    return response.data;
  },
};
