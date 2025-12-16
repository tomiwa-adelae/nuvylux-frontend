import React from "react";
import { Zap, Shield, Globe, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const VMVSection = () => {
  const values = [
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We build the future, not follow trends, constantly integrating technology to elevate experience.",
    },
    {
      icon: Crown,
      title: "Exclusivity",
      description:
        "We commit to verified quality and premium standards, curating only the best in the industry.",
    },
    {
      icon: Globe,
      title: "Connectivity",
      description:
        "We fuse global talent with local access, creating a borderless ecosystem for creation and discovery.",
    },
    {
      icon: Shield,
      title: "Confidence",
      description:
        "We empower self-expression and identity, ensuring a privacy-first, trustworthy platform.",
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container max-w-6xl">
        <h3 className="font-semibold text-3xl text-center text-primary mb-8">
          Our Core Philosophy
        </h3>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          <Card>
            <CardContent>
              <h4 className="uppercase text-sm tracking-widest text-primary mb-2">
                Vision
              </h4>
              <p className="text-xl text-gray-800 font-medium">
                To illuminate a new era of beauty and innovation, where
                creativity, technology, and culture merge to redefine modern
                luxury globally.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h4 className="uppercase text-sm tracking-widest text-muted-foreground mb-2">
                Mission
              </h4>
              <p className="text-xl text-gray-800 font-medium">
                To connect creators and customers through technology that
                simplifies discovery, booking, and growth, ensuring quality,
                exclusivity, and empowerment.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values Grid */}
        <h4 className="font-semibold text-xl text-center mb-4 uppercase tracking-wider">
          Core Values
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {values.map((value, index) => (
            <div
              key={index}
              className="text-center p-6 border border-gray-300 bg-white rounded-lg shadow-sm"
            >
              <value.icon className="size-8 text-primary mx-auto mb-3" />
              <h5 className="font-bold text-lg text-primary mb-2">
                {value.title}
              </h5>
              <p className="text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
