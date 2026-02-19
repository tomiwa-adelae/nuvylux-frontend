import api from "./api";

export const bookingService = {
  getMyBookings: async () => {
    const res = await api.get(`/bookings`);
    return res.data;
  },

  getMyBookingDetails: async (bookingNumber: string | string[]) => {
    const res = await api.get(`/bookings/${bookingNumber}`);
    return res.data;
  },

  getIncomingBookings: async () => {
    const res = await api.get(`/bookings/provider/incoming`);
    return res.data;
  },

  cancelMyBooking: async (bookingNumber: string) => {
    const res = await api.patch(`/bookings/${bookingNumber}/cancel`);
    return res.data;
  },

  getProviderBookingDetails: async (bookingNumber: string) => {
    const res = await api.get(`/bookings/provider/${bookingNumber}`);
    return res.data;
  },

  updateBookingStatus: async (bookingNumber: string, status: string) => {
    const res = await api.patch(`/bookings/provider/${bookingNumber}/status`, {
      status,
    });
    return res.data;
  },
};
