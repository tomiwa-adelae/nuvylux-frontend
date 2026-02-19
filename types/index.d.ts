import { User } from "@/store/useAuth";

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

  brand?: Brand;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;

  productName: string;
  productSlug: string;
  productImage: string;

  status: OrderItemStatus;

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

export type OrderItemStatus =
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
  brandEarnings?: string;

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

export type BrandType = "hair" | "skin" | "fashion" | "beauty" | "lifestyle";

export type BrandColor = {
  name: string;
  colorCode: string; // e.g. "#000000"
} | null;

export type BrandSocial = {
  id: string;
  brandId: string;
  url: string;
};

export type Brand = {
  id: string;
  brandName: string;
  brandLogo: string;
  brandType: BrandType;

  description: string;
  website: string | null;

  brandColor: BrandColor;

  isDeleted: boolean;

  userId: string;

  socials: BrandSocial[]; // 👈 NEW

  createdAt: string;
  updatedAt: string;
};

export type ServiceStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type ServiceType =
  | "CONSULTATION"
  | "COACHING"
  | "BOOKING"
  | "DIGITAL"
  | "OTHER";

export type PricingType = "HOURLY" | "FIXED" | "PER_SESSION";

export type DeliveryMode = "ONLINE" | "IN_PERSON" | "HYBRID";

export type Service = {
  id: string;
  userId: string;

  name: string;
  slug: string;

  description: string; // stored JSON string (TipTap, etc.)
  shortDescription: string;

  price: string; // Prisma Decimal
  currency: string; // e.g. "GBP", "USD", "NGN"

  pricingType: PricingType;
  duration?: number | null; // minutes or hours (your choice)
  revisions?: number | null;

  type: ServiceType;
  deliveryMode: DeliveryMode;

  deliveryTimeline?: string | null;
  location?: string | null;

  bookingRules?: string | null;
  cancellationPolicy?: string | null;

  thumbnail: string;
  images: string[];

  status: ServiceStatus;
  isFeatured: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;

  professionalProfile: {
    id: string;
    profession: string;
    businessName: string;
    user: User;
  };
};

export type BookingStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type Booking = {
  id: string;

  bookingNumber: string;

  userId: string;
  clientId: string;

  client: User;

  serviceId: string;
  service:
    | {
        name: string;
        thumbnail: string;
        price: string;
        shortDescription: string;
      }
    | Service;

  status: BookingStatus;

  price: string; // base service price
  serviceFee: string; // platform fee
  totalAmount: string;

  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  transactionRef: string | null;

  requirements: string;
  attachments: string[];

  scheduledAt: string | null;
  paidAt: string | null;

  createdAt: string;
  updatedAt: string;
};
