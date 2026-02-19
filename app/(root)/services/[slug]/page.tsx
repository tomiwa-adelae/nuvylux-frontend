import type { Metadata } from "next";
import { ServiceDetailClient } from "../../_components/ServiceDetailClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const res = await fetch(`${backendUrl}/services/public/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return { title: "Service" };

    const service = await res.json();
    return {
      title: service.name,
      description:
        service.shortDescription ||
        `Book ${service.name} on Nuvylux — a verified professional service.`,
      alternates: { canonical: `https://nuvylux.com/services/${slug}` },
      openGraph: {
        title: `${service.name} | Nuvylux`,
        description:
          service.shortDescription || `Book ${service.name} on Nuvylux.`,
        url: `https://nuvylux.com/services/${slug}`,
        images: service.thumbnail
          ? [{ url: service.thumbnail, width: 1200, height: 630, alt: service.name }]
          : [],
      },
    };
  } catch {
    return { title: "Service" };
  }
}

const ServiceDetailPage = () => {
  return <ServiceDetailClient />;
};

export default ServiceDetailPage;
