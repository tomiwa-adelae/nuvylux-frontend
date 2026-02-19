import api from "@/lib/api";

export const adminService = {
  // Dashboard
  getStats: () => api.get("/admin/stats").then((r) => r.data),

  // Users
  getUsers: (params?: Record<string, string>) =>
    api.get("/admin/users", { params }).then((r) => r.data),
  getUserDetails: (id: string) =>
    api.get(`/admin/users/${id}`).then((r) => r.data),
  updateUser: (id: string, data: { role?: string }) =>
    api.patch(`/admin/users/${id}`, data).then((r) => r.data),
  resetUserPassword: (id: string) =>
    api.post(`/admin/users/${id}/reset-password`).then((r) => r.data),
  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`).then((r) => r.data),

  // Orders
  getOrders: (params?: Record<string, string>) =>
    api.get("/admin/orders", { params }).then((r) => r.data),
  getOrderDetails: (orderNumber: string) =>
    api.get(`/admin/orders/${orderNumber}`).then((r) => r.data),
  updateOrderStatus: (orderNumber: string, status: string) =>
    api.patch(`/admin/orders/${orderNumber}/status`, { status }).then((r) => r.data),

  // Bookings
  getBookings: (params?: Record<string, string>) =>
    api.get("/admin/bookings", { params }).then((r) => r.data),
  getBookingDetails: (bookingNumber: string) =>
    api.get(`/admin/bookings/${bookingNumber}`).then((r) => r.data),
  updateBookingStatus: (bookingNumber: string, status: string) =>
    api.patch(`/admin/bookings/${bookingNumber}/status`, { status }).then((r) => r.data),

  // Products
  getProducts: (params?: Record<string, string>) =>
    api.get("/admin/products", { params }).then((r) => r.data),
  getProductDetails: (id: string) =>
    api.get(`/admin/products/${id}`).then((r) => r.data),
  updateProductStatus: (id: string, status: string) =>
    api.patch(`/admin/products/${id}/status`, { status }).then((r) => r.data),
  deleteProduct: (id: string) =>
    api.delete(`/admin/products/${id}`).then((r) => r.data),

  // Services
  getServices: (params?: Record<string, string>) =>
    api.get("/admin/services", { params }).then((r) => r.data),
  getServiceDetails: (id: string) =>
    api.get(`/admin/services/${id}`).then((r) => r.data),
  updateServiceStatus: (id: string, status: string) =>
    api.patch(`/admin/services/${id}/status`, { status }).then((r) => r.data),
  deleteService: (id: string) =>
    api.delete(`/admin/services/${id}`).then((r) => r.data),

  // Admin Team
  getAdmins: () => api.get("/admin/admins").then((r) => r.data),
  createAdmin: (data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    position: string;
  }) => api.post("/admin/admins", data).then((r) => r.data),
  updateAdmin: (id: string, position: string) =>
    api.patch(`/admin/admins/${id}`, { position }).then((r) => r.data),
  removeAdmin: (id: string) =>
    api.delete(`/admin/admins/${id}`).then((r) => r.data),
};
