import Link from "next/link";
import { Users, ShoppingBag, Landmark } from "lucide-react"; // Icons for the three main pillars
import { Button } from "@/components/ui/button";

export const EcosystemOverview = () => {
  const ecosystemPillars = [
    {
      icon: Users,
      title: "For Creators",
      tagline: "Visibility, Growth, & Influence",
      description:
        "Access data tools, verified booking platforms, and global masterclasses to elevate your professional practice and brand.",
      link: "/creators",
    },
    {
      icon: ShoppingBag,
      title: "For Customers",
      tagline: "Verified Bookings & Intelligence",
      description:
        "Discover verified beauty and fashion professionals, access AI-driven consultations, and book trusted, high-quality services.",
      link: "/customers",
    },
    {
      icon: Landmark, // Represents a company/brand structure
      title: "For Brands & Partners",
      tagline: "Strategy, Content, & Partnerships",
      description:
        "Collaborate with Nuvylux Agency for bespoke digital strategy, content creation, and technology integration.",
      link: "/partnerships",
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
            A seamless digital world connecting creators, customers, and
            innovation under one visionary platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {ecosystemPillars.map((pillar, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:border-[#C0C0C0]" // Platinum Silver border on hover
            >
              <pillar.icon className="w-10 h-10 text-primary mb-4" />{" "}
              {/* Till Green icon */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm uppercase text-gray-500 mb-4 tracking-wider">
                {pillar.tagline}
              </p>
              <p className="text-gray-600 mb-6">{pillar.description}</p>
              <Button
                variant="outline"
                asChild
                className="border-[#C0C0C0] text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <Link href={pillar.link}>Learn More</Link>
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
