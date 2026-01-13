import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconBulb,
  IconDeviceLaptop,
  IconHeart,
  IconSchool,
  IconShoppingBag,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export const ServicesPillars = () => {
  return (
    <section id="pillars" className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="font-semibold text-2xl md:text-3xl 2xl:text-4xl text-primary text-center mb-8">
          The Nuvylux Core Capabilities
        </h2>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {/* Pillar 1: BeautyTech */}
          <ServicePillarCard
            icon={IconHeart}
            title="Nuvylux BeautyTech Services"
            valueStatement="Personalized beauty powered by technology and data."
            includes={[
              "AI skin analysis & beauty profiling",
              "Virtual consultations",
              "Smart product recommendations",
              "Creator discovery & booking tools",
            ]}
            ctas={[
              {
                label: "Try AI Analysis",
                href: "/beauty/analysis",
                primary: true,
              },
              { label: "Join as a Professional", href: "/beauty/join" },
            ]}
            imagePlaceholder=""
          />

          {/* Pillar 2: Fashion */}
          <ServicePillarCard
            icon={IconShoppingBag}
            title="Nuvylux Fashion Services"
            valueStatement="Fashion as identity, expression, and innovation."
            includes={[
              "Digital-first fashion collections",
              "Virtual styling & wardrobe planning",
              "Creator & designer collaborations",
              "Editorial fashion content",
            ]}
            ctas={[
              { label: "Explore Fashion", href: "/fashion", primary: true },
              { label: "Collaborate with Us", href: "/collaborate" },
            ]}
            imagePlaceholder=""
          />

          {/* Pillar 3: Academy */}
          <ServicePillarCard
            icon={IconSchool}
            title="Nuvylux Academy"
            valueStatement="We don’t just teach skills — we build futures."
            includes={[
              "Beauty & fashion masterclasses",
              "Creator mentorship programs",
              "Digital certifications",
              "Career development for creatives",
            ]}
            ctas={[
              { label: "View Programs", href: "/academy", primary: true },
              { label: "Apply to Academy", href: "/academy/apply" },
            ]}
            imagePlaceholder=""
          />

          {/* Pillar 4: Studio */}
          <ServicePillarCard
            icon={IconDeviceLaptop}
            title="Nuvylux Studio"
            valueStatement="Visual storytelling with cultural depth and global appeal."
            includes={[
              "Editorial shoots and Brand campaigns",
              "Creative direction and Content production",
              "Influencer & creator collaborations",
              "High-end visual asset creation",
            ]}
            ctas={[
              {
                label: "View Studio Work",
                href: "/studio/portfolio",
                primary: true,
              },
              { label: "Start a Project", href: "/studio/contact" },
            ]}
            imagePlaceholder=""
          />

          {/* Pillar 5: Labs */}
          <ServicePillarCard
            icon={IconBulb}
            title="Nuvylux Labs"
            valueStatement="Designing the future before it exists."
            includes={[
              "AI beauty & fashion tool development",
              "Product Research & Development (R&D)",
              "Digital platforms & systems",
              "Brand technology solutions",
            ]}
            ctas={[
              { label: "Learn About Labs", href: "/labs", primary: true },
              { label: "Partner with Nuvylux", href: "/labs/partner" },
            ]}
            imagePlaceholder=""
          />
        </div>
      </div>
    </section>
  );
};

export interface Cta {
  label: string;
  href: string;
  primary?: boolean;
}

export interface PillarCardProps {
  icon: React.ElementType;
  title: string;
  valueStatement: string;
  includes: string[];
  ctas: Cta[];
  imagePlaceholder: string;
}

export const ServicePillarCard: React.FC<PillarCardProps> = ({
  icon: Icon,
  title,
  valueStatement,
  includes,
  ctas,
  imagePlaceholder,
}) => (
  <Card>
    <CardContent>
      {imagePlaceholder}
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white mb-4 transition-transform hover:scale-110">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <CardTitle className="text-primary">{title}</CardTitle>
        <CardDescription>{valueStatement}</CardDescription>
      </div>

      <ul className="list-none space-y-3 mt-4">
        {includes.map((item, index) => (
          <li key={index} className="flex items-start text-gray-600">
            <IconSparkles className="h-4 w-4 text-primary-dark mr-3 mt-1 flex-shrink-0" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>

      <div className="border-gray-100 mt-4 space-y-2">
        {ctas.map((cta, index) => (
          <Button
            key={cta.label}
            asChild
            className="w-full"
            variant={index === 1 ? "outline" : "default"}
          >
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);
