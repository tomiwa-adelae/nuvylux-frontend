import type { NextConfig } from "next";

const NOINDEX_HEADER = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-94024244cf5f47538b0f873a6f54f09e.r2.dev",
        port: "",
      },
    ],
  },

  async headers() {
    return [
      // Auth pages
      { source: "/login", headers: NOINDEX_HEADER },
      { source: "/register", headers: NOINDEX_HEADER },
      { source: "/forgot-password", headers: NOINDEX_HEADER },
      { source: "/verify-code", headers: NOINDEX_HEADER },
      { source: "/new-password", headers: NOINDEX_HEADER },
      { source: "/new-password/success", headers: NOINDEX_HEADER },

      // Onboarding
      { source: "/onboarding/:path*", headers: NOINDEX_HEADER },

      // Private user pages
      { source: "/account", headers: NOINDEX_HEADER },
      { source: "/orders/:path*", headers: NOINDEX_HEADER },
      { source: "/bookings/:path*", headers: NOINDEX_HEADER },
      { source: "/saved", headers: NOINDEX_HEADER },
      { source: "/settings", headers: NOINDEX_HEADER },

      // Cart & checkout (transactional, no index value)
      { source: "/cart", headers: NOINDEX_HEADER },
      { source: "/checkout", headers: NOINDEX_HEADER },
      { source: "/orders/success/:path*", headers: NOINDEX_HEADER },

      // Dashboard & admin (professionals, brands, admins)
      { source: "/dashboard/:path*", headers: NOINDEX_HEADER },
      { source: "/admin/:path*", headers: NOINDEX_HEADER },

      // Brand onboarding
      { source: "/brand-onboarding/:path*", headers: NOINDEX_HEADER },

      // Service booking & review flows (user-specific)
      { source: "/services/:slug/book", headers: NOINDEX_HEADER },
      { source: "/services/:slug/review", headers: NOINDEX_HEADER },
    ];
  },
};

export default nextConfig;
