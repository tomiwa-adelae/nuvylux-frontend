import api from "./api";
import axios from "axios";
import { ReviewSummary } from "@/types";

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const reviewService = {
  getProductReviews: async (productId: string): Promise<ReviewSummary> => {
    const res = await publicApi.get(`/reviews/product/${productId}`);
    return res.data;
  },

  getServiceReviews: async (serviceId: string): Promise<ReviewSummary> => {
    const res = await publicApi.get(`/reviews/service/${serviceId}`);
    return res.data;
  },

  createReview: async (dto: {
    rating: number;
    comment?: string;
    productId?: string;
    serviceId?: string;
  }) => {
    const res = await api.post("/reviews", dto);
    return res.data;
  },

  updateReview: async (
    id: string,
    dto: { rating?: number; comment?: string }
  ) => {
    const res = await api.patch(`/reviews/${id}`, dto);
    return res.data;
  },

  deleteReview: async (id: string) => {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  },

  // Admin
  getAllReviews: async () => {
    const res = await api.get("/reviews/admin/all");
    return res.data;
  },
};
