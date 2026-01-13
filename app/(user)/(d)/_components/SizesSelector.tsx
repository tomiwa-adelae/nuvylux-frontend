"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { IconPlus, IconX } from "@tabler/icons-react";

interface SizesSelectorProps {
  initialSizes?: string[];
  onSizesChange: (sizes: string[]) => void;
}

const COMMON_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
];

export function SizesSelector({
  initialSizes = [],
  onSizesChange,
}: SizesSelectorProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialSizes);
  const [customSize, setCustomSize] = useState("");

  useEffect(() => {
    onSizesChange(selectedSizes);
  }, [selectedSizes, onSizesChange]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const addCustomSize = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customSize.trim()) {
      e.preventDefault();
      if (!selectedSizes.includes(customSize.trim())) {
        setSelectedSizes([...selectedSizes, customSize.trim()]);
      }
      setCustomSize("");
    }
  };

  return (
    <div className="space-y-3">
      <FormLabel>Available Sizes</FormLabel>

      {/* Selection Area */}
      <div className="flex flex-wrap gap-2">
        {COMMON_SIZES.map((size) => {
          const isSelected = selectedSizes.includes(size);
          return (
            <Button
              key={size}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="h-9 w-12"
              onClick={() => toggleSize(size)}
            >
              {size}
            </Button>
          );
        })}
      </div>

      {/* Custom Size Input */}
      <div className="flex items-center gap-2 max-w-[200px]">
        <Input
          placeholder="Custom size..."
          value={customSize}
          onChange={(e) => setCustomSize(e.target.value)}
          onKeyDown={addCustomSize}
          className="h-9"
        />
        <Button
          type="button"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => {
            if (customSize.trim()) {
              setSelectedSizes([...selectedSizes, customSize.trim()]);
              setCustomSize("");
            }
          }}
        >
          <IconPlus size={16} />
        </Button>
      </div>

      {/* Selected Sizes Badges (Visible if custom sizes added) */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedSizes
          .filter((s) => !COMMON_SIZES.includes(s))
          .map((size) => (
            <Badge
              key={size}
              variant="secondary"
              className="pl-2 pr-1 py-1 gap-1"
            >
              {size}
              <IconX
                size={14}
                className="cursor-pointer hover:text-destructive"
                onClick={() => toggleSize(size)}
              />
            </Badge>
          ))}
      </div>
    </div>
  );
}
