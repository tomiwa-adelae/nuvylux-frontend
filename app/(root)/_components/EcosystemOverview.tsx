import Link from "next/link";
import {
  IconSparkles,
  IconCompass,
  IconBuildingStore,
  IconTools,
  IconStars,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export const EcosystemOverview = () => {
  const personas = [
    {
      icon: IconSparkles,
      title: "The Visionary",
      tagline: "Client",
      description:
        "Discover and book verified beauty and fashion professionals. Access AI-driven consultations and enjoy trusted, high-quality services tailored to you.",
      link: "/register?persona=client",
    },
    {
      icon: IconCompass,
      title: "The Architect",
      tagline: "Professional",
      description:
        "Offer your services as a makeup artist, hairstylist, photographer, or fashion stylist. Get verified, manage bookings, and grow your professional brand.",
      link: "/register?persona=professional",
    },
    {
      icon: IconBuildingStore,
      title: "The Brand",
      tagline: "Business",
      description:
        "List and sell your products — skincare, makeup, fashion, or beauty tech — to a curated audience actively seeking quality and authenticity.",
      link: "/register?persona=brand",
    },
    {
      icon: IconTools,
      title: "The Artisan",
      tagline: "Craft & Handmade",
      description:
        "Showcase handcrafted and custom-made creations. Connect with customers who value unique, artisan-quality beauty and fashion pieces.",
      link: "/register?persona=artisan",
    },
    {
      icon: IconStars,
      title: "The Curator",
      tagline: "Creator / Influencer",
      description:
        "Build influence, collaborate with brands, and monetise your aesthetic. Access data tools, brand partnerships, and global masterclasses.",
      link: "/register?persona=curator",
    },
  ];

  return (
    <section className="py-20 bg-gray-50/70">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary mb-3">
            The Nuvylux Ecosystem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One platform, five paths. Find where you belong and step into the
            Nuvylux world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {personas.map((persona, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-[#C0C0C0]"
            >
              <persona.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {persona.title}
              </h3>
              <p className="text-sm uppercase text-gray-500 mb-4 tracking-wider">
                {persona.tagline}
              </p>
              <p className="text-gray-600 mb-6">{persona.description}</p>
              <Button
                variant="outline"
                asChild
                className="border-[#C0C0C0] text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <Link href={persona.link}>Get Started</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/services">Explore All Offerings</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
