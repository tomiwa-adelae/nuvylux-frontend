import type { Metadata } from "next";
import { ProductDetailClient } from "../../_components/ProductDetailClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const res = await fetch(
      `${backendUrl}/products/public/details/${slug}`,
      { cache: "no-store" },
    );
    if (!res.ok) return { title: "Product" };

    const product = await res.json();
    const discount =
      product.compareAtPrice && product.compareAtPrice > product.price
        ? ` — ${Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% off`
        : "";

    return {
      title: product.name,
      description:
        `Shop ${product.name}${discount} on the Nuvylux marketplace.` +
        (product.category ? ` Category: ${product.category}.` : ""),
      alternates: { canonical: `https://nuvylux.com/${slug}` },
      openGraph: {
        title: `${product.name} | Nuvylux`,
        description: `Shop ${product.name}${discount} on the Nuvylux marketplace.`,
        url: `https://nuvylux.com/${slug}`,
        type: "website",
        images: product.thumbnail
          ? [{ url: product.thumbnail, width: 1200, height: 630, alt: product.name }]
          : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

const ProductDetailPage = () => {
  return <ProductDetailClient />;
};

export default ProductDetailPage;
