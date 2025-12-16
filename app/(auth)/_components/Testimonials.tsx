"use client";
import { ImagesSlider } from "@/components/ui/images-slider";
import { testimonials } from "@/constants";
import { useState } from "react";
import { motion } from "motion/react";
import { Logo } from "@/components/Logo";

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract only images for the slider
  const imageOnly = testimonials.map(({ image }) => ({ image }));
  return (
    <div className="hidden md:block relative">
      <div className="fixed top-2 left-2 z-50">
        <Logo color="white" />
      </div>
      <ImagesSlider
        className="h-full min-h-screen"
        images={imageOnly}
        onIndexChange={setCurrentIndex}
      >
        {testimonials[currentIndex] && (
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="z-50 container text-white flex absolute bottom-5 flex-col justify-end space-y-4 items-start"
          >
            <motion.h4 className="font-medium text-2xl lg:text-3xl">
              {testimonials[currentIndex].testimony}
            </motion.h4>
            <div>
              <h5 className="text-muted font-medium text-lg">
                {testimonials[currentIndex].name}
              </h5>
              <p className="text-sm text-muted-foreground">
                {testimonials[currentIndex].portfolio}
              </p>
            </div>
          </motion.div>
        )}
      </ImagesSlider>
    </div>
  );
};
