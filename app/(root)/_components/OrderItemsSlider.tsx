"use client";
import { ImagesSlider } from "@/components/ui/images-slider";
import { useState } from "react";
import { motion } from "motion/react";
import { Logo } from "@/components/Logo";
import { NairaIcon } from "@/components/NairaIcon";
import { formatMoneyInput } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface OrderItemsSliderProps {
  items: any[];
}

export const OrderItemsSlider = ({ items }: OrderItemsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Map backend items to the format ImagesSlider expects
  const itemImages = items.map((item) => ({
    image: item.productImage, // using the productImage field from your JSON
  }));

  const currentItem = items[currentIndex];

  return (
    <div className="hidden md:block relative h-full">
      <ImagesSlider
        className="h-full min-h-screen"
        images={itemImages}
        onIndexChange={setCurrentIndex}
      >
        {currentItem && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="z-50 container text-white  absolute left-0 bottom-0 size-full bottom-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent pb-10 pt-20"
          >
            <div className="container flex flex-col justify-end space-y-2 items-start h-full">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs uppercase tracking-widest border border-white/20">
                In your order
              </div>

              <motion.h4 className="font-semibold text-3xl">
                {currentItem.productName}
              </motion.h4>

              <div className="flex items-center gap-4">
                <div className="text-lg font-medium text-green-400">
                  <NairaIcon /> {formatMoneyInput(Number(currentItem.price))}
                </div>
                <div className="h-4 w-[1px] bg-white/30" />
                <p className="text-muted-foreground">
                  Quantity:{" "}
                  <span className="text-white dark:text-black font-bold">
                    {currentItem.quantity}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 mt-2">
                {currentItem.size && (
                  <Badge variant="secondary" className="rounded-md">
                    SIZE: {currentItem.size}
                  </Badge>
                )}
                {currentItem.color && (
                  <Badge variant="secondary" className="rounded-md">
                    {currentItem.color}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </ImagesSlider>
    </div>
  );
};
