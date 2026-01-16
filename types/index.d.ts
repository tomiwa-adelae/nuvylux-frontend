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
  isSaved: boolean;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;

  productName: string;
  productSlug: string;
  productImage: string;

  price: string; // stored as string (Prisma Decimal)
  quantity: number;

  size?: string | null;
  color?: string | null;

  createdAt: string;
};

export type ShippingAddress = {
  id: string;
  orderId: string;

  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;

  createdAt: string;
};

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  transactionRef: string | null;

  subtotal: string;
  deliveryFee: string;
  discount: string;
  total: string;

  customerNote: string;

  items: OrderItem[];
  shippingAddress: ShippingAddress;

  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;

  createdAt: string;
  updatedAt: string;
};
