// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image";
// import React from "react";

// export const Services = () => {
//   const services = [
//     {
//       icon: "/assets/icons/eye.svg",
//       title: "Lash Technicians",
//       description: "Extensions, lifts, and tinting",
//     },
//     {
//       icon: "/assets/icons/fingernails.svg",
//       title: "Nail Technicians",
//       description: "Manicures, pedicures, nail art",
//     },
//     {
//       icon: "/assets/icons/hairs.svg",
//       title: "Hair Stylists",
//       description: "Cuts, color, styling",
//     },
//     {
//       icon: "/assets/icons/makeup.svg",
//       title: "Makeup Artists",
//       description: "Events, bridal, photoshoots",
//     },
//   ];
//   return (
//     <div className="py-10">
//       <div className="container">
//         <div className="text-center">
//           <h3 className="font-semibold text-2xl md:text-3xl 2xl:text-4xl text-primary">
//             Beauty services
//           </h3>
//           <p className="text-muted-foreground text-sm md:text-base">
//             Book with our certified professionals
//           </p>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
//           {services.map((service, index) => (
//             <Card
//               key={index}
//               className="bg-primary/10 border-0 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
//             >
//               {/* Icon */}
//               <CardContent className="flex items-center justify-center flex-col">
//                 <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary">
//                   <Image
//                     src={service.icon}
//                     alt={service.title}
//                     className="w-8 h-8 invert"
//                     width={1000}
//                     height={1000}
//                   />
//                 </div>

//                 <h4 className="font-semibold text-lg md:text-xl mb-2 text-primary">
//                   {service.title}
//                 </h4>
//                 <p className="text-muted-foreground text-sm mb-4">
//                   {service.description}
//                 </p>

//                 <Button className="mt-auto w-full">Book Now</Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import Link from "next/link"; // Ensure Link is imported

export const Services = () => {
  // <-- Renamed component
  const services = [
    {
      icon: "/assets/icons/eye.svg",
      title: "Lash Technicians",
      description: "Extensions, lifts, and tinting expertise.",
      rating: 4.8,
    },
    {
      icon: "/assets/icons/fingernails.svg",
      title: "Nail Artists", // Used "Artists" for luxury tone
      description: "Manicures, pedicures, and bespoke nail art.",
      rating: 4.9,
    },
    {
      icon: "/assets/icons/hairs.svg",
      title: "Elite Hair Stylists", // Used "Elite" for luxury tone
      description: "Cuts, color consultations, and event styling.",
      rating: 4.7,
    },
    {
      icon: "/assets/icons/makeup.svg",
      title: "Verified MUA",
      description: "Bridal, editorial, and photoshoots expertise.",
      rating: 5.0,
    },
  ];
  return (
    <div className="py-12 bg-white">
      <div className="container">
        <div className="text-center mb-8">
          <h3 className="font-semibold text-2xl md:text-3xl 2xl:text-4xl text-primary">
            Explore Verified Professionals
          </h3>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Book trusted beauty and fashion experts near you, backed by AI and
            community reviews.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-2 mt-4">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 text-center transform hover:-translate-y-1"
            >
              <CardContent className="flex items-center justify-center flex-col p-6">
                {/* Icon Area - Simplified for a cleaner luxury look */}
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full border-2 border-primary bg-white">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    className="w-8 h-8 text-primary" // Assuming a way to color SVGs without 'invert' for dark backgrounds
                    width={32}
                    height={32}
                  />
                </div>

                <h4 className="font-semibold text-xl text-gray-900 mb-1">
                  {service.title}
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  {service.description}
                </p>

                {/* Rating/Trust Indicator */}
                <div className="flex items-center text-sm text-primary mb-4">
                  <span className="mr-1">⭐</span> {service.rating} (Verified)
                </div>

                <Button asChild className="mt-auto w-full">
                  <Link
                    href={`/marketplace/book/${service.title
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    Book Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global CTA */}
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/marketplace">View All 100+ Verified Experts</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
