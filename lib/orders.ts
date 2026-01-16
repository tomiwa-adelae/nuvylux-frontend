import api from "./api";

export const orderService = {
  getMyOrders: async () => {
    const res = await api.get(`/orders`);
    return res.data;
  },

  getMyOrderDetails: async (orderNumber: string | string[]) => {
    const res = await api.get(`/orders/${orderNumber}`);
    return res.data;
  },
};
