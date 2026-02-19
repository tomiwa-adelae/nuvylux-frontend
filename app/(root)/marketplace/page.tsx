import type { Metadata } from "next";
import { ShopHeroSection } from "../_components/ShopHeroSection";

export const metadata: Metadata = {
  title: "Shop the Marketplace",
  description:
    "Shop curated beauty and fashion products from verified brands on the Nuvylux marketplace. Skincare, cosmetics, apparel, and more delivered to you.",
  alternates: { canonical: "https://nuvylux.com/marketplace" },
  keywords: [
    "beauty products online",
    "fashion marketplace Nigeria",
    "skincare shop",
    "cosmetics online",
    "luxury beauty products",
    "Nuvylux shop",
  ],
  openGraph: {
    title: "Nuvylux Marketplace — Shop Curated Beauty & Fashion",
    description:
      "Discover verified beauty and fashion products from top brands on the Nuvylux marketplace.",
    url: "https://nuvylux.com/marketplace",
    images: [{ url: "/assets/images/marketplace-img.jpg", width: 1200, height: 630, alt: "Nuvylux Marketplace" }],
  },
};
import { CuratedShop } from "../_components/CuratedShop";

const page = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <ShopHeroSection />
      <CuratedShop />
    </div>
  );
};

export default page;
