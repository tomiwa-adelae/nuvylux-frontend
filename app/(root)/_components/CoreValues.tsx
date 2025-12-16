import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Sparkles, Shirt, Users } from "lucide-react"; // Using Lucide for modern icons

export const CoreValues = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: "AI BeautyTech",
      description:
        "Personalized skin analysis, virtual consultations, and verified service bookings powered by innovation.",
    },
    {
      icon: Shirt,
      title: "Fashion Innovation",
      description:
        "Curated digital-first fashion experiences, styling recommendations, and exclusive global collections.",
    },
    {
      icon: Users,
      title: "Creator Community",
      description:
        "A global network providing masterclasses, mentorship, and tools for the next generation of luxury leaders.",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container">
        {/* Optional: Add a subtle headline to introduce the section */}
        <h2 className="text-center font-semibold text-xl text-primary mb-8 uppercase tracking-widest">
          The NUVYLUX Difference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {pillars.map((pillar, index) => (
            <Card
              key={index}
              className="border-0 shadow-xl transition-all duration-500 hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center space-x-4">
                <pillar.icon className="w-8 h-8 text-primary flex-shrink-0" />
                <CardTitle className="text-2xl font-serif text-gray-900">
                  {pillar.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {pillar.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
