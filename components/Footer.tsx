import React from "react";
import Link from "next/link";
import { Mail, Instagram, Linkedin, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { IconMail, IconSend } from "@tabler/icons-react";

export const Footer = () => {
  const utilityLinks = [
    { title: "Legal & Privacy", href: "/legal" },
    { title: "Careers", href: "/careers" },
    { title: "Press Kit", href: "/press" },
    { title: "Terms of Service", href: "/terms-of-service" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/nuvylux" },
    { icon: Linkedin, href: "https://linkedin.com/company/nuvylux-global" },
    { icon: Twitter, href: "https://twitter.com/nuvylux" },
  ];

  return (
    <footer className="bg-[#0A0A0A] text-gray-300 border-t border-gray-800">
      <div className="container pt-8 pb-8">
        {/* Top Section: Newsletter & Brand Message */}
        {/* <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-700 pb-10 mb-10">
          <div className="mb-8 lg:mb-0">
            <h3 className="text-2xl text-white mb-2">Stay Illuminated.</h3>
            <p className="text-gray-400 max-w-lg">
              Subscribe for exclusive insights, creator spotlights, and the
              latest in beauty-tech innovation.
            </p>
          </div>

          <div className="w-full items-center justify-center lg:w-1/3 flex">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-transparent"
            />
            <Button className="ml-1" size={"icon-lg"}>
              <IconSend className="w-5 h-5" />
            </Button>
          </div>
        </div> */}

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {/* Column 1: Brand Identity */}
          <div>
            <Link
              href="/"
              className="uppercase text-2xl font-bold text-white tracking-widest hover:text-primary transition-colors"
            >
              Nuvylux
            </Link>
            <p className="text-sm mt-3 text-gray-500">
              The New Light of Luxury.
            </p>
          </div>

          {/* Column 2: Utility Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase text-sm">
              Company
            </h4>
            <ul className="space-y-3">
              {utilityLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase text-sm">
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <div className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                  <IconMail className="size-4 mr-2 text-primary" />
                  <a
                    href="mailto:nuvyluxgroup@gmail.com"
                    className="hover:underline"
                  >
                    nuvyluxgroup@gmail.com
                  </a>
                </div>
              </li>
              <li className="text-gray-400 text-sm">Lagos — Abuja — Ibadan</li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase text-sm">
              Follow
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-10 mt-10 border-t border-gray-800 text-center text-xs text-white">
          <p>&copy; {new Date().getFullYear()} NUVYLUX. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
