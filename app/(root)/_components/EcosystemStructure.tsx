import React from "react";
import Link from "next/link";
import { Code, Users, BookOpen, LayoutGrid, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const EcosystemStructure = () => {
  const divisions = [
    {
      title: "Nuvylux",
      subtitle: "Flagship Luxury-Tech Brand",
      icon: LayoutGrid,
      color: "#2E8B57",
    },
    {
      title: "Auranova Labs",
      subtitle: "Innovation & Research (AI/R&D)",
      icon: Code,
      color: "#C1272D",
    },
    {
      title: "Auranova Academy",
      subtitle: "Education & Masterclasses",
      icon: BookOpen,
      color: "#C0C0C0",
    },
    {
      title: "Auranova Agency",
      subtitle: "Creative Services & Strategy",
      icon: DollarSign,
      color: "#0A0A0A",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container max-w-6xl text-center">
        <h3 className="font-semibold text-3xl md:text-4xl text-primary mb-4">
          A Global Architecture: The AURANOVA Group
        </h3>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
          Nuvylux is the flagship luxury-tech brand operating within the broader
          AURANOVA GROUP ecosystem. This strategic structure ensures specialized
          focus, scalability, and innovation dominance across industries.
        </p>

        <div className="lg:col-span-4 mb-10">
          <div className="p-6 bg-[#0A0A0A] text-white rounded-xl shadow-2xl inline-block max-w-md">
            <h4 className="text-lg font-bold uppercase tracking-widest">
              AURANOVA GROUP
            </h4>
            <p className="text-sm text-gray-400">
              Holding Company & Visionary Parent
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Central Holding Company Card (Stands out) */}

          {/* Divisions */}
          {divisions.map((division, index) => (
            <Card key={index}>
              <CardContent>
                <div className="flex items-center justify-center">
                  <division.icon
                    className="w-8 h-8 mb-3"
                    style={{ color: division.color }}
                  />
                </div>
                <h5 className="text-xl font-bold text-gray-900 mb-1">
                  {division.title}
                </h5>
                <p className="text-sm uppercase text-muted-foreground mb-3">
                  {division.subtitle}
                </p>
                <p className="text-gray-600 text-sm">
                  {division.title === "Nuvylux"
                    ? "The consumer-facing platform for beauty, fashion, AI, and community."
                    : "Specialized divisions providing R&D, education, and brand strategy services."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Button asChild>
            <Link href="/ecosystem">Explore Division Details</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
