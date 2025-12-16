import React from "react";
import { Clock, Rocket, Zap, Users, Flag } from "lucide-react";

export const TimelineSection = () => {
  const milestones = [
    {
      year: 2023,
      title: "Foundational Blueprint",
      description:
        "Concept inception, AURANOVA Group formation, and initial market validation research.",
      icon: Flag,
      color: "text-[#C1272D]", // Crimson Red
    },
    {
      year: 2024,
      title: "Platform MVP Development",
      description:
        "NUVYLUX App core architecture build (Next.js/Node.js) and initial creator partnership acquisitions.",
      icon: Zap,
      color: "text-primary", // Till Green
    },
    {
      year: "2025 (Launch)",
      title: "Marketplace & AI Integration",
      description:
        "Public launch of the NUVYLUX Marketplace (MVP), Phase 1 AI Skin Analysis release, and Auranova Agency client acquisition.",
      icon: Rocket,
      color: "text-gray-900",
    },
    {
      year: "2 026+",
      title: "Global Scale & Academy",
      description:
        "Expansion into secondary markets, launch of the NUVYLUX Fashion line, and formal launch of Auranova Academy.",
      icon: Users,
      color: "text-[#C0C0C0]", // Platinum Silver
    },
  ];

  return (
    <section className="py-24 bg-gray-100">
      <div className="container max-w-4xl text-center">
        <h3 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
          Our Journey & Next Chapter
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
          We are building with intention. Our phased approach ensures stability,
          quality, and sustainable growth.
        </p>

        {/* Vertical Timeline Structure */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300 hidden md:block"></div>

          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`mb-12 flex ${
                index % 2 === 0
                  ? "justify-start md:justify-end"
                  : "justify-start"
              } w-full`}
            >
              {/* Content Block */}
              <div
                className={`w-full md:w-5/12 p-6 rounded-lg shadow-lg bg-white relative ${
                  index % 2 === 0
                    ? "md:mr-auto md:text-right"
                    : "md:ml-auto md:text-left"
                }`}
              >
                <h4 className="font-semibold text-xl mb-1">
                  {milestone.title}
                </h4>
                <p
                  className="text-sm uppercase font-medium mb-3"
                  style={{ color: milestone.color }}
                >
                  {milestone.year}
                </p>
                <p className="text-gray-600 text-sm">{milestone.description}</p>
              </div>

              {/* Icon (The Hub) */}
              <div className="w-1/12 hidden md:flex justify-center items-center relative">
                <div
                  className={`w-8 h-8 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center relative z-10`}
                  style={{ borderColor: milestone.color }}
                >
                  <milestone.icon
                    className={`w-4 h-4`}
                    style={{ color: milestone.color }}
                  />
                </div>
              </div>

              {/* Mobile Year Display */}
              <div className="w-full md:hidden text-left mb-2">
                <p
                  className="text-base font-semibold"
                  style={{ color: milestone.color }}
                >
                  {milestone.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
