import React from "react";
import Image from "next/image";
import { Mail, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { teamMembers } from "@/constants";

export const TeamSection = () => {
  return (
    <section id="team" className="py-16 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold mb-4">
            The House Leadership
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team is a fusion of technology expertise, creative leadership,
            and deep cultural insight, driving innovation from Lagos to the
            world.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2">
          {teamMembers.map((member) => (
            <div key={member.name} className="text-center">
              {/* <img
                  src={member.photo}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-md object-cover mb-4"
                /> */}
              <div className="mb-4 aspect-square overflow-hidden rounded-lg">
                <Image
                  width={1000}
                  height={1000}
                  src={member.photo || "/placeholder.svg"}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <Link
                target="_blank"
                className="font-semibold hover:underline text-primary"
                href={member.url}
              >
                {member.name}
              </Link>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
