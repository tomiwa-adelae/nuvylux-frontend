import api from "./api";

export const productService = {
  getMyProducts: async () => {
    const res = await api.get(`/products`);
    return res.data;
  },

  getMyProductsDetails: async (slug: string | string[]) => {
    const res = await api.get(`/products/${slug}`);
    return res.data;
  },
};
